// Vendored drop-in: deterministic geometry + motion model and the
// <table-of-content> custom element. Kept as JavaScript because the source is
// untyped and this project runs TypeScript in strict mode.
//
// Changes from upstream, all deliberate:
//   * adds a `toc-commit` event on pointer-up and Enter/Space. Upstream only
//     emits `toc-change`, which fires on every pointer move — navigating on
//     that would drag the page around as you scrub past sections.
//   * :host background defaults to transparent and font-family inherits, so
//     the rail sits on the page rather than on its own white panel.
//   * smaller title/description sizes and a narrower card, sized for a rail.
(function createTableOfContentModel(globalScope) {
  if (globalScope.TableOfContentModel) return;

  const GEOMETRY = Object.freeze({
    baseRemPixels: 16,
    stageHeight: 35.5,
    trackTop: 1.875,
    trackBottom: 33.625,
    hitTop: 0,
    hitHeight: 35.5,
    cardEdgeGap: 1.125,
    tickInfluenceSigma: 1.12,
  });

  const MOTION = Object.freeze({
    tickSpringStiffness: 845,
    tickSpringDamping: 58.5,
    tickSpringMaxStep: 1 / 120,
  });

  const LIMITS = Object.freeze({ maxItems: 200 });

  const DEFAULT_ITEMS = Object.freeze(
    Array.from({ length: 38 }, (_, index) =>
      Object.freeze({
        id: `content-${index + 1}`,
        title: `Content item ${index + 1}`,
        description: "Provide sections through the items property.",
      }),
    ),
  );

  function finiteNumber(value, fallback = 0) {
    if (value === null || value === undefined || value === "") return fallback;
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function normalizeIndex(value, count, fallback = 0) {
    const itemCount = Math.max(1, Math.trunc(finiteNumber(count, 1)));
    const index = Math.round(finiteNumber(value, fallback));
    return clamp(index, 0, itemCount - 1);
  }

  function normalizeItems(value) {
    if (!Array.isArray(value) || value.length === 0) {
      throw new TypeError("table-of-content.items must be a non-empty array.");
    }
    if (value.length > LIMITS.maxItems) {
      throw new RangeError(
        `table-of-content.items supports at most ${LIMITS.maxItems} items.`,
      );
    }

    return Array.from(value, (item, index) => {
      const record = item && typeof item === "object" ? item : {};
      const fallbackId = `content-${index + 1}`;
      const fallbackTitle = `Item ${index + 1}`;
      const id = String(record.id ?? "").trim() || fallbackId;
      const title = String(record.title ?? "").trim() || fallbackTitle;
      const description = String(record.description ?? "");
      return { id, title, description };
    });
  }

  function tickY(index, count) {
    const itemCount = Math.max(1, Math.trunc(finiteNumber(count, 1)));
    const intervals = Math.max(itemCount - 1, 1);
    const normalizedIndex = normalizeIndex(index, itemCount);
    const trackHeight = GEOMETRY.trackBottom - GEOMETRY.trackTop;
    return GEOMETRY.trackTop + (normalizedIndex / intervals) * trackHeight;
  }

  function selectionFromPointer(clientY, rectTop, rectHeight, count) {
    const height = finiteNumber(rectHeight, 0);
    if (height <= 0) return null;
    const pointerY = finiteNumber(clientY, rectTop);
    const top = finiteNumber(rectTop, 0);
    const localY =
      GEOMETRY.hitTop + ((pointerY - top) / height) * GEOMETRY.hitHeight;
    const center = clamp(localY, GEOMETRY.trackTop, GEOMETRY.trackBottom);
    const trackHeight = GEOMETRY.trackBottom - GEOMETRY.trackTop;
    const normalized = (center - GEOMETRY.trackTop) / trackHeight;
    const itemCount = Math.max(1, Math.trunc(finiteNumber(count, 1)));
    const floatIndex = normalized * Math.max(itemCount - 1, 1);
    return Object.freeze({
      center,
      floatIndex,
      index: normalizeIndex(floatIndex, itemCount),
    });
  }

  function tickInfluence(index, floatIndex) {
    if (floatIndex === null || floatIndex === undefined) return 0;
    const distance = finiteNumber(index, 0) - finiteNumber(floatIndex, 0);
    const sigma = GEOMETRY.tickInfluenceSigma;
    return Math.exp(-(distance * distance) / (2 * sigma * sigma));
  }

  function stepSpring(state, target, deltaSeconds, stiffness, damping, maxStep) {
    const safeTarget = finiteNumber(target, 0);
    const dt = clamp(finiteNumber(deltaSeconds, 0), 0, 1);
    const safeMaxStep = Math.max(finiteNumber(maxStep, 1 / 120), 1 / 1000);
    const steps = Math.max(1, Math.ceil(dt / safeMaxStep));
    const step = dt / steps;
    let value = finiteNumber(state?.value, safeTarget);
    let velocity = finiteNumber(state?.velocity, 0);
    const spring = Math.max(0, finiteNumber(stiffness, 0));
    const drag = Math.max(0, finiteNumber(damping, 0));
    for (let index = 0; index < steps; index += 1) {
      const acceleration = (safeTarget - value) * spring - velocity * drag;
      velocity += acceleration * step;
      value += velocity * step;
    }
    state.value = value;
    state.velocity = velocity;
    return state;
  }

  globalScope.TableOfContentModel = Object.freeze({
    GEOMETRY,
    LIMITS,
    MOTION,
    DEFAULT_ITEMS,
    clamp,
    finiteNumber,
    normalizeIndex,
    normalizeItems,
    selectionFromPointer,
    stepSpring,
    tickInfluence,
    tickY,
  });
})(globalThis);

(function registerTableOfContent(globalScope) {
  if (!globalScope.document || !globalScope.customElements || !globalScope.HTMLElement) return;

  const model = globalScope.TableOfContentModel;
  if (!model) throw new Error("Table of Content requires its model to load first.");

  const {
    DEFAULT_ITEMS, GEOMETRY, MOTION, clamp, normalizeIndex, normalizeItems,
    selectionFromPointer, stepSpring, tickInfluence, tickY,
  } = model;

  const { baseRemPixels: BASE_REM_PX, cardEdgeGap: CARD_EDGE_GAP, stageHeight: STAGE_HEIGHT } = GEOMETRY;
  const { tickSpringDamping: TICK_SPRING_DAMPING, tickSpringMaxStep: TICK_SPRING_MAX_STEP, tickSpringStiffness: TICK_SPRING_STIFFNESS } = MOTION;

  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {
        --toc-background: transparent;
        --toc-surface: #fff;
        --toc-ink: oklch(22% 0.008 250);
        --toc-copy: oklch(56% 0.008 250);
        --toc-line: oklch(88% 0.006 250);
        --toc-accent: oklch(51% 0.09 251);
        --toc-title-size: 0.9rem;
        --toc-description-size: 0.82rem;
        --toc-title-lines: 2;
        --toc-description-lines: 4;
        display: block; position: relative;
        inline-size: min(100%, 33rem); block-size: 35.5rem;
        overflow: visible; background: var(--toc-background); color: var(--toc-ink);
        contain: layout style; container-name: table-of-content; container-type: inline-size;
        isolation: isolate; font-size: 1rem;
        font-family: inherit; font-synthesis: none;
        -webkit-font-smoothing: antialiased; -webkit-tap-highlight-color: transparent;
      }
      [part="viewport"] { position: absolute; inset: 0; overflow: visible; background: var(--toc-background); }
      [part="stage"] { position: absolute; inset: 0; inline-size: 100%; block-size: 100%; }
      [part="rail"] {
        position: absolute; inset-inline-start: 0; inset-block-start: 0;
        inline-size: 4.25rem; block-size: 35.5rem; outline: none; cursor: pointer; touch-action: none;
      }
      [part="rail"]::before { content: ""; position: absolute; inset: -0.5rem -0.125rem; }
      [part="rail"]:focus-visible:not([data-pointer-focus])::after {
        content: ""; position: absolute; inset-inline-start: 0.6875rem; inset-block: 1.25rem;
        inline-size: 3rem; border: 0.1875rem solid var(--toc-accent); border-radius: 0.75rem; pointer-events: none;
      }
      [part="ticks"] { position: absolute; inset: 0; pointer-events: none; }
      [part="tick"] {
        --tick-y: 1.875rem; --tick-scale: 0.25;
        position: absolute; inset-inline-start: 1.1875rem; inset-block-start: 0;
        inline-size: 2.25rem; block-size: 0.1875rem; border-radius: 0.125rem;
        background: var(--toc-ink); opacity: 0.19;
        transform: translate3d(0, var(--tick-y), 0) scaleX(var(--tick-scale));
        transform-origin: left center; will-change: transform, opacity;
      }
      [part="card"] {
        --card-y: 1.125rem; --card-height: auto;
        position: absolute; inset-inline-start: 4.3125rem; inset-block-start: 0;
        inline-size: min(24rem, calc(100% - 4.8125rem)); block-size: var(--card-height);
        overflow: hidden; border: 0.0625rem solid var(--toc-line); border-radius: 1.125rem;
        background: var(--toc-surface);
        box-shadow: 0 1.0625rem 2.125rem oklch(0% 0 0 / 0.4);
        opacity: 0; transform: translate3d(0, var(--card-y), 0);
        transform-origin: left center; pointer-events: none; contain: layout; will-change: transform;
      }
      :host([data-open]) [part="card"] { opacity: 1; }
      [part="card-content"] {
        box-sizing: border-box; display: grid; grid-template-rows: auto auto; align-content: start;
        gap: 0.4rem; inline-size: 100%; block-size: 100%; padding: 0.8rem 0.95rem; overflow: hidden;
        transform: translateZ(0); transform-origin: left center; color: var(--toc-copy);
      }
      [part="card-content"][data-measuring] { block-size: auto; }
      [part="title"] {
        display: -webkit-box; min-inline-size: 0; margin: 0; overflow: hidden; color: var(--toc-ink);
        font-size: var(--toc-title-size); font-weight: 630; line-height: 1.4; letter-spacing: -0.012em;
        text-wrap: pretty; overflow-wrap: anywhere; -webkit-box-orient: vertical;
        -webkit-line-clamp: var(--toc-title-lines);
      }
      [part="description"] {
        display: -webkit-box; min-block-size: 0; margin: 0; overflow: hidden;
        font-size: var(--toc-description-size); font-weight: 430; line-height: 1.55;
        text-wrap: pretty; overflow-wrap: anywhere; -webkit-box-orient: vertical;
        -webkit-line-clamp: var(--toc-description-lines);
      }
      [hidden] { display: none !important; }
      @media (forced-colors: active) {
        [part="rail"]:focus-visible:not([data-pointer-focus])::after { border-color: Highlight; }
      }
    </style>
    <div part="viewport"><div part="stage">
      <div part="rail" tabindex="0" role="slider" aria-orientation="vertical" aria-valuemin="1" aria-valuenow="1">
        <div part="ticks" aria-hidden="true"></div>
      </div>
      <div part="card" aria-hidden="true"><div part="card-content">
        <div part="title"></div><p part="description"></p>
      </div></div>
    </div></div>`;

  class TableOfContent extends HTMLElement {
    static get observedAttributes() { return ["label", "value", "open"]; }

    constructor() {
      super();
      this.attachShadow({ mode: "open" }).append(template.content.cloneNode(true));
      this._rail = this.shadowRoot.querySelector('[part="rail"]');
      this._ticksRoot = this.shadowRoot.querySelector('[part="ticks"]');
      this._card = this.shadowRoot.querySelector('[part="card"]');
      this._cardContent = this.shadowRoot.querySelector('[part="card-content"]');
      this._title = this.shadowRoot.querySelector('[part="title"]');
      this._description = this.shadowRoot.querySelector('[part="description"]');
      this._items = DEFAULT_ITEMS.map((item) => ({ ...item }));
      this._pendingValue = this.getAttribute("value");
      this._tickNodes = []; this._tickMotion = [];
      this._selected = 0; this._floatIndex = null;
      this._targetCenter = this._tickY(0);
      this._targetHeight = 0; this._cardHeight = 0; this._heightVelocity = 0;
      this._targetY = this._targetCenter; this._cardY = this._targetY; this._yVelocity = 0;
      this._open = false; this._pointerInside = false; this._dragging = false;
      this._connected = false; this._settingValue = false;
      this._raf = 0; this._lastFrameTime = 0; this._closeTimer = 0;
      this._measureVersion = 0; this._lastInlineSize = 0; this._railRect = null;
      this._resizeObserver = null; this._contentResizeObserver = null;
      this._motionQuery = globalScope.matchMedia("(prefers-reduced-motion: reduce)");
      this._reducedMotion = this._motionQuery.matches;
      for (const m of ["_onResize","_onContentResize","_invalidateRailRect","_onPointerEnter","_onPointerMove","_onPointerLeave","_onPointerDown","_onPointerUp","_onKeyDown","_onFocus","_onBlur","_onMotionPreference","_animate"]) this[m] = this[m].bind(this);
      for (const property of ["items", "value", "open", "label"]) this._upgradeProperty(property);
    }

    _upgradeProperty(property) {
      if (!Object.prototype.hasOwnProperty.call(this, property)) return;
      const value = this[property]; delete this[property]; this[property] = value;
    }

    connectedCallback() {
      if (this._connected) return;
      this._connected = true;
      if (!this.hasAttribute("open")) { this._open = false; this.removeAttribute("data-open"); }
      this._renderTicks(); this._syncLabel();
      this._selected = normalizeIndex(this._pendingValue ?? this.getAttribute("value"), this._items.length);
      this._pendingValue = null;
      this._reflectValue(this._selected);
      this._targetCenter = this._tickY(this._selected);
      this._renderItem(false, true); this._updateMagnification(null, true); this._syncAria();
      this._rail.addEventListener("pointerenter", this._onPointerEnter);
      this._rail.addEventListener("pointermove", this._onPointerMove);
      this._rail.addEventListener("pointerleave", this._onPointerLeave);
      this._rail.addEventListener("pointerdown", this._onPointerDown);
      this._rail.addEventListener("pointerup", this._onPointerUp);
      this._rail.addEventListener("pointercancel", this._onPointerUp);
      this._rail.addEventListener("keydown", this._onKeyDown);
      this._rail.addEventListener("focus", this._onFocus);
      this._rail.addEventListener("blur", this._onBlur);
      this._motionQuery.addEventListener("change", this._onMotionPreference);
      globalScope.addEventListener("resize", this._invalidateRailRect, { passive: true });
      globalScope.addEventListener("scroll", this._invalidateRailRect, { capture: true, passive: true });
      this._resizeObserver = new ResizeObserver(this._onResize); this._resizeObserver.observe(this);
      this._contentResizeObserver = new ResizeObserver(this._onContentResize);
      this._contentResizeObserver.observe(this._title); this._contentResizeObserver.observe(this._description);
      if (this.hasAttribute("open")) this.select(this._selected, { open: true, emit: false });
    }

    disconnectedCallback() {
      this._connected = false;
      cancelAnimationFrame(this._raf); this._raf = 0; this._lastFrameTime = 0;
      clearTimeout(this._closeTimer); this._closeTimer = 0; this._measureVersion += 1;
      this._resizeObserver?.disconnect(); this._resizeObserver = null;
      this._contentResizeObserver?.disconnect(); this._contentResizeObserver = null;
      this._lastInlineSize = 0; this._railRect = null;
      this._motionQuery.removeEventListener("change", this._onMotionPreference);
      globalScope.removeEventListener("resize", this._invalidateRailRect);
      globalScope.removeEventListener("scroll", this._invalidateRailRect, true);
      this._pointerInside = false; this._dragging = false; this._floatIndex = null;
      this._rail.removeAttribute("data-pointer-focus");
      if (!this.hasAttribute("open")) { this._open = false; this.removeAttribute("data-open"); }
      this._rail.removeEventListener("pointerenter", this._onPointerEnter);
      this._rail.removeEventListener("pointermove", this._onPointerMove);
      this._rail.removeEventListener("pointerleave", this._onPointerLeave);
      this._rail.removeEventListener("pointerdown", this._onPointerDown);
      this._rail.removeEventListener("pointerup", this._onPointerUp);
      this._rail.removeEventListener("pointercancel", this._onPointerUp);
      this._rail.removeEventListener("keydown", this._onKeyDown);
      this._rail.removeEventListener("focus", this._onFocus);
      this._rail.removeEventListener("blur", this._onBlur);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;
      if (name === "label") this._syncLabel();
      if (name === "value" && !this._settingValue && !this._connected) this._pendingValue = newValue;
      if (name === "value" && !this._settingValue && this._connected) {
        this._pendingValue = null;
        const value = normalizeIndex(newValue, this._items.length, this._selected);
        this.select(value, { open: this._open, emit: false });
        this._reflectValue(value);
      }
      if (name === "open" && !this._connected && !this.hasAttribute("open")) { this._open = false; this.removeAttribute("data-open"); }
      if (name === "open" && this._connected) {
        if (this.hasAttribute("open")) this.select(this._selected, { open: true, emit: false });
        else if (!this._pointerInside && !this._rail.matches(":focus")) this._closeFromInteraction();
      }
    }

    get items() { return this._items.map((item) => ({ ...item })); }
    set items(value) {
      const requestedValue = this._pendingValue ?? this._selected;
      this._items = normalizeItems(value);
      this._pendingValue = null;
      this._selected = normalizeIndex(requestedValue, this._items.length);
      this._targetCenter = this._tickY(this._selected);
      this._floatIndex = this._open ? this._selected : null;
      this._reflectValue(this._selected);
      if (this._connected) {
        this._renderTicks(); this._renderItem(false, true);
        this._updateMagnification(this._floatIndex, true); this._updateTargetY(); this._syncAria();
      }
    }
    get value() { return this._selected; }
    set value(index) { this._pendingValue = this._connected ? null : index; this.select(index, { open: this._open, emit: this._connected }); }
    get open() { return this.hasAttribute("open"); }
    set open(value) { this.toggleAttribute("open", Boolean(value)); }
    get label() { return this.getAttribute("label") || ""; }
    set label(value) { if (value == null) this.removeAttribute("label"); else this.setAttribute("label", String(value)); }

    select(index, options = {}) {
      if (!this._items.length) return;
      const next = normalizeIndex(index, this._items.length);
      const shouldOpen = this.open || (options.open ?? true);
      this._targetCenter = this._tickY(next);
      this._floatIndex = next;
      this._setSelected(next, options.emit !== false);
      this._updateMagnification(next); this._updateTargetY(); this._setOpen(shouldOpen); this._startMotion();
    }

    close() {
      clearTimeout(this._closeTimer); this.open = false; this._setOpen(false);
      this._floatIndex = null; this._updateMagnification(null);
    }

    _closeFromInteraction() {
      if (this.open) return;
      this._setOpen(false); this._floatIndex = null; this._updateMagnification(null);
    }

    _renderTicks() {
      this._ticksRoot.replaceChildren();
      const fragment = document.createDocumentFragment();
      this._tickMotion = this._items.map(() => ({ value: 0, target: 0, velocity: 0 }));
      this._tickNodes = this._items.map((_, index) => {
        const tick = document.createElement("span");
        tick.setAttribute("part", "tick");
        tick.style.setProperty("--tick-y", `${this._tickY(index) - GEOMETRY.hitTop}rem`);
        fragment.append(tick);
        return tick;
      });
      this._ticksRoot.append(fragment);
      this._rail.setAttribute("aria-valuemax", String(this._items.length));
      this._renderTickFrame();
    }

    _tickY(index) { return tickY(index, this._items.length); }

    _rootRemPixels() {
      const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
      return Number.isFinite(rootSize) && rootSize > 0 ? rootSize : BASE_REM_PX;
    }

    _setSelected(index, emit) {
      if (this._connected) this._pendingValue = null;
      if (index === this._selected) return false;
      this._selected = index;
      this._reflectValue(index);
      this._renderItem(this._open, !this._open);
      this._syncAria();
      if (emit) {
        this.dispatchEvent(new CustomEvent("toc-change", {
          bubbles: true, composed: true,
          detail: { index, item: { ...this._items[index] } },
        }));
      }
      return true;
    }

    _reflectValue(index) {
      const value = String(index);
      if (this.getAttribute("value") === value) return;
      this._settingValue = true; this.setAttribute("value", value); this._settingValue = false;
    }

    _renderItem(animateHeight, immediateMeasure = false) {
      const item = this._items[this._selected];
      if (!item) return;
      this._title.textContent = item.title;
      this._description.textContent = item.description;
      this._description.hidden = !item.description;
      this._measureCard(animateHeight, immediateMeasure);
    }

    _measureCard(animateHeight, immediate = false) {
      const measureVersion = ++this._measureVersion;
      const measure = () => {
        if (measureVersion !== this._measureVersion || !this.isConnected) return;
        this._cardContent.toggleAttribute("data-measuring", true);
        const measured = Math.ceil(this._cardContent.scrollHeight) / this._rootRemPixels();
        this._cardContent.toggleAttribute("data-measuring", false);
        this._targetHeight = Math.min(measured, STAGE_HEIGHT - CARD_EDGE_GAP * 2);
        this._updateTargetY();
        if (!animateHeight || !this._open || this._reducedMotion) {
          this._cardHeight = this._targetHeight; this._heightVelocity = 0;
          this._cardY = this._targetY; this._yVelocity = 0; this._renderMotionFrame();
        } else this._startMotion();
      };
      if (immediate) measure(); else requestAnimationFrame(measure);
    }

    _setOpen(open) {
      const next = Boolean(open);
      if (next === this._open) return;
      this._open = next;
      if (next) {
        this._cardHeight = this._targetHeight; this._heightVelocity = 0;
        this._cardY = this._targetY; this._yVelocity = 0; this._renderMotionFrame();
      }
      this.toggleAttribute("data-open", next);
      this.dispatchEvent(new CustomEvent(next ? "toc-open" : "toc-close", {
        bubbles: true, composed: true, detail: { index: this._selected },
      }));
    }

    _updateMagnification(floatIndex, snap = false) {
      this._tickMotion.forEach((motion, index) => {
        motion.target = floatIndex === null ? 0 : tickInfluence(index, floatIndex);
        if (snap || this._reducedMotion) { motion.value = motion.target; motion.velocity = 0; }
      });
      if (snap || this._reducedMotion) this._renderTickFrame(); else this._startMotion();
    }

    _selectFromPointer(event) {
      const rect = this._railRect ?? this._rail.getBoundingClientRect();
      this._railRect = rect;
      const selection = selectionFromPointer(event.clientY, rect.top, rect.height, this._items.length);
      if (!selection) return;
      this._targetCenter = selection.center;
      this._floatIndex = selection.floatIndex;
      this._updateMagnification(selection.floatIndex);
      this._setSelected(selection.index, true);
      this._updateTargetY(); this._setOpen(true); this._startMotion();
    }

    _updateTargetY() {
      this._targetY = clamp(this._targetCenter - this._targetHeight / 2, CARD_EDGE_GAP, STAGE_HEIGHT - this._targetHeight - CARD_EDGE_GAP);
    }

    _startMotion() {
      if (this._reducedMotion) {
        this._cardY = this._targetY; this._cardHeight = this._targetHeight;
        this._yVelocity = 0; this._heightVelocity = 0;
        this._tickMotion.forEach((m) => { m.value = m.target; m.velocity = 0; });
        this._renderMotionFrame(); this._renderTickFrame(); return;
      }
      if (this._raf) return;
      this._lastFrameTime = performance.now();
      this._raf = requestAnimationFrame(this._animate);
    }

    _animate(now) {
      const dt = Math.min((now - this._lastFrameTime) / 1000, 0.032);
      this._lastFrameTime = now;
      const yAcceleration = (this._targetY - this._cardY) * 430 - this._yVelocity * 41;
      this._yVelocity += yAcceleration * dt; this._cardY += this._yVelocity * dt;
      const heightAcceleration = (this._targetHeight - this._cardHeight) * 460 - this._heightVelocity * 43;
      this._heightVelocity += heightAcceleration * dt; this._cardHeight += this._heightVelocity * dt;
      let ticksSettled = true;
      this._tickMotion.forEach((motion) => {
        stepSpring(motion, motion.target, dt, TICK_SPRING_STIFFNESS, TICK_SPRING_DAMPING, TICK_SPRING_MAX_STEP);
        if (Math.abs(motion.target - motion.value) >= 0.0005 || Math.abs(motion.velocity) >= 0.005) ticksSettled = false;
      });
      this._renderMotionFrame(); this._renderTickFrame();
      const cardSettled =
        Math.abs(this._targetY - this._cardY) < 0.005 && Math.abs(this._yVelocity) < 0.05 &&
        Math.abs(this._targetHeight - this._cardHeight) < 0.005 && Math.abs(this._heightVelocity) < 0.05;
      if (cardSettled && ticksSettled) {
        this._cardY = this._targetY; this._cardHeight = this._targetHeight;
        this._yVelocity = 0; this._heightVelocity = 0;
        this._tickMotion.forEach((m) => { m.value = m.target; m.velocity = 0; });
        this._renderMotionFrame(); this._renderTickFrame(); this._raf = 0; return;
      }
      this._raf = requestAnimationFrame(this._animate);
    }

    _renderMotionFrame() {
      this._card.style.setProperty("--card-y", `${this._cardY.toFixed(4)}rem`);
      this._card.style.setProperty("--card-height", `${this._cardHeight.toFixed(4)}rem`);
    }

    _renderTickFrame() {
      this._tickNodes.forEach((tick, index) => {
        const influence = clamp(this._tickMotion[index]?.value ?? 0, 0, 1);
        const width = 0.5 + 1.75 * influence;
        tick.style.setProperty("--tick-scale", (width / 2.25).toFixed(4));
        tick.style.opacity = (0.19 + 0.78 * influence).toFixed(3);
      });
    }

    _onPointerEnter(event) {
      this._pointerInside = true;
      this._railRect = this._rail.getBoundingClientRect();
      clearTimeout(this._closeTimer);
      this._selectFromPointer(event);
    }
    _onPointerMove(event) { if (this._pointerInside || this._dragging) this._selectFromPointer(event); }
    _onPointerLeave(event) {
      this._pointerInside = false;
      if (this._dragging || event.pointerType === "touch") return;
      this._railRect = null; clearTimeout(this._closeTimer);
      this._closeTimer = globalScope.setTimeout(() => this._closeFromInteraction(), 80);
    }
    _onPointerDown(event) {
      if (!event.isPrimary || event.button > 0) return;
      this._dragging = true;
      this._railRect = this._rail.getBoundingClientRect();
      this._rail.setAttribute("data-pointer-focus", "");
      this._rail.focus({ preventScroll: true });
      this._rail.setPointerCapture(event.pointerId);
      this._selectFromPointer(event);
    }
    _onPointerUp(event) {
      if (!this._dragging) return;
      this._dragging = false;
      if (this._rail.hasPointerCapture(event.pointerId)) this._rail.releasePointerCapture(event.pointerId);
      if (!this._pointerInside) this._railRect = null;
      this.dispatchEvent(new CustomEvent("toc-commit", {
        bubbles: true, composed: true,
        detail: { index: this._selected, item: { ...this._items[this._selected] } },
      }));
      if (event.pointerType === "touch") {
        clearTimeout(this._closeTimer);
        this._closeTimer = globalScope.setTimeout(() => this._closeFromInteraction(), 1400);
      }
    }
    _onKeyDown(event) {
      this._rail.removeAttribute("data-pointer-focus");
      let next = null;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = this._selected - 1;
      else if (event.key === "ArrowDown" || event.key === "ArrowRight") next = this._selected + 1;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = this._items.length - 1;
      else if (event.key === "Escape") { event.preventDefault(); this.close(); return; }
      else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent("toc-commit", {
          bubbles: true, composed: true,
          detail: { index: this._selected, item: { ...this._items[this._selected] } },
        }));
        return;
      } else return;
      event.preventDefault();
      this.select(next, { open: true });
    }
    _onFocus() {
      clearTimeout(this._closeTimer);
      if (this._rail.hasAttribute("data-pointer-focus")) return;
      this.select(this._selected, { open: true, emit: false });
    }
    _onBlur() {
      this._rail.removeAttribute("data-pointer-focus");
      if (!this._pointerInside) this._closeFromInteraction();
    }
    _onResize(entries) {
      const inlineSize = entries[0]?.contentRect.width ?? 0;
      if (!this._connected || !inlineSize || Math.abs(inlineSize - this._lastInlineSize) < 0.5) return;
      this._lastInlineSize = inlineSize; this._invalidateRailRect(); this._measureCard(this._open);
    }
    _onContentResize() { if (this._connected) this._measureCard(this._open); }
    _invalidateRailRect() { this._railRect = null; }
    _onMotionPreference(event) {
      this._reducedMotion = event.matches;
      if (event.matches) {
        cancelAnimationFrame(this._raf); this._raf = 0;
        this._cardY = this._targetY; this._cardHeight = this._targetHeight;
        this._yVelocity = 0; this._heightVelocity = 0;
        this._tickMotion.forEach((m) => { m.value = m.target; m.velocity = 0; });
        this._renderMotionFrame(); this._renderTickFrame();
      }
    }
    _syncLabel() { this._rail?.setAttribute("aria-label", this.getAttribute("label") || "Table of content"); }
    _syncAria() {
      const item = this._items[this._selected];
      if (!item) return;
      this._rail.setAttribute("aria-valuenow", String(this._selected + 1));
      this._rail.setAttribute("aria-valuetext", [`${this._selected + 1} of ${this._items.length}: ${item.title}`, item.description].filter(Boolean).join(". "));
    }
  }

  const registered = customElements.get("table-of-content");
  if (!registered) customElements.define("table-of-content", TableOfContent);
  globalScope.TableOfContent = registered || TableOfContent;
})(globalThis);

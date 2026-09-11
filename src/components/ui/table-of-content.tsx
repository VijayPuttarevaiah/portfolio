"use client";

import * as React from "react";
import "./table-of-content-element.js";

export type TableOfContentItem = {
  id: string;
  title: string;
  description?: string;
};

export type TableOfContentProps = {
  items: TableOfContentItem[];
  value?: number;
  open?: boolean;
  label?: string;
  className?: string;
  /** Fired when a selection is committed — pointer release or Enter. */
  onCommit?: (index: number) => void;
};

type TocElement = HTMLElement & {
  items: TableOfContentItem[];
  value: number;
  open: boolean;
};

const TableOfContent = React.forwardRef<HTMLElement, TableOfContentProps>(
  function TableOfContent(
    { items, value = 0, open = false, label = "Table of content", className, onCommit },
    forwardedRef,
  ) {
    const elementRef = React.useRef<HTMLElement | null>(null);
    React.useImperativeHandle(forwardedRef, () => elementRef.current!, []);

    React.useLayoutEffect(() => {
      const element = elementRef.current as TocElement | null;
      if (!element) return;
      element.items = items;
      element.value = value;
      element.open = open;
    }, [items, open, value]);

    // Selection changes constantly while scrubbing; only a commit navigates.
    React.useEffect(() => {
      const element = elementRef.current;
      if (!element || !onCommit) return;
      const handler = (event: Event) => {
        const detail = (event as CustomEvent<{ index: number }>).detail;
        if (detail) onCommit(detail.index);
      };
      element.addEventListener("toc-commit", handler);
      return () => element.removeEventListener("toc-commit", handler);
    }, [onCommit]);

    return React.createElement("table-of-content", {
      ref: elementRef,
      className,
      label,
    });
  },
);

export default TableOfContent;

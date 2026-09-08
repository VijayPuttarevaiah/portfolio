export const particleVertex = /* glsl */ `
uniform float uTime;
uniform vec2 uPointer;
uniform float uVelocity;
attribute float aSeed;
varying float vAlpha;
void main() {
  vec3 p = position;
  p.x += sin(uTime * .23 + aSeed * 30.0) * .17;
  p.y += cos(uTime * .17 + aSeed * 20.0) * .13;
  vec2 delta = p.xy - uPointer;
  float distanceToPointer = length(delta);
  p.xy += normalize(delta + vec2(.001)) * exp(-distanceToPointer * 2.0) * .8;
  p.z += sin(p.x * 1.8 + uTime * .25) * (.15 + uVelocity * .06);
  vec4 view = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * view;
  gl_PointSize = min(6.0, (1.3 + aSeed * 2.5) * (4.0 / -view.z));
  vAlpha = .15 + aSeed * .55;
}`;
export const particleFragment = /* glsl */ `
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - .5);
  float glow = smoothstep(.5, .04, d);
  gl_FragColor = vec4(mix(vec3(.45, .84, 1.0), vec3(.68, .48, 1.0), vAlpha), glow * vAlpha);
}`;
export const screenVertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
export const screenFragment = /* glsl */ `
uniform float uTime;
uniform float uAspect;
uniform float uSpeed;
uniform vec2 uPointer;
uniform vec2 uTrail;
varying vec2 vUv;
float random(vec2 p) { return fract(sin(dot(p,vec2(12.9898,78.233))) * 43758.5453); }
void main() {
  vec2 ratio = vec2(uAspect,1.0);
  float d = length((vUv-uPointer)*ratio);
  float tail = length((vUv-uTrail)*ratio);
  float orb = exp(-d * 180.0) * .7 + exp(-d * 24.0) * .07 + exp(-tail * 55.0) * .10;
  float texture = random(floor(vUv * vec2(900.0*uAspect,900.0)) + floor(uTime*12.0));
  float vignette = smoothstep(.30,.85,length((vUv-.5)*vec2(1.0,.8))) * .2;
  float split = exp(-length((vUv-uPointer-vec2(uSpeed*.003,0.0))*ratio)*100.0)*uSpeed*.03;
  vec3 color = vec3(.48,.80,1.0)*(orb+split) + vec3(texture*.015);
  gl_FragColor = vec4(color, clamp(orb + vignette + .018,0.0,.8));
}`;
export const wireVertex = /* glsl */ `
uniform float uTime;
uniform float uSpeed;
varying float vDepth;
void main() {
 vec3 p = position * (1.0 + sin(position.y*3.0+uTime*.4)*uSpeed*.045);
 vDepth = p.z;
 gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
}`;
export const wireFragment = /* glsl */ `
uniform float uOpacity;
varying float vDepth;
void main() { gl_FragColor = vec4(vec3(.8,.76,.73), uOpacity * (.12 + (vDepth+2.0)*.07)); }
`;

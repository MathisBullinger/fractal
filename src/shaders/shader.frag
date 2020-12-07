precision mediump float;

vec2 multiply(vec2 a, vec2 b) {
  return vec2(
    a.x * b.x - a.y * b.y,
    a.x * b.y + a.y * b.x
  );
}

uniform int iterations;
uniform float width;
uniform float height;
uniform float scale;
uniform vec2 center;
uniform float colorShift;

int mandelbrot(vec2 c) {
  vec2 z = vec2(0.0, 0.0);
  int n;
  
  for (int i = 0; i < 10000; i++) {
    if (i > iterations) break;
    n = i;
    z = multiply(z, z) + c;
    if (length(z) > 2.0) break;
  }
  
  return n;
}

float hue2rgb(float p, float q, float t) {
  if (t < 0.0) t += 1.0;
  if (t > 1.0) t -= 1.0;
  if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
  if (t < 1.0 / 2.0) return q;
  if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
  return p;
}

vec3 hsl(float h, float s, float l) {
  float r, g, b;
  if (s == 0.0) {
    r = g = b = l;
  } else {
    float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
    float p = 2.0 * l - q;
    r = hue2rgb(p, q, h + 1.0 / 3.0);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1.0 / 3.0);
  }
  return vec3(r, g, b);
}

vec3 palette(float t, float shift) {
  if (shift > 0.0) {
    t += shift;
    if (t >= 1.0) t = 1.0 - t;
  }
  return hsl(t, 1.0, 0.5);
}

void main() {
  vec2 uv = gl_FragCoord.xy / vec2(height);
  uv.x -= (width - height) / height / 2.0;

  vec2 c = center + (uv * 4.0 - vec2(2.0)) * (scale / 4.0);

  int m = mandelbrot(c);

  gl_FragColor = m < iterations ? vec4(palette(float(m) / float(iterations), colorShift), 1.0) : vec4(vec3(0.0), 1.0);
}

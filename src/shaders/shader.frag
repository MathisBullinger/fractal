precision mediump float;

vec2 multiply(vec2 a, vec2 b) {
  return vec2(
    a.x * b.x - a.y * b.y,
    a.x * b.y + a.y * b.x
  );
}

int maxIter = 80;

int mandelbrot(vec2 c) {
  vec2 z = vec2(0.0, 0.0);
  int n;
  
  for (int i = 0; i < 10000; i++) {
    n = i;
    z = multiply(z, z) + c;
    if (length(z) > 2.0) break;
  }
  
  return n;
}

uniform float width;
uniform float height;

void main() {
  vec2 uv = gl_FragCoord.xy / vec2(height);
  uv.x -= (width - height) / height / 2.0;

  vec2 center = vec2(-0.5, 0.0);
  float zoomSize = 3.3;

  vec2 c = center + (uv * 4.0 - vec2(2.0)) * (zoomSize / 4.0);

  int m = mandelbrot(c);

  gl_FragColor = m <= maxIter ? vec4(vec3(float(m) / float(maxIter)), 1.0) : vec4(vec3(0.0), 1.0);
}

varying vec2 vUv;
uniform float time;

void main() {
    vUv = uv;

    float scaleFactor = 1.0 + 0.15 * sin(4.0*time);
    vec3 newPosition = position * scaleFactor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
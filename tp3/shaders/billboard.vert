varying vec2 vUv;

uniform sampler2D lgrayTexture;

void main() {
    vUv = uv;

    float z_offset = texture2D(lgrayTexture, vUv).r;
    vec3 offset = normal * z_offset * 3.0;
    vec3 displacedPosition = position + offset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
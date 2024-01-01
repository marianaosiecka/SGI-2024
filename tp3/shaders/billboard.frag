 varying vec2 vUv;

uniform sampler2D rgbTexture;

void main() {
    vec3 rgbColor = texture2D(rgbTexture, vUv).rgb;
    gl_FragColor = vec4(rgbColor, 1.0);
}
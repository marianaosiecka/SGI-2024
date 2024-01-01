varying vec2 vUv;

uniform sampler2D map;

void main() {
    vec3 rgbColor = texture2D(map, vUv).rgb;
    gl_FragColor = vec4(rgbColor, 1.0);
}
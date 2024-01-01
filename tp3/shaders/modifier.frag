varying vec2 vUv;        
uniform sampler2D text;

void main() {
    vec4 color = texture2D(text, vUv);
    gl_FragColor = vec4(color.rgb, color.a);
}
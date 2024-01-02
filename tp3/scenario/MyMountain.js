import * as THREE from 'three';
import { MyShader } from '../MyShader.js';

class MyMountain extends THREE.Object3D{
    constructor(app) {
        super()
        this.app = app;
        
        let texture = new THREE.TextureLoader().load('textures/mountain.png');
        let heightMap = new THREE.TextureLoader().load('textures/mountain_height_map.png');

        // shader
        const vertexShader = `
            varying vec2 vUv;

            uniform sampler2D heightMap;
            
            void main() {
                vUv = uv;
            
                float z_offset = texture2D(heightMap, vUv).g;
                vec3 offset = normal * z_offset * 500.0;
                vec3 displacedPosition = position + offset;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
            }
        `;

        const fragmentShader = `
            varying vec2 vUv;

            uniform sampler2D map;
            
            void main() {
                vec3 rgbColor = texture2D(map, vUv).rgb;
                gl_FragColor = vec4(rgbColor, 1.0);
            }
        `;

        this.shader = new THREE.ShaderMaterial({
            uniforms: {
                "map": { type: "sampler2D", value: texture },
                "heightMap": { type: "sampler2D", value: heightMap },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        let mountain = new THREE.Mesh(new THREE.PlaneGeometry(300, 300, 100, 100), this.shader.material);
        this.add(mountain);
    }    

}

export { MyMountain }
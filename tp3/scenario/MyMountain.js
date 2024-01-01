import * as THREE from 'three';
import { MyShader } from '../MyShader.js';

class MyMountain extends THREE.Object3D{
    constructor(app) {
        super()
        this.app = app;
        
        let texture = new THREE.TextureLoader().load('textures/mountain.png');
        let heightMap = new THREE.TextureLoader().load('textures/mountain_height_map.png');

        this.shader = new MyShader(
            this.app,
            "mountain",
            "mountain shader",
            'shaders/mountain.vert',
            'shaders/mountain.frag',
            {
                "map": { type: "sampler2D", value: texture },
                "heightMap": { type: "sampler2D", value: heightMap },
            }
        )

        this.createMountain();
    }

    createMountain() {
        if(!this.shader.ready){
            setTimeout(this.createMountain.bind(this), 100);
            return;
        }

        let mountain = new THREE.Mesh(new THREE.PlaneGeometry(300, 300, 100, 100), this.shader.material);
        this.add(mountain);
    }

    

}

export { MyMountain }
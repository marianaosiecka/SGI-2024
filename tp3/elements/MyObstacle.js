import * as THREE from 'three';
import { MyShader } from '../MyShader.js';

class MyObstacle extends THREE.Object3D {
    constructor(app, type, texture, rotate, layer) {
        super();
        this.app = app;
        this.type = type;
        this.texture = texture;
        this.rotate = rotate;
        this.layer = layer;

        this.geometry = new THREE.PlaneGeometry(6, 6);

        this.shader = new MyShader(
            this.app,
            "obstacle",
            "obstacle shader",
            'shaders/modifier.vert',
            'shaders/modifier.frag',
            {
                "time": { type: "f", value: 0 },
                "text": { type: "sampler2D", value: this.texture },
            }
        )
        
        this.createObstacle();
    }

    createObstacle() {
        if(!this.shader.ready){
            setTimeout(this.createObstacle.bind(this), 100);
            return;
        }

        this.shader.material.transparent = true;
        this.shader.material.side = THREE.DoubleSide;

        this.mesh = new THREE.Mesh(this.geometry, this.shader.material);
        this.mesh.layers.enable(this.layer);
        this.mesh.rotation.x = this.rotate;
        
        if (this.rotate !== Math.PI/2){
            this.mesh.position.set(0, 2, 0);
            this.mesh.rotation.y = Math.PI/2;
        }
        else{
            this.mesh.position.set(0, -1, 0);
            this.mesh.scale.set(1.8, 1.8, 1.8);
        }

        this.name = "obstacle";
        this.add(this.mesh);
    }

    setBoundingBox() {
        this.bb = new THREE.Box3().setFromObject(this);
    }

    applyModifier(playerVehicle) {
        if(this.type == "slip"){
            playerVehicle.slipping = true;
        }
    }

    stopModifier(playerVehicle) {
        if(this.type == "slip"){
            playerVehicle.slipping = false;
        }
    }

}

MyObstacle.prototype.isGroup = true;
export { MyObstacle };
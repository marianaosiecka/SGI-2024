import * as THREE from 'three';
import { MyObstacle } from './MyObstacle.js';
import { MyScenario } from '../scenario/MyScenario.js';
import { MyShader } from '../MyShader.js';

class MyPowerUp extends THREE.Object3D {
    
    constructor(app, type, texture, rotate) {
        super();
        this.app = app;
        this.type = type;
        this.texture = texture;
        this.rotate = rotate;
        this.mesh = null;
        this.pointer = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 0.1;
        this.raycaster.far = 100;
        
        this.geometry = new THREE.PlaneGeometry(6, 6);

        this.shader = new MyShader(
            this.app,
            "power up",
            "power up shader",
            'shaders/modifier.vert',
            'shaders/modifier.frag',
            {
                "time": { type: "f", value: 0 },
                "text": { type: "sampler2D", value: this.texture },
            }
        )

        this.createPowerUp();
    }

    createPowerUp() {
        if(!this.shader.ready){
            setTimeout(this.createPowerUp.bind(this), 100);
            return;
        }

        this.shader.material.transparent = true;
        this.shader.material.side = THREE.DoubleSide;
        this.mesh = new THREE.Mesh(this.geometry, this.shader.material);
        this.mesh.position.set(0, 2.2, 0);
        this.mesh.rotation.y = Math.PI/2 + this.rotate;
        this.add(this.mesh);
    }

    setBoundingBox() {
        this.bb = new THREE.Box3().setFromObject(this);
    }

    setDestinationPoint(destinationPoint) {
        this.animationDestPosition = destinationPoint;
    }

    applyModifier(playerVehicle, obstacles, track){
        if(this.type == "shield"){
            playerVehicle.shield = true;
        }
        else if(this.type == "speed"){
            if(!playerVehicle.speeding){
                playerVehicle.maxVelocity *= 2;
                playerVehicle.speeding = true;  
            }
        } 
        else if(this.type == "pick"){
            this.app.contents.paused = true;
            //this.app.smoothCameraTransition("ObstaclePerspective", 100);
            //this.app.contents.selectedLayer = obstacles[0].layer;
        } 
    }

    stopModifier(playerVehicle) {
        if(this.type == "shield"){
            playerVehicle.shield = false;
        }
        else if (this.type == "speed"){
            if(playerVehicle.speeding){
                playerVehicle.maxVelocity /= 2;
                playerVehicle.speeding = false;
            }
        }

    }

}

MyPowerUp.prototype.isGroup = true;
export { MyPowerUp };
import * as THREE from 'three';

class MyPowerUp extends THREE.Object3D {
    
    constructor(app, type, texture, rotation) {
        super();
        this.app = app;
        this.type = type;
        this.texture = texture;
        this.mesh = null;
        
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
        this.mesh = new THREE.Mesh(geometry, this.shader.material);
        this.mesh.position.set(0, 2.2, 0);
        this.mesh.rotation.y = Math.PI/2 + rotation;
        this.add(this.mesh);
    }

    setBoundingBox() {
        this.bb = new THREE.Box3().setFromObject(this);
    }

    setDestinationPoint(destinationPoint) {
        this.animationDestPosition = destinationPoint;
    }

    applyModifier(playerVehicle){
        if(this.type == "shield"){
            playerVehicle.shield = true;
        }
        else if(this.type == "speed"){
            if(!playerVehicle.speeding){
                playerVehicle.maxVelocity *= 2;
                playerVehicle.speeding = true;  
            }
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
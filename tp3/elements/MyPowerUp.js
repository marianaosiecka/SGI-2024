import * as THREE from 'three';

class MyPowerUp extends THREE.Object3D {
    
    constructor(app, type, texture) {
        super();
        this.app = app;
        this.type = type;

        let geometry = new THREE.PlaneGeometry(6, 6);
        let material = new THREE.MeshPhongMaterial({ transparent:true, side: THREE.DoubleSide });
        material.map = texture;

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 1.5, 0);
        this.mesh.rotation.y = Math.PI/2;

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
            if (playerVehicle.velocity + 1.1*playerVehicle.velocity < playerVehicle.maxVelocity){
                playerVehicle.velocity *= 1.1;
                playerVehicle.speeding = true;  
            }  
        }
    }

    stopModifier(playerVehicle){
        if(this.type == "shield"){
            playerVehicle.shield = false;
        }
        else if (this.type == "speed"){
            if(playerVehicle.speeding){
                playerVehicle.velocity /= 1.1;
                playerVehicle.speeding = false;
            }
        }
    }

}

MyPowerUp.prototype.isGroup = true;
export { MyPowerUp };
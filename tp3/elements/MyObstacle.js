import * as THREE from 'three';

class MyObstacle extends THREE.Object3D {
    constructor(app, type, texture, rotate) {
        super();
        this.app = app;
        this.type = type;

        let geometry = new THREE.PlaneGeometry(6, 6);
        let material = new THREE.MeshPhongMaterial({ transparent:true, side: THREE.DoubleSide });
        material.map = texture;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = rotate;
        
        if (rotate !== Math.PI/2){
            this.mesh.position.set(0, 1.5, 0);
            this.mesh.rotation.y = Math.PI/2;
        }
        else{
            this.mesh.position.set(0, -1, 0);
            this.mesh.scale.set(1.8, 1.8, 1.8);
        }

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
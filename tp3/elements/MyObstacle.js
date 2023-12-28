import * as THREE from 'three';

class MyObstacle extends THREE.Object3D {
    constructor(app, type, texture, color, layer) {
        super();
        this.app = app;
        this.type = type;

        let geometry = new THREE.CylinderGeometry(2, 2, 1, 32, 32);
        let material = new THREE.MeshPhongMaterial({ color: color });
        material.map = texture;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotateZ(Math.PI / 2);
        this.mesh.rotateY(Math.PI)
        this.mesh.position.set(0, 1.5, 0);

        this.add(this.mesh);
    }

    setBoundingSphere() {
        this.bs = new THREE.Sphere(this.position, 2);
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
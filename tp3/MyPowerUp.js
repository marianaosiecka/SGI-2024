import * as THREE from 'three';

class MyPowerUp extends THREE.Object3D {
    
    constructor(app, radius, height, texture) {
        super();
        this.app = app;

        let geometry = new THREE.CylinderGeometry(radius, radius, height, 32, 32);
        let material = new THREE.MeshPhongMaterial({ map: texture });
        this.mesh = new THREE.Mesh(geometry, material);

        this.add(this.mesh);
    }

}

MyPowerUp.prototype.isGroup = true;
export { MyPowerUp };
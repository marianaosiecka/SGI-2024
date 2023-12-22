import * as THREE from 'three';

class MyObstacle extends THREE.Object3D {
    constructor(app, type, texture, color) {
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

    applyModifier() {
        if(this.type == "slip"){

        }
    }

    stopModifier() {
        if(this.type == "slip"){

        }
    }

}

MyObstacle.prototype.isGroup = true;
export { MyObstacle };
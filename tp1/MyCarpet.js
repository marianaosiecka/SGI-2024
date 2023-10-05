import * as THREE from 'three';

class MyCarpet extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, width, height, depth, color) {
        super();
        this.app = app;

        this.carpet = new THREE.BoxGeometry(width, height, depth);
        this.carpetMaterial = new THREE.MeshBasicMaterial({color: color});
        this.carpetMesh = new THREE.Mesh(this.carpet, this.carpetMaterial);
        this.add(this.carpetMesh);
    }

    changeColor(color) {
        this.carpetMesh.material.color = new THREE.Color(color);
    }

}

export { MyCarpet };
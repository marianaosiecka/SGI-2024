import * as THREE from 'three';

class MyPillow extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, width, height, depth, color, texture) {      
        super();
        this.app = app;
        
        this.pillowMaterial = new THREE.MeshPhongMaterial({ color: color , specular:"#777777", shininess:6, map: texture});
        
        this.pillow = new THREE.BoxGeometry(width, height, depth);         
        this.pillowMesh = new THREE.Mesh(this.pillow, this.pillowMaterial);
        this.pillowMesh.rotation.z = Math.PI/2;
        this.add(this.pillowMesh);
    }

}

export { MyPillow };
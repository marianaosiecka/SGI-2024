import * as THREE from 'three';

class MyDoor extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, height, width, depth, color) {
        super();
        this.app = app;
        this.type = 'Group';

        this.material = new THREE.MeshBasicMaterial({ color: color })

        // frame
        let frameUp = new THREE.BoxGeometry(width, 0.05 * height, depth);
        let frameUpMesh = new THREE.Mesh(frameUp, this.material);
        frameUpMesh.y = 


    }

}


MyDoor.prototype.isGroup = true;
export { MyDoor };
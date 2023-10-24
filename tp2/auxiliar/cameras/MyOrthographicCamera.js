import * as THREE from 'three';

class MyOrthographicCamera {

    constructor(id, near, far, left, right, bottom, top) {
        this.id = id;
        this.camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    }

    setCameraPosition(x, y, z) {
        this.camera.position = new THREE.Vector3(x, y, z);
    }

    setCameraTarget(x, y, z) {
        this.camera.target = new THREE.Vector3(x, y, z);
    }
}


export { MyOrthographicCamera };
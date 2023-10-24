import * as THREE from 'three';

class MyPerspectiveCamera {

    constructor(id, angle, near, far) {
        const aspect = window.innerWidth / window.innerHeight;
        this.id = id;
        this.camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
    }

    setCameraPosition(x, y, z) {
        this.camera.position = new THREE.Vector3(x, y, z);
    }

    setCameraTarget(x, y, z) {
        this.camera.target = new THREE.Vector3(x, y, z);
    }
}


export { MyPerspectiveCamera };
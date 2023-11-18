import * as THREE from 'three';

class MyPerspectiveCamera {

    constructor(cameraData, isActive) {
        this.isActive = isActive;
        const aspect = window.innerWidth / window.innerHeight;
        this.id = cameraData.id;
        this.camera = new THREE.PerspectiveCamera(cameraData.angle, aspect, cameraData.near, cameraData.far);
        this.camera.position.set(cameraData.location[0], cameraData.location[1], cameraData.location[2])
        this.target = new THREE.Vector3(cameraData.target[0], cameraData.target[1], cameraData.target[2]);
    }
}


export { MyPerspectiveCamera };
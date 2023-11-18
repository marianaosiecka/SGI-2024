import * as THREE from 'three';

class MyOrthographicCamera {

    constructor(cameraData, isActive) {
        this.isActive = isActive;
        this.id = cameraData.id;
        this.camera = new THREE.OrthographicCamera(cameraData.left, cameraData.right, cameraData.top, cameraData.bottom, cameraData.near, cameraData.far);
        this.camera.position.set(cameraData.location[0], cameraData.location[1], cameraData.location[2])
        this.target = new THREE.Vector3(cameraData.target[0], cameraData.target[1], cameraData.target[2]);
    }
}


export { MyOrthographicCamera };
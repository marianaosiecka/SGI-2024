import * as THREE from 'three';

/**
 * Constructor for class MyPerspectiveCamera class.
 *
 * @param {Object} cameraData - The camera configuration data.
 * @param {boolean} isActive - Indicates whether the camera is currently active.
*/
class MyPerspectiveCamera {

    constructor(cameraData, isActive) {
        this.isActive = isActive;
        const aspect = window.innerWidth / window.innerHeight;
        this.id = cameraData.id;
        this.camera = new THREE.PerspectiveCamera(cameraData.angle*180/Math.PI, aspect, cameraData.near, cameraData.far);
        this.camera.position.set(cameraData.location[0], cameraData.location[1], cameraData.location[2])
        this.target = new THREE.Vector3(cameraData.target[0], cameraData.target[1], cameraData.target[2]);
    }
}


export { MyPerspectiveCamera };
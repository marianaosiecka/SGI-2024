import * as THREE from 'three';

class MyPerspectiveCamera {

    constructor(cameraData, isActive) {
        this.isActive = isActive;
        const aspect = window.innerWidth / window.innerHeight;
        this.id = cameraData.id;
        this.camera = new THREE.PerspectiveCamera(cameraData.angle, aspect, cameraData.near, cameraData.far);
        this.camera.target = cameraData.target;
        //this.camera.position = transformação qualquer da location pq é diferente da position (acho que é tipo translação)
    }
}


export { MyPerspectiveCamera };
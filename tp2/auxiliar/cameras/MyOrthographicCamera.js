import * as THREE from 'three';

class MyOrthographicCamera {

    constructor(cameraData, isActive) {
        this.isActive = isActive;
        this.id = cameraData.id;
        this.camera = new THREE.OrthographicCamera(cameraData.left, cameraData.right, cameraData.top, cameraData.bottom, cameraData.near, cameraData.far);
        this.camera.target = cameraData.target;
        //this.camera.position = transformação qualquer da location pq é diferente da position (acho que é tipo translação)
    }
}


export { MyOrthographicCamera };
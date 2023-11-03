import * as THREE from 'three';

class MyBox {

    /**
     * 
     * 
     */
    constructor(boxData) {
        let boxWidth = Math.abs(rectangleData.xyz1[0] - rectangleData.xyz2[0]);
        let boxHeight = Math.abs(rectangleData.xyz1[1] - rectangleData.xyz2[1]);
        let boxDepth = Math.abs(rectangleData.xyz1[2] - rectangleData.xyz2[2]);

        this.rectangle = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth, boxData.parts_x, boxData.parts_y, boxData.parts_z);
    }
}


export { MyBox };
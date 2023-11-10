import * as THREE from 'three';

class MyBox {

    /**
     * 
     * 
     */
    constructor(boxData) {
        let boxWidth = Math.abs(boxData.xyz1[0] - boxData.xyz2[0]);
        let boxHeight = Math.abs(boxData.xyz1[1] - boxData.xyz2[1]);
        let boxDepth = Math.abs(boxData.xyz1[2] - boxData.xyz2[2]);

        this.box = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth, boxData.parts_x, boxData.parts_y, boxData.parts_z);
    }
}


export { MyBox };
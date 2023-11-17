import * as THREE from 'three';

class MyBox {

    /**
     * 
     * 
     */
    constructor(boxData) {
        this.boxWidth = Math.abs(boxData.xyz1[0] - boxData.xyz2[0]);
        this.boxHeight = Math.abs(boxData.xyz1[1] - boxData.xyz2[1]);
        this.boxDepth = Math.abs(boxData.xyz1[2] - boxData.xyz2[2]);

        this.box = new THREE.BoxGeometry(this.boxWidth, this.boxHeight, this.boxDepth, boxData.parts_x, boxData.parts_y, boxData.parts_z);
    }
}


export { MyBox };
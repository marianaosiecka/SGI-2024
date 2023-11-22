import * as THREE from 'three';

class MyRectangle {

    /**
     * Constructor for MyRectangle class.
     *
     * @param {Object} rectangleData - The rectangle properties data.
    */
    constructor(rectangleData) {
        this.rectWidth = Math.abs(rectangleData.xy1[0] - rectangleData.xy2[0]);
        this.rectHeight = Math.abs(rectangleData.xy1[1] - rectangleData.xy2[1]);

        this.rectangle = new THREE.PlaneGeometry(this.rectWidth, this.rectHeight, rectangleData.parts_x, rectangleData.parts_y);
    }
}


export { MyRectangle };
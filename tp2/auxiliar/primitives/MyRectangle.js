import * as THREE from 'three';

/*
 this.descriptors["rectangle"] = [
			{name: "xy1", type: "vector2"},
			{name: "xy2", type: "vector2"},
            {name: "parts_x", type: "integer", required: false, default: 1},
			{name: "parts_y", type: "integer", required: false, default: 1},
            {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
		]
*/
class MyRectangle {

    /**
     * 
     * 
     */
    constructor(rectangleData) {
        let rectWidth = Math.abs(rectangleData.xy1[0] - rectangleData.xy2[0]);
        let rectHeight = Math.abs(rectangleData.xy1[1] - rectangleData.xy2[1]);

        this.rectangle = new THREE.PlaneGeometry(rectWidth, rectHeight, rectangleData.parts_x, rectangleData.parts_y);

    }
}


export { MyRectangle };
import * as THREE from 'three';

/*
 this.descriptors["box"] = [
			{name: "xyz1", type: "vector3"},
			{name: "xyz2", type: "vector3"},
			{name: "parts_x", type: "integer", required: false, default: 1},
			{name: "parts_y", type: "integer", required: false, default: 1},
            {name: "parts_z", type: "integer", required: false, default: 1},
            {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
        ]
*/
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
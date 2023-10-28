import * as THREE from 'three';

/*
 this.descriptors["cylinder"] = [
			{name: "base", type: "float"},
			{name: "top", type: "float"},
			{name: "height", type: "float"},
			{name: "slices", type: "integer"},
			{name: "stacks", type: "integer"},
            {name: "capsclose", type: "boolean", required: false, default: false},
            {name: "thetastart", type: "float", required: false, default: 0.0},
            {name: "thetalength", type: "float", required: false, default: 2 * Math.PI},
            {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
		]
*/
class MyCylinder{

    /**
     * 
     * 
     */
    constructor(cylinderData) {
       this.cylinder = new THREE.CylinderGeometry(cylinderData.top, cylinderData.base, cylinderData.height, cylinderData.slices, 
                            cylinderData.stacks, !cylinderData.capsclose, cylinderData.thetastart, cylinderData.thetalength);
    }
}


export { MyCylinder };
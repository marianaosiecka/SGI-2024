import * as THREE from 'three';

/*
 this.descriptors["sphere"] = [
			{name: "radius", type: "float"},
			{name: "slices", type: "integer"},
			{name: "stacks", type: "integer"},
            {name: "thetastart", type: "float", required: false, default: 0.0},
            {name: "thetalength", type: "float", required: false, default: 2 * Math.PI},
            {name: "phistart", type: "float", required: false, default: 0.0},
            {name: "philength", type: "float", required: false, default: 2 * Math.PI},
            {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
		]
*/
class MySphere{

    /**
     * 
     * 
     */
    constructor(sphereData) {
       this.sphere = new THREE.SphereGeometry(sphereData.radius, sphereData.slices, sphereData.stacks, sphereData.phistart, 
                        sphereData.philength, sphereData.thetastart, sphereData.thetalength);
    }
}


export { MySphere };
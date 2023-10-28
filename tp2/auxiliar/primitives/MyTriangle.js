import * as THREE from 'three';

/*
 this.descriptors["triangle"] = [
			{name: "xyz1", type: "vector3"},
			{name: "xyz2", type: "vector3"},
			{name: "xyz3", type: "vector3"},
            {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
		]
*/
class MyTriangle {

    /**
     * 
     * 
     */
    constructor(triangleData) {
        this.triangle = new THREE.Triangle(triangleData.xyz1, triangleData.xyz2, triangleData.xyz3);
    }
}


export { MyTriangle };
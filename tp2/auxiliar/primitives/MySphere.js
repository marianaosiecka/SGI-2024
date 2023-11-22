import * as THREE from 'three';

class MySphere{

    /**
     * Constructor for MySphere class.
     *
     * @param {Object} sphereData - The sphere properties data.
    */
    constructor(sphereData) {
        this.radius = sphereData.radius
        this.sphere = new THREE.SphereGeometry(this.radius, sphereData.slices, sphereData.stacks, sphereData.phistart, 
                        sphereData.philength, sphereData.thetastart, sphereData.thetalength);
    }
}


export { MySphere };
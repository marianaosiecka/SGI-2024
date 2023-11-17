import * as THREE from 'three';

class MyCylinder{

    /**
     * 
     * 
     */
    constructor(cylinderData) {
        this.top = cylinderData.top
        this.base = cylinderData.base
        this.cylinder = new THREE.CylinderGeometry(this.top, this.base, cylinderData.height, cylinderData.slices, 
                            cylinderData.stacks, !cylinderData.capsclose, cylinderData.thetastart, cylinderData.thetalength);
    }
}


export { MyCylinder };
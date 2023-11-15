import * as THREE from 'three';

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
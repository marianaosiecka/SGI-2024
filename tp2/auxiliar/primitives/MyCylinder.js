import * as THREE from 'three';

class MyCylinder{

    /**
     * 
     * 
     */
    constructor(cylinderData) {
       this.cylinder = new THREE.CylinderGeometry(cylinderData.top, cylinderData.base, cylinderData.height, cylinderData.slices, 
                            cylinderData.stacks, !cylinderData.capsclose, cylinderData.thetastart * Math.PI / 180, cylinderData.thetalength * Math.PI  / 180);
    }
}


export { MyCylinder };
import * as THREE from 'three';
import { MyPlate } from './MyPlate.js';

class MyCakePlate extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, radius, height, radialSegments, colorTop, colorBase) {
        super();
        this.app = app;
        this.type = 'Group';

        this.plate = new MyPlate(this.app, radius, height, radialSegments, colorTop, colorTop);
        this.add(this.plate)

        this.baseMaterial = new THREE.MeshBasicMaterial({ color: colorBase });
    
        this.base1 = new THREE.CylinderGeometry(radius/4, radius/2, height + 0.05, radialSegments);
        this.baseMesh1 = new THREE.Mesh(this.base1, this.baseMaterial);
        this.baseMesh1.position.y = -0.4;
        this.add(this.baseMesh1)

        this.base2 = new THREE.CylinderGeometry(radius/8, radius/4, height+0.3, radialSegments);
        this.baseMesh2 = new THREE.Mesh(this.base2, this.baseMaterial)
        this.baseMesh2.position.y = -0.3;
        this.add(this.baseMesh2)
    
    }

    changeColorTop(color) {
        this.topMesh.material.color = new THREE.Color(color);
    }

    changeColorBase(color) {
        this.baseMesh.material.color = new THREE.Color(color);
    }
}


MyPlate.prototype.isGroup = true;
export { MyCakePlate };
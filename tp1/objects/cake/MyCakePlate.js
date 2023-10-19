import * as THREE from 'three';
import { MyPlate } from './MyPlate.js';

class MyCakePlate extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} radius The radius of the cake plate
       @param {number} height The height of the cake plate
       @param {number} radialSegments The number of radial segments for the plate geometry
       @param {String} colorTop The color of the top surface of the plate
       @param {String} colorBase The color of the base of the plate
     
    */
    constructor(app, radius, height, radialSegments, colorTop, colorBase) {
        super();
        this.app = app;
        this.type = 'Group';

        this.plate = new MyPlate(this.app, radius, height, radialSegments, colorTop, colorTop);
        this.add(this.plate)

        this.baseMaterial = new THREE.MeshPhongMaterial({ color: colorBase, specular:"#FFFFFF", shininess:3 });

        this.base1 = new THREE.CylinderGeometry(radius / 4, radius / 2, height + 0.05, radialSegments);
        this.baseMesh1 = new THREE.Mesh(this.base1, this.baseMaterial);
        this.baseMesh1.position.y = -0.4;
        this.baseMesh1.castShadow = true;
        this.baseMesh1.receiveShadow = true;
        this.add(this.baseMesh1)

        this.base2 = new THREE.CylinderGeometry(radius / 8, radius / 4, height + 0.3, radialSegments);
        this.baseMesh2 = new THREE.Mesh(this.base2, this.baseMaterial)
        this.baseMesh2.position.y = -0.3;
        this.baseMesh2.castShadow = true;
        this.baseMesh2.receiveShadow = true;
        this.add(this.baseMesh2)
    }
}


MyCakePlate.prototype.isGroup = true;
export { MyCakePlate };
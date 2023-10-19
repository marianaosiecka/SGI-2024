import * as THREE from 'three';

class MyPlate extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} radius The radius of the plate
       @param {number} height The height of the plate
       @param {number} radialSegments The number of radial segments for the plate's geometry
       @param {string} colorTop The color of the top part of the plate
       @param {string} colorBase The color of the base part of the plate
    */ 
    constructor(app, radius, height, radialSegments, colorTop, colorBase) {
        super();
        this.app = app;
        this.type = 'Group';

        // plate
        this.top = new THREE.CylinderGeometry(radius, radius, height, radialSegments);         
        this.topMaterial = new THREE.MeshPhongMaterial({ color: colorTop, specular:"#FFFFFF", shininess:3 });
        this.topMesh = new THREE.Mesh(this.top, this.topMaterial);
        this.topMesh.castShadow = true;
        this.topMesh.receiveShadow = true;
        this.add(this.topMesh);

        // base of the plate
        this.base = new THREE.CylinderGeometry(radius - 0.2, radius - 0.4, height + 0.06, radialSegments);         
        this.baseMaterial = new THREE.MeshPhongMaterial({ color: colorBase, specular:"#FFFFFF", shininess:3 });
        this.baseMesh = new THREE.Mesh(this.base, this.baseMaterial);
        this.baseMesh.position.y = -height - 0.03;
        this.add(this.baseMesh);
    }
}


MyPlate.prototype.isGroup = true;
export { MyPlate };
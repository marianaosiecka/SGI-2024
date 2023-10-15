import * as THREE from 'three';

class MyPlate extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, radius, height, radialSegments, colorTop, colorBase) {
        super();
        this.app = app;
        this.type = 'Group';

        this.top = new THREE.CylinderGeometry(radius, radius, height, radialSegments);         
        this.topMaterial = new THREE.MeshBasicMaterial({ color: colorTop });
        this.topMesh = new THREE.Mesh(this.top, this.topMaterial);
        this.topMesh.castShadow = true;
        this.topMesh.receiveShadow = true;
        this.add(this.topMesh);


        this.base = new THREE.CylinderGeometry(radius - 0.2, radius - 0.4, height + 0.06, radialSegments);         
        this.baseMaterial = new THREE.MeshBasicMaterial({ color: colorBase });
        this.baseMesh = new THREE.Mesh(this.base, this.baseMaterial);
        this.baseMesh.position.y = -height - 0.03;
        this.baseMesh.castShadow = true;
        this.baseMesh.receiveShadow = true;
        this.add(this.baseMesh);
    }

    changeColorTop(color) {
        this.topMesh.material.color = new THREE.Color(color);
    }

    changeColorBase(color) {
        this.baseMesh.material.color = new THREE.Color(color);
    }
}


MyPlate.prototype.isGroup = true;
export { MyPlate };
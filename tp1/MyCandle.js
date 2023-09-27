import * as THREE from 'three';

class MyCandle extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, radius, height, radialSegments, xPos, yPos, zPos, colorWax, colorFlame) {
        super();
        this.app = app;
        this.type = 'Group';

        this.wax = new THREE.CylinderGeometry(radius, radius, height, radialSegments);         
        this.waxMaterial = new THREE.MeshBasicMaterial({ color: colorWax });
        this.waxMesh = new THREE.Mesh(this.wax, this.waxMaterial);
        this.waxMesh.position.x = xPos;
        this.waxMesh.position.y = yPos;
        this.waxMesh.position.z = zPos;
        this.add(this.waxMesh);

        this.flame = new THREE.ConeGeometry(radius - 0.01, height - 0.1, radialSegments);         
        this.flameMaterial = new THREE.MeshBasicMaterial({ color: colorFlame });
        this.flameMesh = new THREE.Mesh(this.flame, this.flameMaterial);
        this.flameMesh.position.x = xPos;
        this.flameMesh.position.y = yPos + height - 0.05;
        this.flameMesh.position.z = zPos;
        this.add(this.flameMesh);
    }

    changeColorWax(color) {
        this.waxMesh.material.color = new THREE.Color(color);
    }

    changeColorFlame(color) {
        this.flameMesh.material.color = new THREE.Color(color);
    }
}


MyCandle.prototype.isGroup = true;
export { MyCandle };
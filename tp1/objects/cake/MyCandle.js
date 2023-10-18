import * as THREE from 'three';

class MyCandle extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, radius, height, radialSegments, colorWax, colorFlame) {
        super();
        this.app = app;
        this.type = 'Group';

        this.wax = new THREE.CylinderGeometry(radius, radius, height, radialSegments);         
        this.waxMaterial = new THREE.MeshBasicMaterial({ color: colorWax });
        this.waxMesh = new THREE.Mesh(this.wax, this.waxMaterial);
        this.add(this.waxMesh);

        this.flame = new THREE.ConeGeometry(radius - 0.01, height - 0.1, radialSegments);         
        this.flameMaterial = new THREE.MeshBasicMaterial({ color: colorFlame });
        this.flameMesh = new THREE.Mesh(this.flame, this.flameMaterial);
        this.flameMesh.position.y = height - 0.05;
        this.add(this.flameMesh);

        this.candleLight = new THREE.PointLight("#fac569", 0.1, 1, 0.5);
        this.candleLight.position.y = height ;
        this.add(this.candleLight);
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
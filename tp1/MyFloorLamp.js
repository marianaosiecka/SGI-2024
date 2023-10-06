import * as THREE from 'three';

class MyFloorLamp extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, radius, height, radialSegments, colorFoot, colorLamp) {
        super();
        this.app = app;
        this.type = 'Group';

        this.lampFoot = new THREE.ConeGeometry(radius, height, radialSegments);         
        this.lampFootMaterial = new THREE.MeshPhongMaterial({ color: colorFoot, specular:"#FFFFFF", shininess: 2});
        this.lampFootesh = new THREE.Mesh(this.lampFoot, this.lampFootMaterial);
        this.add(this.lampFootesh);

        this.lampArm1 = new THREE.CylinderGeometry(radius, radius, height, radialSegments);         
        this.lampArm1Mesh = new THREE.Mesh(this.lampArm1, this.lampFootMaterial);
        this.add(this.lampArm1Mesh);

        this.lampArm2 = new THREE.CylinderGeometry(radius, radius, height, radialSegments);         
        this.lampArm2Mesh = new THREE.Mesh(this.lampArm2, this.lampFootMaterial);
        this.add(this.lampArm2Mesh);

        /*this.candleLight = new THREE.PointLight("#fac569", 0.1, 2);
        this.candleLight.position.y = height ;
        this.add(this.candleLight);
        */
    }

    changeColorWax(color) {
        this.waxMesh.material.color = new THREE.Color(color);
    }

    changeColorFlame(color) {
        this.flameMesh.material.color = new THREE.Color(color);
    }
}


MyFloorLamp.prototype.isGroup = true;
export { MyFloorLamp };
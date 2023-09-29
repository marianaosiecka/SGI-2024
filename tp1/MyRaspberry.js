import * as THREE from 'three';

class MyRasberry extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, xPos, yPos, zPos, color) {
        super();
        this.app = app;
        this.type = 'Group';

        this.circle = new THREE.SphereGeometry();    

        this.cake = new THREE.MeshBasicMaterial({ color: color });
        
        this.cakeMesh = new THREE.Mesh(this.wax, this.waxMaterial);
        this.cakeMesh.position.x = xPos;
        this.cakeMesh.position.y = yPos;
        this.cakeMesh.position.z = zPos;
        this.add(this.cakeMesh);
    }

    changeColor(color) {
        this.cakeMesh.material.color = new THREE.Color(color);
    }

}


MyCake.prototype.isGroup = true;
export { MyCake };
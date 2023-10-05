import * as THREE from 'three';
import { MyPlate } from './MyPlate.js';
import { MyCandle } from './MyCandle.js';

class MyCake extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, radius, height, radialSegments, sliceAngle, colorCake, colorFilling) {
        super();
        this.app = app;
        this.type = 'Group';

        this.radius = radius;
        this.height = height;
        this.radialSegments = radialSegments;
        this.sliceAngle = sliceAngle;
        this.colorCake = colorCake;
        this.colorFilling = colorFilling;

        this.cakeMaterial = new THREE.MeshBasicMaterial({ color: colorCake });

        this.cake = new THREE.CylinderGeometry(radius, radius, height, radialSegments, 1, false, 0, 2*Math.PI - sliceAngle);    
        this.cakeMesh = new THREE.Mesh(this.cake, this.cakeMaterial);
        this.buildFilling(this.sliceAngle);

        this.add(this.cakeMesh)
    }

    buildFilling(angle, x = 0, y = 0, z = 0) {
        const width = this.radius;
        const height = this.height;

        this.filling = new THREE.PlaneGeometry(width, height);
        this.fillingMaterial = new THREE.MeshBasicMaterial({ color: this.colorFilling})
        
        this.fillingMesh1 = new THREE.Mesh( this.filling, this.fillingMaterial );
        this.fillingMesh1.rotateY(-Math.PI / 2)
        this.fillingMesh1.position.x = x;
        this.fillingMesh1.position.y = y;
        this.fillingMesh1.position.z = z + width / 2;
        
        this.fillingMesh2 = new THREE.Mesh( this.filling, this.fillingMaterial );
        const filling2Angle = Math.PI / 2 - angle;
        this.fillingMesh2.rotateY(filling2Angle);
        this.fillingMesh2.position.x = x - (width / 2) * Math.sin(angle);
        this.fillingMesh2.position.y = y;
        this.fillingMesh2.position.z = z + (width / 2) * Math.cos(angle);

        this.add(this.fillingMesh1);
        this.add(this.fillingMesh2);
    }

    buildSlice(x, y, z){
        this.slice = new THREE.CylinderGeometry(this.radius, this.radius, this.height, this.radialSegments, 1, false, 0, this.sliceAngle)
        this.sliceMesh = new THREE.Mesh(this.slice, this.cakeMaterial);

        const sliceX = 0 //this.cakeMesh.position.x + x;
        const sliceY = -2 //this.cakeMesh.position.y + y;
        const sliceZ = -6.3 //this.cakeMesh.position.z + z;

        this.sliceMesh.position.x = sliceX
        this.sliceMesh.position.y = sliceY
        this.sliceMesh.position.z = sliceZ
        this.sliceMesh.rotation.x = this.sliceAngle
        this.sliceMesh.rotation.y = Math.PI;
        this.sliceMesh.rotation.z = 3*Math.PI / 2 - this.sliceAngle / 2;


        //this.buildFilling(-this.sliceAngle, sliceX, sliceY, sliceZ);

        this.add(this.sliceMesh);
    }


    changeColor(color) {
        this.cakeMesh.material.color = new THREE.Color(color);
    }

}


MyCake.prototype.isGroup = true;
export { MyCake };
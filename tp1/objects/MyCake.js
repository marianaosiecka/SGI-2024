import * as THREE from 'three';
import { MyPlate } from './MyPlate.js';
import { MyCandle } from './MyCandle.js';

class MyCake extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, radius, height, radialSegments, sliceAngle, colorCake, colorFilling, filingTexture) {
        super();
        this.app = app;
        this.type = 'Group';

        this.radius = radius;
        this.height = height;
        this.radialSegments = radialSegments;
        this.sliceAngle = sliceAngle;
        this.colorCake = colorCake;
        this.colorFilling = colorFilling;

        this.cakeMaterial = new THREE.MeshPhongMaterial({ color: colorCake });
        this.fillingMaterial = new THREE.MeshBasicMaterial({ color: colorFilling, map: filingTexture})
        

        this.cake = new THREE.CylinderGeometry(radius, radius, height, radialSegments, 1, false, 0, 2*Math.PI - sliceAngle);    
        this.cakeMesh = new THREE.Mesh(this.cake, this.cakeMaterial);
        this.buildFilling(this.sliceAngle);
        
        this.add(this.cakeMesh)
    }

    buildFilling(angle, x = 0, y = 0, z = 0, rotX = 0, rotY = 0, rotZ = 0) {
        const width = this.radius;
        const height = this.height;

        this.filling = new THREE.PlaneGeometry(width, height);
        
        this.fillingMesh1 = new THREE.Mesh( this.filling, this.fillingMaterial );
        this.fillingMesh1.rotation.y = -Math.PI / 2;
        this.fillingMesh1.position.x = x;
        this.fillingMesh1.position.y = y;
        this.fillingMesh1.position.z = z + width / 2;
        
        this.fillingMesh2 = new THREE.Mesh( this.filling, this.fillingMaterial );
        const filling2Angle = Math.PI / 2 - angle;
        this.fillingMesh2.rotation.y = filling2Angle;
        this.fillingMesh2.position.x = x - (width / 2) * Math.sin(angle);
        this.fillingMesh2.position.y = y;
        this.fillingMesh2.position.z = z + (width / 2) * Math.cos(angle);

        this.add(this.fillingMesh1);
        this.add(this.fillingMesh2);
    }

    buildSlice(x, y, z){
        this.slice = new THREE.CylinderGeometry(this.radius, this.radius, this.height, this.radialSegments, 1, false, 0, this.sliceAngle)
        this.sliceMesh = new THREE.Mesh(this.slice, this.cakeMaterial);

        const sliceX = this.cakeMesh.position.x + x;
        const sliceY = this.cakeMesh.position.y + y;
        const sliceZ = this.cakeMesh.position.z + z;

        const rotationY = -this.sliceAngle/2;
        const rotationZ = -3*Math.PI / 2;

        this.sliceMesh.position.x = sliceX;
        this.sliceMesh.position.y = sliceY;
        this.sliceMesh.position.z = sliceZ;
        //this.sliceMesh.rotation.y = rotationY;
        //this.sliceMesh.rotation.z = rotationZ;


        this.buildFilling(-this.sliceAngle, sliceX, sliceY, sliceZ, 0, rotationY, rotationZ);

        this.sliceMesh.castShadow = true;
        this.sliceMesh.receiveShadow = true;
        this.add(this.sliceMesh);
    }


    changeColor(color) {
        this.cakeMesh.material.color = new THREE.Color(color);
    }

}


MyCake.prototype.isGroup = true;
export { MyCake };
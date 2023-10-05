import * as THREE from 'three';
import { MyPlate } from './MyPlate.js';
import { MyCandle } from './MyCandle.js';

class MyCake extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, radius, height, radialSegments, xCake, yCake, zCake, sliceAngle, color) {
        super();
        this.app = app;
        this.xCake = xCake;
        this.yCake = yCake;
        this.zCake = zCake;
        this.height = height;
        this.type = 'Group';

        this.cakeMaterial = new THREE.MeshBasicMaterial({ color: color });

        // cake
        this.cake = new THREE.CylinderGeometry(radius, radius, height, radialSegments, 1, false, 0, 2*Math.PI - sliceAngle);    
        this.cakeMesh = new THREE.Mesh(this.cake, this.cakeMaterial);
        this.cakeMesh.position.x = xCake;
        this.cakeMesh.position.y = yCake;
        this.cakeMesh.position.z = zCake;

        // slice
        this.slice = new THREE.CylinderGeometry(radius, radius, height, radialSegments, 1, false, -sliceAngle/2, sliceAngle/2)
        this.sliceMesh = new THREE.Mesh(this.slice, this.cakeMaterial);
        this.sliceMesh.rotateY(Math.PI);
        this.sliceMesh.rotateZ(3*Math.PI/ 2);
        this.xSlice = xCake+1.3;
        this.ySlice = yCake-0.5;
        this.zSlice = zCake+1.3;
        this.sliceMesh.position.x = this.xSlice;
        this.sliceMesh.position.y = this.ySlice;
        this.sliceMesh.position.z = this.zSlice;

        this.add(this.cakeMesh)
        this.add(this.sliceMesh);
        this.buildCakeFilling(radius, height, xCake, yCake, zCake, sliceAngle);
        this.buildSliceFilling(radius, height, this.xSlice, this.ySlice, this.zSlice, sliceAngle);
        //this.buildFilling(radius, height, this.xSlice, this.ySlice, this.zSlice, sliceAngle, true);
    }

    buildCandle(radius, height, radialSegments, colorWax, colorFlame){
        this.candle = new MyCandle(this.app, radius, height, radialSegments, this.xCake, this.yCake + 0.3, this.zCake,  colorWax, colorFlame);
        this.add(this.candle);
    }

    //buildSlice

    //buildSlicePlate

    buildCakePlate(radius, height, radialSegments, xPos, yPos, zPos, colorTop, colorBase){
        this.plate = new MyPlate(this.app, radius, height, radialSegments, xPos, yPos, zPos, colorTop, colorBase);
        this.add(this.plate)

        this.base1 = new THREE.CylinderGeometry(radius/4, radius/2, height + 0.05, radialSegments);
        this.baseMaterial = new THREE.MeshBasicMaterial({ color: colorBase });
        this.baseMesh1 = new THREE.Mesh(this.base1, this.baseMaterial);
        this.baseMesh1.position.x = xPos;
        this.baseMesh1.position.y = yPos-0.4;
        this.baseMesh1.position.z = zPos;
        this.add(this.baseMesh1)

        this.base2 = new THREE.CylinderGeometry(radius/8, radius/4, height+0.3, radialSegments);
        this.baseMesh2 = new THREE.Mesh(this.base2, this.baseMaterial)
        this.baseMesh2.position.x = xPos;
        this.baseMesh2.position.y = yPos-0.3;
        this.baseMesh2.position.z = zPos;
        this.add(this.baseMesh2)

    }

    buildCakeFilling(width, height, x, y, z, angle) {
        this.filling = new THREE.PlaneGeometry(width, height);
        this.fillingMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff"})
        
        this.fillingMesh1 = new THREE.Mesh( this.filling, this.fillingMaterial );
        this.fillingMesh1.rotateY(-Math.PI / 2)
        this.fillingMesh1.position.x = x;
        this.fillingMesh1.position.y = y;
        this.fillingMesh1.position.z = z + width / 2;
        
        this.fillingMesh2 = new THREE.Mesh( this.filling, this.fillingMaterial );
        const filling2Angle = Math.PI / 2 - angle;
        this.fillingMesh2.rotateY(filling2Angle)
        this.fillingMesh2.position.x = x - (width / 2) * Math.sin(angle);
        this.fillingMesh2.position.y = y;
        this.fillingMesh2.position.z = z + (width / 2) * Math.cos(angle);
        

        this.add(this.fillingMesh1);
        this.add(this.fillingMesh2);
    }

    buildSliceFilling(width, height, x, y, z, angle){
        this.filling = new THREE.PlaneGeometry(width, height);
        this.fillingMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff"})
        
        this.fillingMesh = new THREE.Mesh( this.filling, this.fillingMaterial );
        this.fillingMesh.rotateZ(Math.PI / 2)
        this.fillingMesh.rotateY(angle)
        this.fillingMesh.position.x = x;
        this.fillingMesh.position.y = y+height/3;
        this.fillingMesh.position.z = z-width/2;

        this.add(this.fillingMesh);
    }

    changeColor(color) {
        this.cakeMesh.material.color = new THREE.Color(color);
    }

    changeSlicePosition(x, y, z){
        this.sliceMesh.position.x = x;
        this.sliceMesh.position.y = y;
        this.sliceMesh.position.z = z;
    }

}


MyCake.prototype.isGroup = true;
export { MyCake };
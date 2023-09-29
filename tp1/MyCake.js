import * as THREE from 'three';

class MyCake extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, radius, height, radialSegments, xCake, yCake, zCake, xSlice, ySlice, zSlice, sliceAngle, color) {
        super();
        this.app = app;
        this.type = 'Group';

        this.cakeMaterial = new THREE.MeshBasicMaterial({ color: color });

        // cake
        this.cake = new THREE.CylinderGeometry(radius, radius, height, radialSegments, 1, false, 0, 2*Math.PI - sliceAngle);    
        this.cakeMesh = new THREE.Mesh(this.cake, this.cakeMaterial);
        this.cakeMesh.position.x = xCake;
        this.cakeMesh.position.y = yCake;
        this.cakeMesh.position.z = zCake;

        // slice
        this.slice = new THREE.CylinderGeometry(radius, radius, height, radialSegments, 1, false, 0, sliceAngle)
        this.sliceMesh = new THREE.Mesh(this.slice, this.cakeMaterial);
        //this.sliceMesh.rotateZ(3)
        //this.sliceMesh.rotateZ(3)
        this.sliceMesh.position.x = xSlice;
        this.sliceMesh.position.y = ySlice;
        this.sliceMesh.position.z = zSlice;

        //this.buildFiiling()
        this.add(this.cakeMesh)
        this.add(this.sliceMesh);
        this.buildFilling(radius, height, xCake, yCake, zCake, sliceAngle);
        this.buildFilling(radius, height, xSlice, ySlice, zSlice, sliceAngle, true);
    }

    buildFilling(width, height, x, y, z, angle, slice = false) {
        this.filling = new THREE.PlaneGeometry(width, height);
        this.fillingMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff"})
        
        this.fillingMesh1 = new THREE.Mesh( this.filling, this.fillingMaterial );
        this.fillingMesh1.rotateY(-Math.PI / 2)
        this.fillingMesh1.position.x = x;
        this.fillingMesh1.position.y = y;
        this.fillingMesh1.position.z = z + width / 2;
        
        this.fillingMesh2 = new THREE.Mesh( this.filling, this.fillingMaterial );
        angle = slice ? -angle : angle;
        const filling2Angle = Math.PI / 2 - angle;
        this.fillingMesh2.rotateY(filling2Angle)
        this.fillingMesh2.position.x = x - (width / 2) * Math.sin(angle);
        this.fillingMesh2.position.y = y;
        this.fillingMesh2.position.z = z + (width / 2) * Math.cos(angle);
        

        this.add(this.fillingMesh1);
        this.add(this.fillingMesh2);
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
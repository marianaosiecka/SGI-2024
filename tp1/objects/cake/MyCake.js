import * as THREE from 'three';

class MyCake extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} radius The radius of the cake
       @param {number} height The height of the cake
       @param {number} radialSegments The number of radial segments for the cake geometry
       @param {number} sliceAngle The angle of the slice of the cake
       @param {String} colorCake The color of the cake material
       @param {THREE.Texture} filingTexture The texture for the cake filling
    */
    constructor(app, radius, height, radialSegments, sliceAngle, colorCake, filingTexture) {
        super();
        this.app = app;
        this.type = 'Group';

        this.radius = radius;
        this.height = height;
        this.radialSegments = radialSegments;
        this.sliceAngle = sliceAngle;
        this.colorCake = colorCake;

        this.cakeMaterial = new THREE.MeshPhongMaterial({ color: colorCake });
        this.fillingMaterial = new THREE.MeshPhongMaterial({ map: filingTexture, reflectivity: 0, shininess: 0 });

        this.cake = new THREE.CylinderGeometry(radius, radius, height, radialSegments, 1, false, 0, 2 * Math.PI - sliceAngle);
        this.cakeMesh = new THREE.Mesh(this.cake, this.cakeMaterial);
        this.add(this.cakeMesh);

        this.buildFilling(this.sliceAngle);
    }

    // Build the cake filling using two plane geometries
    buildFilling(angle, x = 0, y = 0, z = 0) {
        const width = this.radius;
        const height = this.height;

        this.filling = new THREE.PlaneGeometry(width, height);

        this.fillingMesh1 = new THREE.Mesh(this.filling, this.fillingMaterial);
        this.fillingMesh1.rotation.y = -Math.PI / 2;
        this.fillingMesh1.position.x = x;
        this.fillingMesh1.position.y = y;
        this.fillingMesh1.position.z = z + width / 2;
        this.add(this.fillingMesh1);

        this.fillingMesh2 = new THREE.Mesh(this.filling, this.fillingMaterial);
        const filling2Angle = Math.PI / 2 - angle;
        this.fillingMesh2.rotation.y = filling2Angle;
        this.fillingMesh2.position.x = x - (width / 2) * Math.sin(angle);
        this.fillingMesh2.position.y = y;
        this.fillingMesh2.position.z = z + (width / 2) * Math.cos(angle);
        this.add(this.fillingMesh2);
    }

    // Build the slice of the cake
    buildSlice(x, y, z) {
        this.slice = new THREE.CylinderGeometry(this.radius, this.radius, this.height, this.radialSegments, 1, false, 0, this.sliceAngle);
        this.sliceMesh = new THREE.Mesh(this.slice, this.cakeMaterial);

        const sliceX = this.cakeMesh.position.x + x;
        const sliceY = this.cakeMesh.position.y + y;
        const sliceZ = this.cakeMesh.position.z + z;

        const rotationY = -this.sliceAngle/2;
        const rotationZ = -3*Math.PI / 2;

        this.sliceMesh.position.x = sliceX;
        this.sliceMesh.position.y = sliceY;
        this.sliceMesh.position.z = sliceZ;
        
        this.sliceMesh.castShadow = true;
        this.sliceMesh.receiveShadow = true;

        this.add(this.sliceMesh);

        this.buildFilling(-this.sliceAngle, sliceX, sliceY, sliceZ, 0, rotationY, rotationZ);
    }
}


MyCake.prototype.isGroup = true;
export { MyCake };
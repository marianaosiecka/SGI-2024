import * as THREE from 'three';

class MyCandle extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} radius The radius of the candle
       @param {number} height The height of the candle
       @param {number} radialSegments The number of radial segments for the candle geometry
       @param {string} colorWax The color of the candle wax
       @param {string} colorFlame The color of the candle flame

       */ 
    constructor(app, radius, height, radialSegments, colorWax, colorFlame) {
        super();
        this.app = app;
        this.type = 'Group';

        // cylinder wax shape
        this.wax = new THREE.CylinderGeometry(radius, radius, height, radialSegments);         
        this.waxMaterial = new THREE.MeshBasicMaterial({ color: colorWax });
        this.waxMesh = new THREE.Mesh(this.wax, this.waxMaterial);
        this.add(this.waxMesh);

        // flame shape
        this.flame = new THREE.ConeGeometry(radius - 0.01, height - 0.1, radialSegments);         
        this.flameMaterial = new THREE.MeshBasicMaterial({ color: colorFlame });
        this.flameMesh = new THREE.Mesh(this.flame, this.flameMaterial);
        this.flameMesh.position.y = height - 0.05;
        this.add(this.flameMesh);

        // flame light
        this.candleLight = new THREE.PointLight("#fac569", 0.1, 1, 0.5);
        this.candleLight.position.y = height ;
        this.add(this.candleLight);
    }
}


MyCandle.prototype.isGroup = true;
export { MyCandle };
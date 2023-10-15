import * as THREE from 'three';

class MyBalloon extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, radius, height, colorBalloon, colorStem, switchString) {
        super();
        this.app = app;
        this.type = 'Group';

        let topHemisphere = new THREE.SphereGeometry(radius, 30, 30, 0, Math.PI);  
        let ballonMaterial = new THREE.MeshPhysicalMaterial({ transmission: 0.8,
            side: THREE.DoubleSide,
            reflectivity: 0.05,
            thickness: 0.08,
            color: colorBalloon,
            roughness: 0.3});
        let topHemisphereMesh = new THREE.Mesh(topHemisphere, ballonMaterial);
        topHemisphereMesh.rotation.set(-Math.PI/2, 0, 0);
        topHemisphereMesh.scale.z = 1.1;
        topHemisphereMesh.receiveShadow = true;
        topHemisphereMesh.castShadow = true;
        
        let bottomHemisphereMesh = new THREE.Mesh(topHemisphere, ballonMaterial);
        bottomHemisphereMesh.scale.z = 1.5;
        bottomHemisphereMesh.rotation.set(Math.PI/2, 0, 0);
        bottomHemisphereMesh.receiveShadow = true;
        bottomHemisphereMesh.castShadow = true;

        this.stringMaterial = new THREE.MeshBasicMaterial({ color: colorStem, side: THREE.DoubleSide });
        let curve;
        const segments = 20;
        const stringRadius = 0.02;
        
        curve = new THREE.CubicBezierCurve3(
            new THREE.Vector4(0, 0, 0, 1),
            new THREE.Vector4(0, height / 4, switchString*-0.3, 1),
            new THREE.Vector4(0, height / 2, switchString*0.1, 1),
            new THREE.Vector4(0, height, 0, 1)
        );

        const stem = new THREE.TubeGeometry(curve, segments, stringRadius, segments, false);
        let stingMesh = new THREE.Mesh(stem, this.stringMaterial);
        stingMesh.position.y = - height - radius*1.5;
        stingMesh.castShadow = true;
        stingMesh.receiveShadow = true;

        this.add(stingMesh);
        this.add(topHemisphereMesh);
        this.add(bottomHemisphereMesh);
    }
}


MyBalloon.prototype.isGroup = true;
export { MyBalloon };
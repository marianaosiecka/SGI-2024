import * as THREE from 'three';

class MyBalloon extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, radius, height, colorBalloon, colorStem) {
        super();
        this.app = app;
        this.type = 'Group';

        let topHemisphere = new THREE.SphereGeometry(radius, 30, 30, 0, Math.PI);   
        let ballonMaterial = new THREE.MeshPhongMaterial({ color: colorBalloon, specular:colorBalloon});
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

        // STEM
        this.stemMaterial = new THREE.MeshBasicMaterial({ color: colorStem, side: THREE.DoubleSide });
        let curve;
        const segments = 20;
        const stemRadius = 0.02;

        curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, height / 4, -0.3),
            new THREE.Vector3(0, height / 2, 0.1),
            new THREE.Vector3(0, height, 0)
        );

        const stem = new THREE.TubeGeometry(curve, segments, stemRadius, segments, false);
        let stemMesh = new THREE.Mesh(stem, this.stemMaterial);
        stemMesh.position.y = -radius*1.1 - radius*1.5 - height/2;
        stemMesh.castShadow = true;
        stemMesh.receiveShadow = true;

        this.add(stemMesh);
        this.add(topHemisphereMesh);
        this.add(bottomHemisphereMesh);
    }
}


MyBalloon.prototype.isGroup = true;
export { MyBalloon };
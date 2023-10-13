import * as THREE from 'three';
import { MyFlowerHead } from './MyFlowerHead.js';

class MyFlower extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app, height, distance, colorPetals, colorCenter, colorStem, state) {
        super();
        this.type = 'Group';
        this.app = app;

        // STEM
        this.stemMaterial = new THREE.MeshBasicMaterial({ color: colorStem, side: THREE.DoubleSide });
        let curve;
        const segments = 20;
        const radius = 0.02;

        // wilted
        if (state == "w") {
            curve = new THREE.CubicBezierCurve3(
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, height / 2, 0),
                new THREE.Vector3(0, height, distance / 2),
                new THREE.Vector3(0, 2 * height / 3, distance)
            );

        } 
        
        // facing up
        else if (state == "u"){
            distance = distance/3;
            height = 3/4 * height;
            curve = new THREE.CubicBezierCurve3(
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 1/2 * height, -0.2),
                new THREE.Vector3(0, height / 2, 0),
                new THREE.Vector3(0, height, distance)
            );        
        }
        
        // normal
        else {
            curve = new THREE.CubicBezierCurve3(
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, height / 2, 0),
                new THREE.Vector3(0, height, distance / 2),
                new THREE.Vector3(0, 2 * height / 3, distance)
            );
        }

        const stem = new THREE.TubeGeometry(curve, segments, radius, segments, false);
        let stemMesh = new THREE.Mesh(stem, this.stemMaterial);

        this.add(stemMesh);
        const flowerHead = new MyFlowerHead(this.app, 0.1, 5, colorPetals, colorCenter);
        this.add(flowerHead);
        flowerHead.position.set(0, height, 0)
    }
}

MyFlower.prototype.isGroup = true;
export { MyFlower };

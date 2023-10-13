import * as THREE from 'three';

class MyFlower extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app, height, distance, colorPetals, colorCenter, colorStem) {
        super();
        this.type = 'Group';
        this.app = app;

        // STEM
        this.stemMaterial = new THREE.MeshBasicMaterial({ color: colorStem, side: THREE.DoubleSide });

        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, height / 2, 0),
            new THREE.Vector3(0, height, distance / 2),
            new THREE.Vector3(0, 2 * height / 3, distance)
        );

        const stem = new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
        let stemMesh = new THREE.Mesh(stem, this.stemMaterial);


        // CENTER
        const center = new THREE.SphereGeometry(0.08, 20, 20);
        const centerMaterial = new THREE.MeshBasicMaterial({ color: colorCenter });
        let centerMesh = new THREE.Mesh(center, centerMaterial);
        centerMesh.scale.y = 0.5
        centerMesh.position.y = 2 * height / 3
        centerMesh.position.z = distance;


        // PETALS
        const petalMaterial = new THREE.MeshBasicMaterial({ color: colorPetals, side: THREE.DoubleSide });
        const petal = new THREE.SphereGeometry(0.1, 20, 20, 0, Math.PI);
        for (let i = 0; i < 1; i++) {
            let petalMesh = new THREE.Mesh(petal, petalMaterial);
            petalMesh.scale.y = 0.4
            petalMesh.scale.z = 1.5
            /*const angle = (i * Math.PI * 2) / 5;            
            petalMesh.position.x = 0.2 * Math.cos(angle);
            petalMesh.position.y = 2/3 * height;
            petalMesh.position.z = 0.2 * Math.sin(angle);
            petalMesh.rotation.y = angle;
            */
            petalMesh.position.y = height
            petalMesh.position.x = distance
            //this.add(petalMesh);
        }

        this.add(stemMesh);
        this.add(centerMesh)
    }
}

MyFlower.prototype.isGroup = true;
export { MyFlower };

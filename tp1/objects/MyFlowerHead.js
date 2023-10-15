import * as THREE from 'three';

class MyFlowerHead extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app, centerRadius, numPetals, colorPetals, colorCenter, neckMaterial) {
        super();
        this.type = 'Group';
        this.app = app;

        // NECK
        const neck =  new THREE.ConeGeometry(centerRadius, 0.2, 10);
        let neckMesh = new THREE.Mesh(neck, neckMaterial);
        neckMesh.position.x = - centerRadius * 0.8
        neckMesh.rotation.z = Math.PI/2;
        this.add(neckMesh)

        // CENTER
        const center = new THREE.SphereGeometry(centerRadius, 10, 10);
        const centerMaterial = new THREE.MeshBasicMaterial({ color: colorCenter });
        let centerMesh = new THREE.Mesh(center, centerMaterial);
        centerMesh.scale.x = 0.7


        // PETALS
        const petalMaterial = new THREE.MeshBasicMaterial({ color: colorPetals, side: THREE.DoubleSide });
        const petal = new THREE.SphereGeometry(1.15*centerRadius, 10, 10);
        for (let i = 0; i < numPetals; i++) {
            let angle = i * 2/numPetals * Math.PI
            let petalMesh = new THREE.Mesh(petal, petalMaterial);
            petalMesh.scale.y = 0.8;
            petalMesh.scale.x = 0.3;
            petalMesh.scale.z = 2.5;
            petalMesh.rotation.x = angle 
            petalMesh.castShadow = true;
            petalMesh.receiveShadow = true;
            this.add(petalMesh);
        }

        this.add(centerMesh)
    }
}

MyFlowerHead.prototype.isGroup = true;
export { MyFlowerHead };

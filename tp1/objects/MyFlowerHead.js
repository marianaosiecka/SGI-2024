import * as THREE from 'three';

class MyFlowerHead extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app, centerRadius, numPetals, colorPetals, colorCenter) {
        super();
        this.type = 'Group';
        this.app = app;

        // CENTER
        const center = new THREE.SphereGeometry(centerRadius, 20, 20);
        const centerMaterial = new THREE.MeshBasicMaterial({ color: colorCenter });
        let centerMesh = new THREE.Mesh(center, centerMaterial);
        centerMesh.scale.x = 0.7


        // PETALS
        const petalMaterial = new THREE.MeshBasicMaterial({ color: colorPetals, side: THREE.DoubleSide });
        const petal = new THREE.SphereGeometry(1.15*centerRadius, 20, 20);
        for (let i = 0; i < numPetals; i++) {
            let angle = i * 2/numPetals * Math.PI
            let petalMesh = new THREE.Mesh(petal, petalMaterial);
            petalMesh.scale.y = 0.8;
            petalMesh.scale.x = 0.3;
            petalMesh.scale.z = 2.5;
            petalMesh.rotation.x = angle 
            /*const angle = (i * Math.PI * 2) / 5;            
            petalMesh.position.x = 0.2 * Math.cos(angle);
            petalMesh.position.y = 2/3 * height;
            petalMesh.position.z = 0.2 * Math.sin(angle);
            petalMesh.rotation.y = angle;
            */
            this.add(petalMesh);
        }

        this.add(centerMesh)
    }
}

MyFlowerHead.prototype.isGroup = true;
export { MyFlowerHead };

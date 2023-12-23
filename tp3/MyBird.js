import * as THREE from 'three';

const FLIGHT_SPEED = 10;

class MyBird {
    constructor(app, height, width) {
        this.app = app;
        let geometry = new THREE.BufferGeometry();

        this.halfWidth = width / 2;
        this.halfHeight = height / 2;

        let vertices = new Float32Array([
            0, 0, this.halfHeight,
            this.halfWidth, 0, 0,
            0, 0, -this.halfHeight,
            0, 0, -this.halfHeight,
            -this.halfWidth, 0, 0,
            0, 0, this.halfHeight,
        ]);

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        // faces
        let indices = new Uint16Array([
            0, 1, 2,
            3, 4, 5,
        ]);

        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.computeBoundingSphere();

        this.bird = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
            }),
        );
        this.app.scene.add(this.bird)
    }

    update(){
        const angle = this.app.contents.clock.elapsedTime * this.halfHeight * 10;
        const centerVel = this.halfHeight * 30;
        const sideVel = this.halfHeight * 6;
        this.bird.geometry.attributes.position.array[1] = -Math.sin(angle) / centerVel;
        this.bird.geometry.attributes.position.array[4] = Math.sin(angle) / sideVel;
        this.bird.geometry.attributes.position.array[7] = -Math.sin(angle) / centerVel;

        this.bird.geometry.attributes.position.array[10] = -Math.sin(angle) / centerVel;
        this.bird.geometry.attributes.position.array[13] = Math.sin(angle) / sideVel;
        this.bird.geometry.attributes.position.array[16] = -Math.sin(angle) / centerVel;

        this.bird.geometry.attributes.position.needsUpdate = true;
        //this.bird.position.z += FLIGHT_SPEED * this.app.contents.clock.getDelta();
    }
}

export { MyBird }
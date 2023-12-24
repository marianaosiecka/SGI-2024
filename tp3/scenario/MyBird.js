import * as THREE from 'three';
import { MyRoute } from '../elements/MyRoute.js';

const FLIGHT_SPEED = 10;

class MyBird {
    constructor(app, height, width, routeOffset) {
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
                side: THREE.DoubleSide
            }),
        );

        this.bird.rotateY(Math.PI / 2);
        this.app.scene.add(this.bird)

        let birdFlight = new MyRoute(this.app, this.generateCircularKeyPoints(100, 280, 10), 2, this.bird, routeOffset, Math.PI/2, false);
        this.mixer = birdFlight.mixer;
    }

    update(elapsedTime){
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
        this.mixer.update(elapsedTime);
    }

    generateCircularKeyPoints(numPoints, radius, maxHeight = 0) {
        const keyPoints = [];

        for (let i = 0; i < numPoints; i++) {
            const theta = (i / numPoints) * 2 * Math.PI;
            const x = radius * Math.cos(theta);
            const y = maxHeight * Math.sin((i / numPoints) * Math.PI); // Use sine function for up and down motion
            const z = radius * Math.sin(theta);

            keyPoints.push(new THREE.Vector3(x, y, z));
        }
        return keyPoints;
    }
}

export { MyBird }
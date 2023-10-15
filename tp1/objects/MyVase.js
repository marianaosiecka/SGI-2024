import * as THREE from 'three';
import { MyNurbsBuilder } from '../MyNurbsBuilder.js';
import { MyFlower } from './MyFlower.js';

class MyVase extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app, height, upRadius, color) {
        super();
        this.type = 'Group';
        this.app = app;
        this.height = height;
        this.upRadius = upRadius;

        this.material = new THREE.MeshPhysicalMaterial({
            transparent: true,
            opacity: 0.7,
            metalness: 0.6,
            side: THREE.DoubleSide,
            reflectivity: 0.8,
            color: color
        });

        this.builder = new MyNurbsBuilder(this.app);

        this.samplesU = 12;
        this.samplesV = 12;
        this.orderU = 2;
        this.orderV = 4;

        let controlPoints = [
            // U = 0
            [
                [0, height, -upRadius, 1],
                [0, 3 / 4 * height, -1 / 2 * upRadius, 1],
                [0, 1 / 2 * height, -1 / 3 * upRadius, 1],
                [0, 1 / 4 * height, -1 / 2 * upRadius, 1],
                [0, 0, -3 / 2 * upRadius, 1]
            ],
            // U = 1
            [
                [1.5 * upRadius, height, 0, 1],
                [1.8 * (1 / 2 * upRadius), 3 / 4 * height, 0, 1],
                [1.8 * (1 / 3 * upRadius), 1 / 2 * height, 0, 1],
                [1.8 * (1 / 2 * upRadius), 1 / 4 * height, 0, 1],
                [1.8 * (3 / 2 * upRadius), 0, 0, 1]
            ],
            // U = 2
            [
                [0, height, upRadius, 1],
                [0, 3 / 4 * height, 1 / 2 * upRadius, 1],
                [0, 1 / 2 * height, 1 / 3 * upRadius, 1],
                [0, 1 / 4 * height, 1 / 2 * upRadius, 1],
                [0, 0, 3 / 2 * upRadius, 1]
            ],
        ];

        let vaseData = this.builder.build(controlPoints, this.orderU, this.orderV, this.samplesU, this.samplesV)
        let vaseMesh1 = new THREE.Mesh(vaseData, this.material);
        let vaseMesh2 = new THREE.Mesh(vaseData, this.material);
        vaseMesh1.castShadow = true;
        vaseMesh1.receiveShadow = true;
        vaseMesh2.castShadow = true;
        vaseMesh2.receiveShadow = true;
        vaseMesh2.rotation.y = Math.PI;
        this.add(vaseMesh1);
        this.add(vaseMesh2)
    }

    createRandomFlowers(numFlowers, heightRange, distanceRange, petalColors, states, colorCenter, colorStem) {
        const flowers = []
        for (let i = 0; i < numFlowers; i++) {
            const randomHeight = Math.random() * (heightRange[1] - heightRange[0]) + heightRange[0];
            const randomDistance = Math.random() * (distanceRange[1] - distanceRange[0]) + distanceRange[0];
            const randomColorIndex = Math.floor(Math.random() * petalColors.length);
            const randomStateIndex = Math.floor(Math.random() * states.length);

            const colorPetals = petalColors[randomColorIndex];
            const state = petalColors[randomStateIndex];

            const flower = new MyFlower(this.app, randomHeight, randomDistance, colorPetals, colorCenter, colorStem, state);
            flower.rotation.y = Math.random() * 2 * Math.PI
            this.app.scene.add(flower)
            flowers.push(flower);
        }
        return flowers;
    }

    createFlowers(colorStem, colorCenter, petalsColors) {
        let flower1 = new MyFlower(this.app, 1.76 * this.height, 1.5 * this.upRadius, petalsColors[0], colorCenter, colorStem, "w");

        let flower2 = new MyFlower(this.app, 1.94 * this.height, 0.75 * this.upRadius, petalsColors[1], colorCenter, colorStem, "u");

        let flower3 = new MyFlower(this.app, 1.17 * this.height, 1.25 * this.upRadius, petalsColors[2], colorCenter, colorStem);
        flower3.rotation.y = Math.PI / 2;

        let flower4 = new MyFlower(this.app, 1.3 * this.height, 1.25 * this.upRadius, petalsColors[0], colorCenter, colorStem);
        flower4.rotation.y = Math.PI;

        this.add(flower1);
        this.add(flower2);
        this.add(flower3);
        this.add(flower4);
    }
}

MyVase.prototype.isGroup = true;
export { MyVase };

import * as THREE from 'three';
import { MyNurbsBuilder } from '../../MyNurbsBuilder.js';
import { MyFlower } from './flower/MyFlower.js';

class MyVase extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} height The height of the vase
       @param {number} radius The radius of the vase
       @param {string} color The color of the vase material
    */
    constructor(app, height, radius, color) {
        super();
        this.type = 'Group';
        this.app = app;
        this.height = height;
        this.radius = radius;

        this.material = new THREE.MeshPhysicalMaterial({
            transmission: 1,
            reflectivity: 0.5,
            thickness: 0.08,
            color: color,
            roughness: 0.05
        });

        this.builder = new MyNurbsBuilder(this.app);

        this.samplesU = 24;
        this.samplesV = 24;
        this.orderU = 6;
        this.orderV = 3;

        let controlPoints = [
            // U = 0
            [
                [0, 0, -radius, 1],
                [7/6 * radius, 0, -radius, 1],
                [7/6 * radius, 0, radius, 1],
                [0, 0, radius, 1]
            ],
            // U = 1
            [
                [0, 0.125 * height, - 1.7 * radius, 1],
                [7/6 * 1.7 * radius, 0.125 * height, - 1.7 * radius, 1],
                [7/6 * 1.7 * radius, 0.125 * height, 1.7 * radius, 1],
                [0, 0.125 * height, 1.7 * radius, 1]
            ],
            // U = 2
            [
                [0, 0.285 * height, -2.5 * radius, 1],
                [7/6 * 2.5 * radius, 0.285 * height, -2.5 * radius, 1],
                [7/6 * 2.5 * radius, 0.285 * height, 2.5 * radius, 1],
                [0, 0.285 * height, 2.5 * radius, 1]
            ],
            // U = 3
            [
                [0, 0.46 * height, -3 * radius, 1],
                [7/6 * 3 * radius, 0.46 * height, -3 * radius, 1],
                [7/6 * 3 * radius, 0.46 * height, 3 * radius, 1],
                [0, 0.46 * height, 3 * radius, 1]
            ],
            // U = 4
            [
                [0, 0.81 * height, -1.4 * radius, 1],
                [7/6 * 1.4 * radius, 0.81 * height, -1.4 * radius, 1],
                [7/6 * 1.4 * radius, 0.81 * height, 1.4 * radius, 1],
                [0, 0.81 * height, 1.4 * radius, 1]
            ],
            // U = 5
            [
                [0, 0.885 * height, -0.95 * radius, 1],
                [7/6 * 0.95 * radius, 0.885 * height, -0.95 * radius, 1],
                [7/6 * 0.95 * radius, 0.885 * height, 0.95 * radius, 1],
                [0, 0.885 * height, 0.95 * radius, 1]
            ],
            // U = 6
            [
                [0, height, -0.95 * radius, 1],
                [7/6 * 0.95 * radius, height, -0.95 * radius, 1],
                [7/6 * 0.95 * radius, height, 0.95 * radius, 1],
                [0, height, 0.95 * radius, 1]
            ]
        ];

        let vaseData = this.builder.build(controlPoints, this.orderU, this.orderV, this.samplesU, this.samplesV)
        let vaseMesh1 = new THREE.Mesh(vaseData, this.material);
        let vaseMesh2 = new THREE.Mesh(vaseData, this.material);
        vaseMesh2.rotation.y = Math.PI;
        this.add(vaseMesh1);
        this.add(vaseMesh2)
    }

    // Create random flowers with specified parameters
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

    // Create specific flowers with specified parameters
    createFlowers(colorStem, colorCenter, petalsColors) {
        let flower1 = new MyFlower(this.app, 1.76 * this.height, 1.5 * this.radius, petalsColors[0], colorCenter, colorStem, "w");

        let flower2 = new MyFlower(this.app, 1.94 * this.height, 0.75 * this.radius, petalsColors[1], colorCenter, colorStem, "u");

        let flower3 = new MyFlower(this.app, 1.17 * this.height, 1.25 * this.radius, petalsColors[2], colorCenter, colorStem);
        flower3.rotation.y = Math.PI / 2;

        let flower4 = new MyFlower(this.app, 1.3 * this.height, 1.25 * this.radius, petalsColors[0], colorCenter, colorStem);
        flower4.rotation.y = Math.PI;

        this.add(flower1);
        this.add(flower2);
        this.add(flower3);
        this.add(flower4);
    }
}

MyVase.prototype.isGroup = true;
export { MyVase };

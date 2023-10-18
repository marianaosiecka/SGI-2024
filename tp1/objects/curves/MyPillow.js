import * as THREE from 'three';
import { MyNurbsBuilder } from '../../MyNurbsBuilder.js';

class MyPillow extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {Texture} texture The texture to be applied to the pillow
    */
    constructor(app, texture) {
        super();
        this.app = app;
        
        this.pillowMaterial = new THREE.MeshPhongMaterial({ specular: "#777777", shininess: 6, map: texture, side: THREE.DoubleSide });

        this.builder = new MyNurbsBuilder(this.app);
        this.samplesU = 16;
        this.samplesV = 16;
        this.orderU = 2
        this.orderV = 2

        // build nurb #1
        let controlPoints1 =
            [   // U = 0
                [ // V = 0..2;
                    [-1.0, -1.0, 0, 1],
                    [-0.6, 0, 0.5, 1],
                    [-1.0, 1.0, 0, 1]
                ],
                // U = 1
                [ // V = 0..2
                    [0, -0.6, 0.5, 1],
                    [0, 0, 1, 1],
                    [0, 0.6, 0.5, 1]
                ],
                // U = 2
                [ // V = 0..2
                    [1.0, -1.0, 0, 1],
                    [0.6, 0, 0.5, 1],
                    [1.0, 1.0, 0, 1]
                ]
            ]

        // build nurb #2
        let controlPoints2 =
            [   // U = 0
                [ // V = 0..2;
                    [-1.0, 1.0, 0, 1],
                    [-1.0, 1.0, 0, 1],
                    [-1.0, 1.0, 0, 1]
                ],
                // U = 1
                [ // V = 0..2
                    [0, 0.6, 0.5, 1],
                    [0, 1, 0, 1],
                    [0, 0.6, -0.5, 1]
                ],
                // U = 2
                [ // V = 0..2
                    [1.0, 1.0, 0, 1],
                    [1.0, 1.0, 0, 1],
                    [1.0, 1.0, 0, 1]
                ]
            ]

        let surfaceData1 = this.builder.build(controlPoints1, this.orderU, this.orderV, this.samplesU, this.samplesV)
        let surfaceData2 = this.builder.build(controlPoints2, this.orderU, this.orderV, this.samplesU, this.samplesV)

        let front = new THREE.Mesh(surfaceData1, this.pillowMaterial);
        front.position.set(0, 0, 0)
        this.add(front)

        let back = new THREE.Mesh(surfaceData1, this.pillowMaterial);
        back.scale.z = -1
        back.position.set(0, 0, 0)
        this.add(back)

        let top = new THREE.Mesh(surfaceData2, this.pillowMaterial);
        top.position.set(0, 0, 0)
        this.add(top)

        let bottom = new THREE.Mesh(surfaceData2, this.pillowMaterial);
        bottom.scale.y = -1
        bottom.position.set(0, 0, 0)
        this.add(bottom)

        let rightSide = new THREE.Mesh(surfaceData2, this.pillowMaterial);
        rightSide.scale.y = -1
        rightSide.rotation.set(0, 0, Math.PI / 2);
        rightSide.position.set(0, 0, 0)
        this.add(rightSide)

        let leftSide = new THREE.Mesh(surfaceData2, this.pillowMaterial);
        leftSide.scale.y = -1
        leftSide.rotation.set(0, 0, -Math.PI / 2);
        leftSide.position.set(0, 0, 0)
        this.add(leftSide)
    }

}

export { MyPillow };
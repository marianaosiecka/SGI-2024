import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';


/**
 *  This class contains the contents of out application
 */
class MyContents {

    /**
       constructs the object
       @param {MyApp} app The application object
    */

    constructor(app) {
        this.app = app
        this.axis = null

        const map = new THREE.TextureLoader().load('textures/uv_grid_opengl.jpg');

        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;

        this.material = new THREE.MeshLambertMaterial({ map: map, side: THREE.DoubleSide, transparent: true, opacity: 0.90 });

        this.builder = new MyNurbsBuilder()

        this.meshes = []
        this.samplesU = 16         // maximum defined in MyGuiInterface
        this.samplesV = 16        // maximum defined in MyGuiInterface

        this.init()

        this.createNurbsSurfaces()
    }


    /**
     * initializes the contents
     */
    init() {

        // create once
        if (this.axis === null) {

            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }


        // add a point light on top of the model
        const pointLight = new THREE.PointLight(0xffffff, 1000, 0);
        pointLight.position.set(0, 20, 20);
        this.app.scene.add(pointLight);


        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        this.app.scene.add(pointLightHelper);


        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight);

    }


    /**
     * removes (if existing) and recreates the nurbs surfaces
     */
    createNurbsSurfaces() {

        // are there any meshes to remove?
        if (this.meshes !== null) {

            // traverse mesh array
            for (let i = 0; i < this.meshes.length; i++) {

                // remove all meshes from the scene
                this.app.scene.remove(this.meshes[i])
            }

            this.meshes = [] // empty the array  
        }

        // declare local variables
        let controlPoints1;
        let surfaceData1;
        let mesh1;
        let orderU1 = 1
        let orderV1 = 1

        // build nurb #1
        controlPoints1 =
            [   // U = 0
                [ // V = 0..1;
                    [-2.0, -2.0, 0.0, 0.2],
                    [-2.0, 2.0, 0.0, 1]
                ],
                // U = 1
                [ // V = 0..1
                    [2.0, -2.0, 0.0, 1],
                    [2.0, 2.0, 0.0, 1]
                ]
            ];

        surfaceData1 = this.builder.build(controlPoints1, orderU1, orderV1, this.samplesU, this.samplesV, this.material)

        mesh1 = new THREE.Mesh(surfaceData1, this.material);
        mesh1.rotation.x = 0
        mesh1.rotation.y = 0
        mesh1.rotation.z = 0
        mesh1.scale.set(1, 1, 1)
        mesh1.position.set(-4, 3, 0)
        this.app.scene.add(mesh1)
        this.meshes.push(mesh1)

        let orderU2 = 2
        let orderV2 = 1

        // build nurb #2
        let controlPoints2 =
            [   // U = 0
                [ // V = 0..1;
                    [-1.5, -1.5, 0.0, 1],
                    [-1.5, 1.5, 0.0, 1]
                ],
                // U = 1
                [ // V = 0..1
                    [0, -1.5, 3.0, 1],
                    [0, 1.5, 3.0, 1]
                ],
                // U = 2
                [ // V = 0..1
                    [1.5, -1.5, 0.0, 1],
                    [1.5, 1.5, 0.0, 1]
                ]
            ];

        let surfaceData2 = this.builder.build(controlPoints2, orderU2, orderV2, this.samplesU, this.samplesV, this.material)

        let mesh2 = new THREE.Mesh(surfaceData2, this.material);
        mesh2.position.set(4, 3, 0)
        this.app.scene.add(mesh2)
        this.meshes.push(mesh2)

        let orderU3 = 2
        let orderV3 = 3

        // build nurb #3
        let controlPoints3 =
            [   // U = 0
                [ // V = 0..3;
                    [-1.5, -1.5, 0.0, 1],
                    [-2.0, -2.0, 2.0, 1],
                    [-2.0, 2.0, 2.0, 1],
                    [-1.5, 1.5, 0.0, 1]
                ],
                // U = 1
                [ // V = 0..3
                    [0.0, 0.0, 3.0, 1],
                    [0.0, -2.0, 3.0, 1],
                    [0.0, 2.0, 3.0, 1],
                    [0.0, 0.0, 3.0, 1]
                ],
                // U = 2
                [ // V = 0..3
                    [1.5, -1.5, 0.0, 1],
                    [2.0, -2.0, 2.0, 1],
                    [2.0, 2.0, 2.0, 1],
                    [1.5, 1.5, 0.0, 1]
                ]
            ]

        let surfaceData3 = this.builder.build(controlPoints3, orderU3, orderV3, this.samplesU, this.samplesV, this.material)

        let mesh3 = new THREE.Mesh(surfaceData3, this.material);
        mesh3.position.set(-4, -3, 0)
        this.app.scene.add(mesh3)
        this.meshes.push(mesh3)

        let orderU4 = 3
        let orderV4 = 2

        // build nurb #4
        let controlPoints4 =
            [   // U = 0
                [ // V = 0..2;
                    [-2.0, -2.0, 1.0, 1],
                    [0, -2.0, 0, 1],
                    [2.0, -2.0, -1.0, 1]
                ],
                // U = 1
                [ // V = 0..2
                    [-2.0, -1.0, -2.0, 1],
                    [0, -1.0, -1.0, 1],
                    [2.0, -1.0, 2.0, 1]
                ],
                // U = 2
                [ // V = 0..2
                    [-2.0, 1.0, 5.0, 1],
                    [0, 1.0, 1.5, 1],
                    [2.0, 1.0, -5.0, 1]
                ],
                // U = 3
                [ // V = 0..2
                    [-2.0, 2.0, -1.0, 1],
                    [0, 2.0, 0, 1],
                    [2.0, 2.0, 1.0, 1]
                ]
            ]

        let surfaceData4 = this.builder.build(controlPoints4, orderU4, orderV4, this.samplesU, this.samplesV, this.material)

        let mesh4 = new THREE.Mesh(surfaceData4, this.material);
        mesh4.position.set(4, -3, 0)
        this.app.scene.add(mesh4)
        this.meshes.push(mesh4)
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     *
     */

    update() {
        //let a = null
    }

}


export { MyContents };


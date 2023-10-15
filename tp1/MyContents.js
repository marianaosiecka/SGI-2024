import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';


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

        // floor related attributes
        this.diffuseFloorColor = "#7f7f7f"
        this.specularFloorColor = "#000000"
        this.shininessFloor = 30
        this.floorMaterial = new THREE.MeshPhongMaterial({
            color: this.diffuseFloorColor,
            specular: this.specularFloorColor,
            emissive: "#000000", shininess: this.shininessFloor
        })

        this.mapSize = 4096
        this.nbrPolyg =250
        this.volumeDimX = 10
        this.volumeDimY = 10
        this.volumeDimZ = 10

        this.volumeMeshes = []
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


        // creates a directional light
        const light1 = new THREE.DirectionalLight(0xffffff, 1.5);
        light1.position.set(0, 25, 0);
        light1.castShadow = true;
        light1.shadow.mapSize.width = this.mapSize;
        light1.shadow.mapSize.height = this.mapSize;
        light1.shadow.camera.near = 0.5;
        light1.shadow.camera.far = 27;
        light1.shadow.camera.left = -3;
        light1.shadow.camera.right = 3;
        light1.shadow.camera.bottom = -3;
        light1.shadow.camera.top = 3;
        this.app.scene.add(light1);

        // creates a helper for the light
        const helper1 = new THREE.DirectionalLightHelper(light1, 5);
        this.app.scene.add(helper1);

        // creates a point light
        const light2 = new THREE.PointLight(0xffffff, 1.5, 0, 0);
        light2.position.set(7, 15, 7);
        light2.castShadow = true;
        light2.shadow.mapSize.width = this.mapSize;
        light2.shadow.mapSize.height = this.mapSize;
        light2.shadow.camera.near = 0.5;
        light2.shadow.camera.far = 100;
        this.app.scene.add(light2);

        // creates a helper for the light
        const helper2 = new THREE.PointLightHelper(light2, 1);
        this.app.scene.add(helper2);

        // creates the floating box
        this.buildFloatingBox()

        // creates the floor
        this.buildFloor()

        // creates the volume
        this.buildVolume()
    }


    buildFloatingBox() {
        let box = new THREE.BoxGeometry(1, 1, 1);
        let mesh = new THREE.Mesh(box,
            new THREE.MeshStandardMaterial({ color: "#ffffff" }));
        mesh.position.set(0, 8, 0)

        // cast and receives shadows
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        this.app.scene.add(mesh);
    }


    /**
     * builds a floor
     */
    buildFloor() {
        // Create a plane Mesh with basic material
        //var floor = new THREE.PlaneGeometry(30, 30);
        var floor = new THREE.BoxGeometry(30, 30*0.1*30, 30)
        let mesh = new THREE.Mesh(floor, this.floorMaterial);
        mesh.rotation.x = Math.PI / 2;
        mesh.position.y = 0

        // cast and receives shadows
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        this.app.scene.add(mesh);
    }


    rebuildVolume() {
        for (let i = 0; i < this.nbrPolyg; i++) {
            if (this.volumeMeshes[i] !== null) {
                this.app.scene.remove(this.volumeMeshes[i])
            }
        }
        this.buildVolume()
    }



    buildVolume() {
        const volumeDimXd2 = this.volumeDimX / 2
        const volumeDimYd2 = this.volumeDimY / 2
        const volumeDimZd2 = this.volumeDimZ / 2

        const maxDimX = this.volumeDimX / 3
        const maxDimY = this.volumeDimY / 3


        for (let i = 0; i < this.nbrPolyg; i++) {
            const dimX = maxDimX * Math.random()
            const dimY = maxDimY * Math.random()

            const rotX = 2 * Math.PI * Math.random()
            const rotY = 2 * Math.PI * Math.random()
            const rotZ = 2 * Math.PI * Math.random()

            const posX = this.volumeDimX * Math.random() - volumeDimXd2
            const posY = this.volumeDimY * Math.random() - volumeDimYd2
            const posZ = this.volumeDimZ * Math.random() - volumeDimZd2

            const colorR = Math.random()
            const colorG = Math.random()
            const colorB = Math.random()
            const colorP = new THREE.Color(colorR, colorG, colorB);
            var smallP = new THREE.PlaneGeometry(dimX, dimY)
            this.volumeMeshes[i] =
                new THREE.Mesh(smallP,
                    new THREE.MeshStandardMaterial({ color: colorP }))

            this.volumeMeshes[i].rotation.x = rotX
            this.volumeMeshes[i].rotation.y = rotY
            this.volumeMeshes[i].rotation.z = rotZ

            this.volumeMeshes[i].position.x = posX
            this.volumeMeshes[i].position.y = posY
            this.volumeMeshes[i].position.z = posZ

            this.volumeMeshes[i].receiveShadow = true
            this.volumeMeshes[i].castShadow = true

            this.app.scene.add(this.volumeMeshes[i])
        }

    }


    /**
     * updates the contents
     * this method is called from the render method of the app
     *
     */
    update() {


    }

}


export { MyContents };
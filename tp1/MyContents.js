import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './MyTable.js';
import { MyPlate } from './MyPlate.js';
import { MyCake } from './MyCake.js';
import { MyChair } from './MyChair.js';
import { MyFrame } from './MyFrame.js';
import { MyLamp } from './MyLamp.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = false
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // plane related attributes
        this.diffusePlaneColor = "#B8C8D4"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial1 = new THREE.MeshPhongMaterial({ color: "#c8e3f7"})

        this.planeMaterial2 = new THREE.MeshPhongMaterial({ color: "#FFFFFF"})
    
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    buildWalls(){
        let wall = new THREE.PlaneGeometry( 15, 6 );
        let wall1 = new THREE.PlaneGeometry( 16, 6 );
        let wallMaterial = new THREE.MeshPhongMaterial({ color: "#c8e3f7"})

        // right
        this.wall1Mesh = new THREE.Mesh( wall, wallMaterial );
        this.wall1Mesh.position.z = -8;
        this.wall1Mesh.position.y = 3;
        this.app.scene.add( this.wall1Mesh );
        // left
        this.wall2Mesh = new THREE.Mesh( wall, wallMaterial );
        this.wall2Mesh.rotation.x = Math.PI;
        this.wall2Mesh.position.z = 8;
        this.wall2Mesh.position.y = 3;
        this.app.scene.add( this.wall2Mesh );
        // back
        this.wall3Mesh = new THREE.Mesh( wall1, wallMaterial );
        this.wall3Mesh.rotation.y = Math.PI / 2;
        this.wall3Mesh.position.y = 3;
        this.wall3Mesh.position.x = -7.5;
        this.app.scene.add( this.wall3Mesh );
        // front
        this.wall4Mesh = new THREE.Mesh( wall1, wallMaterial );
        this.wall4Mesh.rotation.y = - Math.PI / 2;
        this.wall4Mesh.position.y = 3;
        this.wall4Mesh.position.x = 7.5;
        this.app.scene.add( this.wall4Mesh );
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
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        this.buildBox()
        
        // Create a Plane Mesh with basic material
        let floor = new THREE.PlaneGeometry( 15, 16 );
        let floorTexture = new THREE.TextureLoader().load('textures/floor_texture.jpg');
        let floorMaterial = new THREE.MeshPhongMaterial({color: "#FFFFFF", map:floorTexture});
        this.floorMesh = new THREE.Mesh( floor, floorMaterial );
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.position.y = -0;
        this.app.scene.add( this.floorMesh );

        this.buildWalls();


        //MESA
        let tableTexture = new THREE.TextureLoader().load('textures/wood_texture.jpg');
        let table = new MyTable(this.app, 3.5, 0.1, 5, 1.2, tableTexture);
        table.buildLegs(0.2, 0.1, 20, "#7A9E9F");
        this.setPosition(table, 0, 0, 5.4)
        this.app.scene.add(table);
        

        //CADEIRAS
        const colorDinnerTableChair = "#7A9E9F";
        const widthSeatDinnerTableChair = 1;
        const heightSeatDinnerTableChair = 0.1;
        const depthSeatDinnerTableChair = 0.9;
        const heightDinnerTableChair = 0.8;

        const widthLegDinnerTableChair = 0.1;
        const heightLegDinnerTableChair = 0.7;
        const depthLegDinnerTableChair = 0.1;
        const colorLegDinnerTableChair = "#7A9E9F";

        let chair1 = new MyChair(this.app, widthSeatDinnerTableChair, heightSeatDinnerTableChair, depthSeatDinnerTableChair, heightDinnerTableChair, colorDinnerTableChair);
        chair1.buildLegs(widthLegDinnerTableChair, heightLegDinnerTableChair, depthLegDinnerTableChair, colorLegDinnerTableChair);
        chair1.buildBackRest(heightSeatDinnerTableChair, widthSeatDinnerTableChair, depthSeatDinnerTableChair, heightDinnerTableChair, colorDinnerTableChair);
        this.setPosition(chair1, -1.8, 0, 6.3)
        this.app.scene.add(chair1);

        let chair2 = new MyChair(this.app, widthSeatDinnerTableChair, heightSeatDinnerTableChair, depthSeatDinnerTableChair, heightDinnerTableChair, colorDinnerTableChair);
        chair2.buildLegs(widthLegDinnerTableChair, heightLegDinnerTableChair, depthLegDinnerTableChair, colorLegDinnerTableChair);
        chair2.buildBackRest(heightSeatDinnerTableChair, widthSeatDinnerTableChair, depthSeatDinnerTableChair, heightDinnerTableChair, colorDinnerTableChair);
        this.setPosition(chair2, -1.8, 0, 4.6)
        this.app.scene.add(chair2);

        let chair3 = new MyChair(this.app, widthSeatDinnerTableChair, heightSeatDinnerTableChair, depthSeatDinnerTableChair, heightDinnerTableChair, colorDinnerTableChair);
        chair3.buildLegs(widthLegDinnerTableChair, heightLegDinnerTableChair, depthLegDinnerTableChair, colorLegDinnerTableChair);
        chair3.buildBackRest(heightSeatDinnerTableChair, widthSeatDinnerTableChair, depthSeatDinnerTableChair, heightDinnerTableChair, colorDinnerTableChair);
        this.setRotation(chair3, 0, Math.PI, 0)
        this.setPosition(chair3, 1.8, 0, 6.3)
        this.app.scene.add(chair3);

        let chair4 = new MyChair(this.app, widthSeatDinnerTableChair, heightSeatDinnerTableChair, depthSeatDinnerTableChair, heightDinnerTableChair, colorDinnerTableChair);
        chair4.buildLegs(widthLegDinnerTableChair, heightLegDinnerTableChair, depthLegDinnerTableChair, colorLegDinnerTableChair);
        chair4.buildBackRest(heightSeatDinnerTableChair, widthSeatDinnerTableChair, depthSeatDinnerTableChair, heightDinnerTableChair, colorDinnerTableChair);
        this.setRotation(chair4, 0, Math.PI, 0);
        this.setPosition(chair4, 1.8, 0, 4.6)
        this.app.scene.add(chair4);

        // PRATO DO BOLO


        // PRATO DA FATIA
        //     constructor(app, radius, height, radialSegments, colorTop, colorBase) {
        //let plateSlice = new MyPlate(this.app, 0.6, 0.05, 50, "#d9d9cc", "#c2c2b2");
        // 1.38, 1.36, 1
        //this.app.scene.add(plateSlice);

        // BOLO
        let cake = new MyCake(this.app, 0.6, 0.4, 25, 1, "#f73772", "#ffffff");
        cake.buildSlice(0.8, -0.5, -2); // pos relativa ao bolo
        this.setPosition(cake, 0, 2, 6.3)
        this.app.scene.add(cake);
        

        // MOLDURAS
        /*
        let frame1 = new MyFrame(this.app, 2.2, 1.5, 0.1, -2, 3, 4.8, "#b51f19", 'pictures/pic_mari.jpg')
        this.app.scene.add(frame1);

        let frame2 = new MyFrame(this.app, 1.5, 2.2, 0.1, 2, 3, 4.8, "#b51f19", 'pictures/pic_mafits.jpeg')
        this.app.scene.add(frame2)

        // JANELA
        let window = new MyWindow(this.app, 3, 3, 0.2, 0, 0, 0, "#b51f19")
        this.app.scene.add(window);
        */
        //SPOT LIGHT
        this.spotLight = new THREE.SpotLight( "#fcf7dc", 10, 4.5, 2*Math.PI/8, 0, 0.2);
        this.spotLight.position.set( 0, 4.4, 0 );
        this.spotLight.target = cake;
        
        
        //CANDEEIRO DE TETO
        let lamp = new MyLamp(this.app, 0.02, 0.6, 0.4, 1.2, 40, 0, 5.4, 0, "#7fa34d", "#f8edb6", this.spotLight);
        lamp.position.z = 5
        this.app.scene.add(lamp);

        //const spotLightHelper = new THREE.SpotLightHelper( this.spotLight );
        //this.app.scene.add(spotLightHelper);

    }

    setPosition(object, x, y, z){
        object.position.x = x;
        object.position.y = y;
        object.position.z = z;
    }

    setRotation(object, x, y, z){
        object.rotation.x = x;
        object.rotation.y = y;
        object.rotation.z = z;
    }
    
    /**
     * updates the x position of the target of the spotlight
     * @param {THREE.Color} value 
     */
    updateSpotLightTargetX(value) {
        const targetObject = new THREE.Object3D(); 
        targetObject.position.x = value;
        targetObject.position.y = this.spotLight.target.position.y;
        this.app.scene.add(targetObject);
        this.spotLight.target = targetObject;
    }
    /**
     * updates the y position of the target of the spotlight
     * @param {THREE.Color} value 
     */
    updateSpotLightTargetY(value) {
        const targetObject = new THREE.Object3D(); 
        targetObject.position.y = value;
        targetObject.position.x = this.spotLight.target.position.x;
        this.app.scene.add(targetObject);
        this.spotLight.target = targetObject;
    }
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };
import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './objects/MyTable.js';
import { MyPlate } from './objects/MyPlate.js';
import { MyCake } from './objects/MyCake.js';
import { MyChair } from './objects/MyChair.js';
import { MyFrame } from './objects/MyFrame.js';
import { MyLamp } from './objects/MyLamp.js';
import { MyCarpet } from './objects/MyCarpet.js';
import { MySofa } from './objects/MySofa.js';
import { MyPillow } from './objects/MyPillow.js';
import { MyCakePlate } from './objects/MyCakePlate.js';
import { MyFork } from './objects/MyFork.js';
import { MyCandle } from './objects/MyCandle.js';
import { MyFloorLamp } from './objects/MyFloorLamp.js';
import { MyCoffeeTable } from './objects/MyCoffeeTable.js';
import { MyWallLamp } from './objects/MyWallLamp.js';
import { MyCeilingLamp } from './objects/MyCeilingLamp.js';
import { MyWindow } from './objects/MyWindow.js';
import { MyVinylPlayerHolder } from './objects/MyVinylPlayerHolder.js';
import { MyCar } from './objects/MyCar.js';

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

        // COLORS
        this.green = "#5e6e47";
        this.darkBlue = "#1B4984";
        this.lightBlue = "#a7c3d1";
        this.brown = "#71381d";
        this.yellow = "#d9c86f";
        this.orange = "#cc7722";
        this.lightColor = "#f8edb6";
        this.offWhite = "#d9d9cc";
        this.white = "#FFFFFF";
        this.bege = "#fffaed";
        this.grey = "#B0B0B0";

        this.wallXPos = 7.5;
        this.wallZPos = 8;
        this.wallHeight = 6;
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
        let wallMaterial = new THREE.MeshPhongMaterial({ color: this.bege})

        this.windowHeight = 3;
        this.windowWidth = 2.2;
        this.windowY = 3.5;
        this.windowZ = 0;

        // right
        this.wall1Mesh = new THREE.Mesh( wall, wallMaterial );
        this.wall1Mesh.position.z = -this.wallZPos;
        this.wall1Mesh.position.y = 3;
        this.app.scene.add( this.wall1Mesh );
        // left
        this.wall2Mesh = new THREE.Mesh( wall, wallMaterial );
        this.wall2Mesh.rotation.x = Math.PI;
        this.wall2Mesh.position.z = this.wallZPos;
        this.wall2Mesh.position.y = 3;
        this.app.scene.add( this.wall2Mesh );

        // back
        const windowWallRightWidth = - (-8 - (this.windowZ - (this.windowWidth / 2)))
        this.windowWallRight = new THREE.PlaneGeometry(windowWallRightWidth, 6);
        this.windowWallRightMesh = new THREE.Mesh(this.windowWallRight, wallMaterial)
        this.windowWallRightMesh.rotation.y = Math.PI / 2;
        this.windowWallRightMesh.position.y = 3;
        this.windowWallRightMesh.position.x = -7.5;
        this.windowWallRightMesh.position.z = ( (-8) + (this.windowZ - (this.windowWidth / 2))) / 2;

        this.windowWallLeft = new THREE.PlaneGeometry(16 - windowWallRightWidth - this.windowWidth, 6);
        this.windowWallLeftMesh = new THREE.Mesh(this.windowWallLeft, wallMaterial)
        this.windowWallLeftMesh.rotation.y = Math.PI / 2;
        this.windowWallLeftMesh.position.y = 3;
        this.windowWallLeftMesh.position.x = -7.5;
        this.windowWallLeftMesh.position.z = (8 + (this.windowZ + (this.windowWidth / 2))) / 2

        const windowWallTopHeight = 6 - (this.windowY + this.windowHeight/2)
        this.windowWallTop = new THREE.PlaneGeometry(this.windowWidth, windowWallTopHeight);
        this.windowWallTopMesh = new THREE.Mesh(this.windowWallTop, wallMaterial)
        this.windowWallTopMesh.rotation.y = Math.PI / 2;
        this.windowWallTopMesh.position.x = -7.5;
        this.windowWallTopMesh.position.z = this.windowZ;
        this.windowWallTopMesh.position.y = (6 + (this.windowY + (this.windowHeight / 2))) / 2

        this.windowWallDown = new THREE.PlaneGeometry(this.windowWidth, 6 - windowWallTopHeight - this.windowHeight);
        this.windowWallDownMesh = new THREE.Mesh(this.windowWallDown, wallMaterial)
        this.windowWallDownMesh.rotation.y = Math.PI / 2;
        this.windowWallDownMesh.position.x = -7.5;
        this.windowWallDownMesh.position.z = this.windowZ;
        this.windowWallDownMesh.position.y = (this.windowY - this.windowHeight/2) / 2;

        this.app.scene.add( this.windowWallRightMesh );
        this.app.scene.add( this.windowWallLeftMesh );
        this.app.scene.add( this.windowWallTopMesh );
        this.app.scene.add( this.windowWallDownMesh );




        // front
        this.wall4Mesh = new THREE.Mesh( wall1, wallMaterial );
        this.wall4Mesh.rotation.y = - Math.PI / 2;
        this.wall4Mesh.position.y = 3;
        this.wall4Mesh.position.x = this.wallXPos;
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
        const pointLight = new THREE.PointLight(this.white, 10 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x777777, 1);
        this.app.scene.add( ambientLight );

        const directionalLight1 = new THREE.DirectionalLight(this.white, 0.8); 
        directionalLight1.position.set(1, 2, -1); 
        this.app.scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(this.white, 0.8); 
        directionalLight2.position.set(1, 2, 1); 
        this.app.scene.add(directionalLight2);
        
        this.buildBox()
        
        // Create a Plane Mesh with basic material
        let floor = new THREE.PlaneGeometry( 15, 16 );
        let floorTexture = new THREE.TextureLoader().load('textures/floor_texture.jpg');
        let floorMaterial = new THREE.MeshPhongMaterial({color: "#e8d7c8", map:floorTexture});
        this.floorMesh = new THREE.Mesh( floor, floorMaterial );
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.position.y = -0;
        this.app.scene.add( this.floorMesh );

        this.buildWalls();


        //MESA
        let tableTexture = new THREE.TextureLoader().load('textures/wood_texture.jpg');
        let table = new MyTable(this.app, 3.5, 0.1, 5, 1.2, tableTexture);
        table.buildLegs(0.2, 0.1, 20, this.brown);
        this.setPosition(table, 0, 0, 5.4)
        this.app.scene.add(table);
        

        //CADEIRAS
        const colorDinnerTableChair =  this.yellow;
        const widthSeatDinnerTableChair = 1;
        const heightSeatDinnerTableChair = 0.1;
        const depthSeatDinnerTableChair = 0.9;
        const heightDinnerTableChair = 0.8;

        const widthLegDinnerTableChair = 0.1;
        const heightLegDinnerTableChair = 0.7;
        const depthLegDinnerTableChair = 0.1;
        const colorLegDinnerTableChair = this.brown;

        let chair1 = new MyChair(this.app, widthSeatDinnerTableChair, heightSeatDinnerTableChair, depthSeatDinnerTableChair, heightDinnerTableChair, colorDinnerTableChair);
        chair1.buildLegs(widthLegDinnerTableChair, heightLegDinnerTableChair, depthLegDinnerTableChair, colorLegDinnerTableChair);
        chair1.buildBackRest(heightSeatDinnerTableChair, widthSeatDinnerTableChair, depthSeatDinnerTableChair, colorDinnerTableChair);
        this.setPosition(chair1, -1.8, 0, 6.3)
        this.app.scene.add(chair1);

        let chair2 = new MyChair(this.app, widthSeatDinnerTableChair, heightSeatDinnerTableChair, depthSeatDinnerTableChair, heightDinnerTableChair, colorDinnerTableChair);
        chair2.buildLegs(widthLegDinnerTableChair, heightLegDinnerTableChair, depthLegDinnerTableChair, colorLegDinnerTableChair);
        chair2.buildBackRest(heightSeatDinnerTableChair, widthSeatDinnerTableChair, depthSeatDinnerTableChair, colorDinnerTableChair);
        this.setPosition(chair2, -1.8, 0, 4.6)
        this.app.scene.add(chair2);

        let chair3 = new MyChair(this.app, widthSeatDinnerTableChair, heightSeatDinnerTableChair, depthSeatDinnerTableChair, heightDinnerTableChair, colorDinnerTableChair);
        chair3.buildLegs(widthLegDinnerTableChair, heightLegDinnerTableChair, depthLegDinnerTableChair, colorLegDinnerTableChair);
        chair3.buildBackRest(heightSeatDinnerTableChair, widthSeatDinnerTableChair, depthSeatDinnerTableChair, colorDinnerTableChair);
        this.setRotation(chair3, 0, Math.PI - 0.5, 0)
        this.setPosition(chair3, 2.3, 0, 6.3)
        this.app.scene.add(chair3);

        let chair4 = new MyChair(this.app, widthSeatDinnerTableChair, heightSeatDinnerTableChair, depthSeatDinnerTableChair, heightDinnerTableChair, colorDinnerTableChair);
        chair4.buildLegs(widthLegDinnerTableChair, heightLegDinnerTableChair, depthLegDinnerTableChair, colorLegDinnerTableChair);
        chair4.buildBackRest(heightSeatDinnerTableChair, widthSeatDinnerTableChair, depthSeatDinnerTableChair, colorDinnerTableChair);
        this.setRotation(chair4, 0, Math.PI, 0);
        this.setPosition(chair4, 1.8, 0, 4.6)
        this.app.scene.add(chair4);


        // PRATO DO BOLO
        let cakePlate = new MyCakePlate(this.app, 0.7, 0.05, 50, this.offWhite, "#c2c2b2")
        this.setPosition(cakePlate, 0, 1.7, 4.5);
        this.app.scene.add(cakePlate)

        // PRATO DA FATIA
        let plateSlice = new MyPlate(this.app, 0.52, 0.05, 50, this.offWhite, "#c2c2b2");
        this.setPosition(plateSlice, 1.1, 1.38, 6.3)
        this.app.scene.add(plateSlice);

        // BOLO & FATIA
        let fillingTexture = new THREE.TextureLoader().load('textures/cake_slice_texture.png');
        let cake = new MyCake(this.app, 0.6, 0.4, 25, 1, "#E1A693", "#614E3F", fillingTexture);
        cake.buildSlice(-1.3, -0.3, -2); // pos relativa ao bolo
        this.setPosition(cake, 0, 1.9, 4.5);
        this.setRotation(cake, 0, Math.PI, 0);
        this.app.scene.add(cake);

        // VELA
        let candle1 = new MyCandle(this.app, 0.03, 0.18, 40, this.orange, this.yellow);
        this.setPosition(candle1, cake.position.x - 0.2, cake.position.y + 0.275, cake.position.z + 0.15);
        this.app.scene.add(candle1);

        let candle2 = new MyCandle(this.app, 0.03, 0.18, 40, this.orange, this.yellow);
        this.setPosition(candle2, cake.position.x + 0.2, cake.position.y + 0.275, cake.position.z + 0.15);
        this.app.scene.add(candle2);
        
        let candle3 = new MyCandle(this.app, 0.03, 0.18, 40, this.orange, this.yellow);
        this.setPosition(candle3, cake.position.x - 0.2, cake.position.y + 0.275, cake.position.z - 0.3);
        this.app.scene.add(candle3);

        let candle4 = new MyCandle(this.app, 0.03, 0.18, 40, this.orange, this.yellow);
        this.setPosition(candle4, plateSlice.position.x, cake.position.y -0.3 + 0.275, plateSlice.position.z);
        this.app.scene.add(candle4);
        
        
        // GARFO
        let fork = new MyFork(this.app, 5, 0.8, 0.03, "#9C9C9C");
        this.setScale(fork, 0.2)
        this.setPosition(fork, 0.95, 1.27, 7)
        this.app.scene.add(fork)
        

        // MOLDURAS
        let frame1Texture = new THREE.TextureLoader().load('pictures/painting2.jpg');
        let frame1 = new MyFrame(this.app, 1.47, 2.3, 0.08, this.bege, this.white, frame1Texture)
        this.setPosition(frame1, 4, 3.5, 7.8)
        this.setRotation(frame1, 0, Math.PI/2, 0)
        this.app.scene.add(frame1);

        let frame2Texture = new THREE.TextureLoader().load('pictures/painting1.jpg');
        let frame2 = new MyFrame(this.app, 2.09, 2.1, 0.1, this.bege, this.white, frame2Texture);
        this.setPosition(frame2, -4, 3.2, 7.8)
        this.setRotation(frame2, 0, Math.PI/2, 0)
        this.app.scene.add(frame2)
        
        let frame3Texture = new THREE.TextureLoader().load('pictures/photography1.jpg');
        let frame3 = new MyFrame(this.app, 2.8, 2.05, 0.1, this.bege, this.white, frame3Texture)
        this.setPosition(frame3, 0, 3, -7.8);
        this.setRotation(frame3, 0, -Math.PI/2, 0);
        this.app.scene.add(frame3);

        let carFrameTexture = new THREE.TextureLoader().load('textures/white_texture.png');
        let carFrame = new MyFrame(this.app, 2.3, 1.3, 0.1, this.bege, this.white, carFrameTexture);
        this.setPosition(carFrame, -3.5, 4, -7.8)
        this.setRotation(carFrame, 0, -Math.PI/2, 0)
        this.app.scene.add(carFrame);

        // JANELA
        let windowTexture = new THREE.TextureLoader().load('textures/window_texture.jpg');
        let window = new MyWindow(this.app, this.windowWidth , this.windowHeight, 0.3, this.white, windowTexture)
        window.bottomDownPart();
        this.setRotation(window, 0, Math.PI/2, 0,);
        this.setPosition(window, -7.4, this.windowY, this.windowZ)
        this.app.scene.add(window);

        let windowLight = new THREE.RectAreaLight(0xffffff, 100, this.windowWidth, this.windowHeight);
        this.setPosition(windowLight, -8.3, this.windowY, this.windowZ)
        this.app.scene.add(windowLight)

        //SPOT LIGHT
        this.spotLight = new THREE.SpotLight(this.lightColor, 8, 10, Math.PI/4, 1, 0.2);
        this.spotLight.target = cake;
        
        //CANDEEIRO DE TETO
        let lampTable = new MyLamp(this.app, 0.02, 0.6, 0.4, 1, 40, this.orange, this.lightColor, this.spotLight);
        this.setPosition(lampTable, 0, 5.5, 5);
        this.app.scene.add(lampTable);

        //TAPETE
        let carpetTexture = new THREE.TextureLoader().load('textures/carpet_texture.png');
        let carpet = new MyCarpet(this.app, 7.5, 0.1, 5, this.lightBlue, carpetTexture);
        this.setPosition(carpet, 0, 0.05, -5);
        this.app.scene.add(carpet);

        //ALMOFADAS
        let pillow1Texture = new THREE.TextureLoader().load('textures/pillow3_print.jpg');
        let pillow2Texture = new THREE.TextureLoader().load('textures/pillow1_print.jpg');
        let pillow3Texture = new THREE.TextureLoader().load('textures/pillow4_print.jpg');
        let pillow4Texture = new THREE.TextureLoader().load('textures/pillow2_print.jpg');
        const angleY = Math.PI/12;
        const angleZ = Math.PI/15;
        let pillow1 = new MyPillow(this.app, 0.6, 0.3, 0.6, this.white, pillow1Texture);
        this.setRotation(pillow1, 0, angleY, angleZ);
        let pillow2 = new MyPillow(this.app, 0.7, 0.35, 0.7, this.white, pillow2Texture);
        this.setRotation(pillow2, 0, -angleY, angleZ);
        let pillow3 = new MyPillow(this.app, 0.6, 0.3, 0.6, this.white, pillow3Texture);
        this.setRotation(pillow3, 0, 0, angleZ);
        let pillow4 = new MyPillow(this.app, 0.7, 0.35, 0.7, this.white, pillow4Texture);
        this.setRotation(pillow4, 0, -angleY, angleZ);

        //SOFAS
        let sofa1 = new MySofa(this.app, 1, 0.4, 0.1, this.brown);
        this.setRotation(sofa1, 0, -Math.PI/3, 0);
        sofa1.setPillow(pillow1, 0.6, -0.3);
        sofa1.setPillow(pillow2, 0.7, 0.3);
        this.setPosition(sofa1, -2.5, 0, -6.2);
        this.app.scene.add(sofa1);

        let sofa2 = new MySofa(this.app, 1, 0.4, 0.1, this.brown);
        this.setRotation(sofa2, 0, Math.PI/4 + Math.PI, 0);
        sofa2.setPillow(pillow3, 0.6, -0.3);
        sofa2.setPillow(pillow4, 0.7, 0.3);
        this.setPosition(sofa2, 2.3, 0, -6.2);
        this.app.scene.add(sofa2);

        //CANDEEIRO SOFAS
        let spotLightSofas = new THREE.SpotLight(this.lightColor, 8, 5, Math.PI/4, 1, 0.2);
        spotLightSofas.target = carpet;

        let lampSofas = new MyLamp(this.app, 0.02, 0.6, 0.4, 1, 40, this.orange, this.lightColor, spotLightSofas);
        this.setPosition(lampSofas, 0, 5.5, -4.8);
        this.app.scene.add(lampSofas);

        //CANDEEIRO CHÃO
        const floorLampX = 4.7;
        const floorLampY = 0;
        const floorLampZ = -6;
        const floorLampHeight = 2.8;
        
        //luz que ilumina a lâmpada
        let lampHighlight = new THREE.SpotLight(this.lightColor, 20, 14, Math.PI/40, 2, 0.2);
        this.setPosition(lampHighlight, 0, 0, 5);
        //luz que sai do candeeiro
        let lightFloorLamp = new THREE.SpotLight(this.lightColor, 20, 10, Math.PI/6, 1, 0.8);
        
        let floorLamp = new MyFloorLamp(this.app, 0.4, 0.3, 0.2, 0.2, floorLampHeight, 40, this.darkBlue, this.darkBlue, this.lightColor, lampHighlight, lightFloorLamp);
        this.setRotation(floorLamp, 0, -Math.PI/4, 0);
        this.setPosition(floorLamp, floorLampX, floorLampY, floorLampZ);
        this.setPosition(lightFloorLamp, 0, floorLamp.getLightYPos(), - Math.cos(floorLampHeight) + 1);
        this.app.scene.add(floorLamp);

        //MESA DOS SOFÁS
        let coffeeTable = new MyCoffeeTable(this.app, 1, 0.18, 2, this.green);
        this.setRotation(coffeeTable, 0, Math.PI/2, 0);
        this.setPosition(coffeeTable, 0, 0.05, -4.2);
        coffeeTable.buildBooks(["#E57373", "#FFD700", "#FFA07A", "#85A1CC", "#AED9E0", "#FFB74D"]);
        this.app.scene.add(coffeeTable);

        // GIRA DISCOS 
        let vinylPlayerHolder = new MyVinylPlayerHolder(this.app, 1.5, 1.5, 1, this.orange);
        vinylPlayerHolder.buildPlayer(this.green, this.blue);
        
        let coverColors = ["#00204A", "#A41A1A", "#6B1B7F", "#8B735B", "#000000", "#FF6B35", "#800000", "#007A7C", "#DAA520", "#967BB6", "#228B22", "#00204A", "#FF6B35",  "#A41A1A", "#FFD700"]
        vinylPlayerHolder.buildCovers(coverColors)
        const coverTexture = new THREE.TextureLoader().load('textures/cover4.jpg');
        vinylPlayerHolder.buildNowPlayingShelf("#ffffff", coverTexture)
        this.setPosition(vinylPlayerHolder, -7, 0, -5)
        this.app.scene.add(vinylPlayerHolder);

        //LUZES DE PAREDE
        const wallLampX = 0.15 - this.wallXPos;
        const wallLampY = this.wallHeight - this.wallHeight/2.5;
        const wallLampZ = this.wallZPos/2;
        const wallLightY = - 0.15;

        //luzes das luzes de parede
        let lightWallLampFLeft = new THREE.SpotLight(this.lightColor, 6, 12, Math.PI/4, 1, 0.8);
        lightWallLampFLeft.position.y = wallLightY;
        lightWallLampFLeft.target = this.createHelperObject(wallLampX, this.wallHeight, wallLampZ);
        
        let lightWallLampFRight = new THREE.SpotLight(this.lightColor, 6, 12, Math.PI/4, 1, 0.8);
        lightWallLampFRight.position.y = wallLightY;
        lightWallLampFRight.target = this.createHelperObject(wallLampX, this.wallHeight, -wallLampZ);

        let lightWallLampBLeft = new THREE.SpotLight(this.lightColor, 6, 12, Math.PI/4, 1, 0.8);
        lightWallLampBLeft.position.y = wallLightY;
        lightWallLampBLeft.target = this.createHelperObject(-wallLampX, this.wallHeight, -wallLampZ);
        
        let lightWallLampBRight = new THREE.SpotLight(this.lightColor, 6, 12, Math.PI/4, 1, 0.8);
        lightWallLampBRight.position.y = wallLightY;
        lightWallLampBRight.target = this.createHelperObject(-wallLampX, this.wallHeight, wallLampZ);

        let wallLampFLeft = new MyWallLamp(this.app, 0.1, 0.3, 0.3, this.green, lightWallLampFLeft);
        this.setPosition(wallLampFLeft, wallLampX, wallLampY, wallLampZ);

        let wallLampFRight = new MyWallLamp(this.app, 0.1, 0.3, 0.3, this.green, lightWallLampFRight);
        this.setPosition(wallLampFRight, wallLampX, wallLampY, -wallLampZ);

        let wallLampBLeft = new MyWallLamp(this.app, 0.1, 0.3, 0.3, this.green, lightWallLampBLeft);
        this.setRotation(wallLampBLeft, 0, Math.PI, 0);
        this.setPosition(wallLampBLeft, -wallLampX, wallLampY, -wallLampZ);

        let wallLampBRight = new MyWallLamp(this.app, 0.1, 0.3, 0.3, this.green, lightWallLampBRight);
        this.setRotation(wallLampBRight, 0, Math.PI, 0);
        this.setPosition(wallLampBRight, -wallLampX, wallLampY, wallLampZ);
        
        this.app.scene.add(wallLampFLeft);
        this.app.scene.add(wallLampFRight);
        this.app.scene.add(wallLampBLeft);
        this.app.scene.add(wallLampBRight);

        this.lightHelp1 = new THREE.SpotLightHelper(lightWallLampFLeft)
        this.lightHelp2 = new THREE.SpotLightHelper(lightWallLampFRight)
        this.lightHelp3 = new THREE.SpotLightHelper(lightWallLampBLeft)
        this.lightHelp4 = new THREE.SpotLightHelper(lightWallLampBRight)

        //LUZES DE TETO
        const ceilingLightX = 5;
        const ceilingLightY = this.wallHeight - 0.04;
        const ceilingLightZ = 4;

        //highlight é o que faz parecer que a luz está ligada (aponta para o candeeiro em si)
        let ceilingHighlight1 = new THREE.SpotLight( this.lightColor, 10, 6, Math.PI/10, 1, 0.8);
        //ceiling light é a luz que sai do candeeiro
        let ceilingLight1 = new THREE.SpotLight(this.lightColor, 15, 10, Math.PI/3, 1, 0.8);
        ceilingLight1.target = this.createHelperObject(-ceilingLightX, 0, ceilingLightZ);
        //criação do próprio candeeiro
        let ceilinglamp1 = new MyCeilingLamp(this.app, 0.1, 0.4, 0.6, this.grey, this.lightColor, ceilingHighlight1, ceilingLight1);
        this.setRotation(ceilinglamp1, 0, 0, Math.PI/2);
        this.setRotation(ceilingHighlight1, 0, 0, Math.PI/2);
        this.setPosition(ceilingHighlight1, -this.wallHeight+2, 0, 0);
        this.setPosition(ceilinglamp1, -ceilingLightX, ceilingLightY, ceilingLightZ);
        ceilinglamp1.scale.x = 0.4;
        this.app.scene.add(ceilinglamp1);

        let ceilingHighlight2 = new THREE.SpotLight(this.lightColor, 10, 6, Math.PI/10, 1, 0.8);
        let ceilingLight2 = new THREE.SpotLight(this.lightColor, 15, 10, Math.PI/3, 1, 0.8);
        ceilingLight2.target = this.createHelperObject(ceilingLightX, 0, ceilingLightZ);
         let ceilinglamp2 = new MyCeilingLamp(this.app, 0.1, 0.4, 0.6, this.grey, this.lightColor, ceilingHighlight2, ceilingLight2);
        this.setRotation(ceilinglamp2, 0, 0, Math.PI/2);
        this.setRotation(ceilingHighlight2, 0, 0, Math.PI/2);
        this.setPosition(ceilingHighlight2, -this.wallHeight+2, 0, 0);
        this.setPosition(ceilinglamp2, ceilingLightX, ceilingLightY, ceilingLightZ);
        ceilinglamp2.scale.x = 0.4;
        this.app.scene.add(ceilinglamp2);

        let ceilingHighlight3 = new THREE.SpotLight(this.lightColor, 10, 6, Math.PI/10, 1, 0.8);
        let ceilingLight3 = new THREE.SpotLight(this.lightColor, 15, 10, Math.PI/3, 1, 0.8);
        ceilingLight3.target = this.createHelperObject(-ceilingLightX, 0, -ceilingLightZ);
        let ceilinglamp3 = new MyCeilingLamp(this.app, 0.1, 0.4, 0.6, this.grey, this.lightColor, ceilingHighlight3, ceilingLight3);
        this.setRotation(ceilinglamp3, 0, 0, Math.PI/2);
        this.setRotation(ceilingHighlight3, 0, 0, Math.PI/2);
        this.setPosition(ceilingHighlight3, -this.wallHeight+2, 0, 0);
        this.setPosition(ceilinglamp3, -ceilingLightX, ceilingLightY, -ceilingLightZ);
        ceilinglamp3.scale.x = 0.4;
        this.app.scene.add(ceilinglamp3);

        let ceilingHighlight4 = new THREE.SpotLight(this.lightColor, 10, 6, Math.PI/10, 1, 0.8);
        let ceilingLight4 = new THREE.SpotLight(this.lightColor, 15, 10, Math.PI/3, 1, 0.8);
        ceilingLight4.target = this.createHelperObject(ceilingLightX, 0, -ceilingLightZ);
         let ceilinglamp4 = new MyCeilingLamp(this.app, 0.1, 0.4, 0.6, this.grey, this.lightColor, ceilingHighlight4, ceilingLight4);
        this.setRotation(ceilinglamp4, 0, 0, Math.PI/2);
        this.setRotation(ceilingHighlight4, 0, 0, Math.PI/2);
        this.setPosition(ceilingHighlight4, -this.wallHeight+2, 0, 0);
        this.setPosition(ceilinglamp4, ceilingLightX, ceilingLightY, -ceilingLightZ);
        ceilinglamp4.scale.x = 0.4;
        this.app.scene.add(ceilinglamp4);

        let h = new THREE.SpotLightHelper(ceilingLight1);
        //this.app.scene.add(h);
        let h1 = new THREE.SpotLightHelper(ceilingLight2);
        //this.app.scene.add(h1);
        let h2 = new THREE.SpotLightHelper(ceilingLight3);
        //this.app.scene.add(h2);
        let h3 = new THREE.SpotLightHelper(ceilingLight4);
        //this.app.scene.add(h3);

        let car = new MyCar(this.app);
        const carGeometry = new THREE.BufferGeometry().setFromPoints([
            ...car.backRoofCurve.getPoints(50),
            ...car.frontRoofCurve.getPoints(50),
            //...car.windowCurve.getPoints(50),
            ...car.hoodCurve.getPoints(50),
            ...car.backWheelCurve.getPoints(50),
            ...car.smallBackWheelCurve.getPoints(50),
            ...car.frontWheelCurve.getPoints(50),
            ...car.smallFrontWheelCurve.getPoints(50),
        ]);  

        const carMaterial = new THREE.LineBasicMaterial({ color: "#000000" });
        const carMesh = new THREE.Line(carGeometry, carMaterial);
        carMesh.rotation.y = Math.PI/2;
        this.setPosition(carMesh, 0.02, -0.53, 0.75)
        carFrame.addObject(carMesh);
        this.setScale(carFrame, 0.8, 0.8, 0.8);

        let newspaper = new MyNewspaper(this.app, new THREE.TextureLoader().load('textures/newspaper_texture.jpg'))
        this.setPosition(newspaper, 0, 0.9, -4.9);
        this.setRotation(newspaper, 0, Math.PI/10, 0);
        this.app.scene.add(newspaper);
        
        let spiralSpring = new MySpiralSpring(this.app, "#9C9C9C");
        this.setRotation(spiralSpring, 0, Math.PI/8, 0);
        this.setScale(spiralSpring, 0.5, 0.5, 0.5);
        this.setPosition(spiralSpring, -0.8, 1.38, 5.7);
        this.app.scene.add(spiralSpring);

    }

    createHelperObject(x, y, z) {
        let obj = new THREE.Object3D();
        this.setPosition(obj, x, y, z);
        return obj;
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

    setScale(object, s){
        object.scale.x = s;
        object.scale.y = s;
        object.scale.z = s;
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
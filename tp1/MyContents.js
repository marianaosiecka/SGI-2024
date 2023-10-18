import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './objects/furniture/MyTable.js';
import { MyPlate } from './objects/cake/MyPlate.js';
import { MyCake } from './objects/cake/MyCake.js';
import { MyChair } from './objects/furniture/MyChair.js';
import { MyFrame } from './objects/furniture/MyFrame.js';
import { MyLamp } from './objects/lights/MyLamp.js';
import { MyCarpet } from './objects/furniture/MyCarpet.js';
import { MySofa } from './objects/furniture/MySofa.js';
import { MyPillow } from './objects/curves/MyPillow.js';
import { MyCakePlate } from './objects/cake/MyCakePlate.js';
import { MyFork } from './objects/cake/MyFork.js';
import { MyCandle } from './objects/cake/MyCandle.js';
import { MyFloorLamp } from './objects/lights/MyFloorLamp.js';
import { MyCoffeeTable } from './objects/furniture/MyCoffeeTable.js';
import { MyWallLamp } from './objects/lights/MyWallLamp.js';
import { MyCeilingLamp } from './objects/lights/MyCeilingLamp.js';
import { MyWindow } from './objects/furniture/MyWindow.js';
import { MyVinylPlayerHolder } from './objects/furniture/MyVinylPlayerHolder.js';
import { MyCar } from './objects/curves/MyCar.js';
import { MyNewspaper } from './objects/curves/MyNewspaper.js';
import { MyVase } from './objects/curves/MyVase.js';
import { MySpiralSpring } from './objects/curves/MySpiralSpring.js';
import { MyBalloon } from './objects/curves/MyBalloon.js';
import { MyDoor } from './objects/furniture/MyDoor.js';

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

        // plane related attributes
        this.diffusePlaneColor = "#B8C8D4"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial1 = new THREE.MeshPhongMaterial({ color: "#c8e3f7" })
        this.planeMaterial2 = new THREE.MeshPhongMaterial({ color: "#FFFFFF" })

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

        // shadow related attribtues
        this.mapSize = 1024
    }


    buildWalls() {
        const wallHeight = 6;
        const wallFrontBackWidth = 16;
        const wallSideWidth = 15;


        let wall = new THREE.PlaneGeometry(wallSideWidth, wallHeight);
        let wallMaterial = new THREE.MeshPhongMaterial({ color: this.bege })

        this.doorHeight = 4.5;
        this.doorWidth = 2.5;
        this.doorY = this.doorHeight / 2;
        this.doorZ = 0;

        this.windowHeight = 3;
        this.windowWidth = 2.2;
        this.windowY = 3.5;
        this.windowZ = 0;

        // right
        this.wall1Mesh = new THREE.Mesh(wall, wallMaterial);
        this.wall1Mesh.position.z = -this.wallZPos;
        this.wall1Mesh.position.y = wallHeight / 2;
        this.wall1Mesh.receiveShadow = true;
        this.app.scene.add(this.wall1Mesh);
        // left
        this.wall2Mesh = new THREE.Mesh(wall, wallMaterial);
        this.wall2Mesh.rotation.x = Math.PI;
        this.wall2Mesh.position.z = this.wallZPos;
        this.wall2Mesh.position.y = wallHeight / 2;
        this.wall2Mesh.receiveShadow = true;
        this.app.scene.add(this.wall2Mesh);

        // back
        const windowWallRightWidth = - (-wallFrontBackWidth / 2 - (this.windowZ - (this.windowWidth / 2)))
        this.windowWallRight = new THREE.PlaneGeometry(windowWallRightWidth, wallHeight);
        this.windowWallRightMesh = new THREE.Mesh(this.windowWallRight, wallMaterial)
        this.windowWallRightMesh.receiveShadow = true;
        this.windowWallRightMesh.rotation.y = Math.PI / 2;
        this.windowWallRightMesh.position.y = wallHeight / 2;
        this.windowWallRightMesh.position.x = -wallSideWidth / 2;
        this.windowWallRightMesh.position.z = (-wallFrontBackWidth / 2 + (this.windowZ - (this.windowWidth / 2))) / 2;

        this.windowWallLeft = new THREE.PlaneGeometry(wallFrontBackWidth - windowWallRightWidth - this.windowWidth, wallHeight);
        this.windowWallLeftMesh = new THREE.Mesh(this.windowWallLeft, wallMaterial)
        this.windowWallLeftMesh.receiveShadow = true;
        this.windowWallLeftMesh.rotation.y = Math.PI / 2;
        this.windowWallLeftMesh.position.y = wallHeight / 2;
        this.windowWallLeftMesh.position.x = -wallSideWidth / 2;
        this.windowWallLeftMesh.position.z = (wallFrontBackWidth / 2 + (this.windowZ + (this.windowWidth / 2))) / 2

        const windowWallTopHeight = wallHeight - (this.windowY + this.windowHeight / 2)
        this.windowWallTop = new THREE.PlaneGeometry(this.windowWidth, windowWallTopHeight);
        this.windowWallTopMesh = new THREE.Mesh(this.windowWallTop, wallMaterial)
        this.windowWallTopMesh.receiveShadow = true;
        this.windowWallTopMesh.rotation.y = Math.PI / 2;
        this.windowWallTopMesh.position.x = -wallSideWidth / 2;
        this.windowWallTopMesh.position.z = this.windowZ;
        this.windowWallTopMesh.position.y = (wallHeight + (this.windowY + (this.windowHeight / 2))) / 2

        this.windowWallDown = new THREE.PlaneGeometry(this.windowWidth, wallHeight - windowWallTopHeight - this.windowHeight);
        this.windowWallDownMesh = new THREE.Mesh(this.windowWallDown, wallMaterial)
        this.windowWallDownMesh.receiveShadow = true;
        this.windowWallDownMesh.rotation.y = Math.PI / 2;
        this.windowWallDownMesh.position.x = -wallSideWidth / 2;
        this.windowWallDownMesh.position.z = this.windowZ;
        this.windowWallDownMesh.position.y = (this.windowY - this.windowHeight / 2) / 2;

        this.app.scene.add(this.windowWallRightMesh);
        this.app.scene.add(this.windowWallLeftMesh);
        this.app.scene.add(this.windowWallTopMesh);
        this.app.scene.add(this.windowWallDownMesh);



        // front
        const doorWallRightWidth = - (-wallFrontBackWidth / 2 - (this.doorZ - (this.doorWidth / 2)))
        this.doorWallRight = new THREE.PlaneGeometry(doorWallRightWidth, wallHeight);
        this.doorWallRightMesh = new THREE.Mesh(this.doorWallRight, wallMaterial)
        this.doorWallRightMesh.receiveShadow = true;
        this.doorWallRightMesh.rotation.y = -Math.PI / 2;
        this.doorWallRightMesh.position.y = wallHeight / 2;
        this.doorWallRightMesh.position.x = wallSideWidth / 2;
        this.doorWallRightMesh.position.z = (-wallFrontBackWidth / 2 + (this.doorZ - (this.doorWidth / 2))) / 2;

        this.doorWallLeft = new THREE.PlaneGeometry(wallFrontBackWidth - doorWallRightWidth - this.doorWidth, wallHeight);
        this.doorWallLeftMesh = new THREE.Mesh(this.doorWallLeft, wallMaterial)
        this.doorWallLeftMesh.receiveShadow = true;
        this.doorWallLeftMesh.rotation.y = -Math.PI / 2;
        this.doorWallLeftMesh.position.y = wallHeight / 2;
        this.doorWallLeftMesh.position.x = wallSideWidth / 2;
        this.doorWallLeftMesh.position.z = (wallFrontBackWidth / 2 + (this.doorZ + (this.doorWidth / 2))) / 2

        const doorWallTopHeight = wallHeight - (this.doorY + this.doorHeight / 2)
        this.doorWallTop = new THREE.PlaneGeometry(this.doorWidth, doorWallTopHeight);
        this.doorWallTopMesh = new THREE.Mesh(this.doorWallTop, wallMaterial)
        this.doorWallTopMesh.receiveShadow = true;
        this.doorWallTopMesh.rotation.y = -Math.PI / 2;
        this.doorWallTopMesh.position.x = wallSideWidth / 2;
        this.doorWallTopMesh.position.z = this.doorZ;
        this.doorWallTopMesh.position.y = (wallHeight + (this.doorY + (this.doorHeight / 2))) / 2

        this.doorWallDown = new THREE.PlaneGeometry(this.doorWidth, wallHeight - doorWallTopHeight - this.doorHeight);
        this.doorWallDownMesh = new THREE.Mesh(this.doorWallDown, wallMaterial)
        this.doorWallDownMesh.receiveShadow = true;
        this.doorWallDownMesh.rotation.y = -Math.PI / 2;
        this.doorWallDownMesh.position.x = wallSideWidth / 2;
        this.doorWallDownMesh.position.z = this.doorZ;
        this.doorWallDownMesh.position.y = (this.doorY - this.doorHeight / 2) / 2;

        this.app.scene.add(this.doorWallRightMesh);
        this.app.scene.add(this.doorWallLeftMesh);
        this.app.scene.add(this.doorWallTopMesh);
        this.app.scene.add(this.doorWallDownMesh);
    }

    /**
     * initializes the contents
     */
    init() {

        // create once
        /*
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }*/


        // add a point light on top of the model
        const pointLight = new THREE.PointLight(this.white, 10, 0, 1);
        pointLight.position.set(0, 10, 0);
        this.app.scene.add(pointLight);

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        this.app.scene.add(pointLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x777777, 1);
        this.app.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(this.white, 0.5);
        directionalLight.position.set(0, 1, 0);
        directionalLight.target = this.createHelperObject(0, 6, 0);
        this.app.scene.add(directionalLight);

        // Create a Plane Mesh with basic material
        let floor = new THREE.PlaneGeometry(15, 16);

        let floorTexture = new THREE.TextureLoader().load('textures/floor_texture.jpg');
        let floorUVRate = 15 / 16;
        let textureUVRate = 626 / 417; // image dimensions
        let textureRepeatU = 2;
        let textureRepeatV = textureRepeatU * floorUVRate * textureUVRate;
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(textureRepeatU, textureRepeatV );
        floorTexture.offset = new THREE.Vector2(0,0);

        let floorMaterial = new THREE.MeshPhongMaterial({ color: "#e8d7c8", map: floorTexture });

        let floorMesh = new THREE.Mesh(floor, floorMaterial);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.position.y = 0;
        floorMesh.receiveShadow = true;
        this.app.scene.add(floorMesh);

        // Create a Plane Mesh with basic material
        let ceiling = new THREE.PlaneGeometry(15, 16);
        let ceilingMaterial = new THREE.MeshPhongMaterial({ color: this.bege });
        this.ceilingMesh = new THREE.Mesh(ceiling, ceilingMaterial);
        this.ceilingMesh.rotation.x = Math.PI / 2;
        this.ceilingMesh.position.y = 6;
        this.ceilingMesh.receiveShadow = true;
        this.app.scene.add(this.ceilingMesh);

        this.buildWalls();


        //MESA
        let tableTexture = new THREE.TextureLoader().load('textures/wood_texture.jpg');
        let table = new MyTable(this.app, 3.8, 0.1, 6, 1.2, tableTexture);
        table.buildLegs(0.2, 0.1, 20, this.brown);
        table.position.set(0, 0, 4.8);
        this.app.scene.add(table);


        //CADEIRAS
        const colorDinnerTableChair = this.yellow;
        const widthSeatDinnerTableChair = 1;
        const heightSeatDinnerTableChair = 0.1;
        const depthSeatDinnerTableChair = 0.9;
        const heightDinnerTableChair = 0.7;

        const widthLegDinnerTableChair = 0.1;
        const heightLegDinnerTableChair = 0.7;
        const depthLegDinnerTableChair = 0.1;
        const colorLegDinnerTableChair = this.brown;

        let chair1 = new MyChair(this.app, widthSeatDinnerTableChair, heightSeatDinnerTableChair, depthSeatDinnerTableChair, heightDinnerTableChair, colorDinnerTableChair);
        chair1.buildLegs(widthLegDinnerTableChair, heightLegDinnerTableChair, depthLegDinnerTableChair, colorLegDinnerTableChair);
        chair1.buildBackRest(heightSeatDinnerTableChair, widthSeatDinnerTableChair, depthSeatDinnerTableChair, colorDinnerTableChair);
        chair1.position.set(-1.8, 0, 6)
        this.app.scene.add(chair1);

        let chair2 = new MyChair(this.app, widthSeatDinnerTableChair, heightSeatDinnerTableChair, depthSeatDinnerTableChair, heightDinnerTableChair, colorDinnerTableChair);
        chair2.buildLegs(widthLegDinnerTableChair, heightLegDinnerTableChair, depthLegDinnerTableChair, colorLegDinnerTableChair);
        chair2.buildBackRest(heightSeatDinnerTableChair, widthSeatDinnerTableChair, depthSeatDinnerTableChair, colorDinnerTableChair);
        chair2.position.set(-1.8, 0, 3.6)
        this.app.scene.add(chair2);

        let chair3 = new MyChair(this.app, widthSeatDinnerTableChair, heightSeatDinnerTableChair, depthSeatDinnerTableChair, heightDinnerTableChair, colorDinnerTableChair);
        chair3.buildLegs(widthLegDinnerTableChair, heightLegDinnerTableChair, depthLegDinnerTableChair, colorLegDinnerTableChair);
        chair3.buildBackRest(heightSeatDinnerTableChair, widthSeatDinnerTableChair, depthSeatDinnerTableChair, colorDinnerTableChair);
        chair3.rotation.set(0, Math.PI - 0.5, 0)
        chair3.position.set(2.3, 0, 6)
        this.app.scene.add(chair3);

        let chair4 = new MyChair(this.app, widthSeatDinnerTableChair, heightSeatDinnerTableChair, depthSeatDinnerTableChair, heightDinnerTableChair, colorDinnerTableChair);
        chair4.buildLegs(widthLegDinnerTableChair, heightLegDinnerTableChair, depthLegDinnerTableChair, colorLegDinnerTableChair);
        chair4.buildBackRest(heightSeatDinnerTableChair, widthSeatDinnerTableChair, depthSeatDinnerTableChair, colorDinnerTableChair);
        chair4.rotation.set(0, Math.PI, 0);
        chair4.position.set(1.8, 0, 3.6);
        this.app.scene.add(chair4);


        // PRATO DO BOLO
        let cakePlate = new MyCakePlate(this.app, 0.7, 0.05, 50, this.offWhite, "#c2c2b2")
        cakePlate.position.set(0, 1.7, 4);
        this.app.scene.add(cakePlate)

        // PRATO DA FATIA
        let plateSlice1 = new MyPlate(this.app, 0.52, 0.05, 50, this.offWhite, "#c2c2b2");
        plateSlice1.position.set(1.1, 1.38, 5.8)
        this.app.scene.add(plateSlice1);

        let plateSlice2 = new MyPlate(this.app, 0.52, 0.05, 50, this.offWhite, "#c2c2b2");
        plateSlice2.position.set(-1.1, 1.38, 5.8)
        this.app.scene.add(plateSlice2);


        // BOLO & FATIA
        let fillingTexture = new THREE.TextureLoader().load('textures/cake_slice_texture.png');
        let cake = new MyCake(this.app, 0.6, 0.4, 25, 1, "#E1A693", "#614E3F", fillingTexture);
        cake.buildSlice(-1.3, -0.3, -2); // pos relativa ao bolo
        cake.position.set(0, 1.9, 4);
        cake.rotation.set(0, Math.PI, 0);
        this.app.scene.add(cake);

        // VELAS
        let candle1 = new MyCandle(this.app, 0.03, 0.18, 40, this.orange, this.yellow);
        candle1.position.set(cake.position.x - 0.2, cake.position.y + 0.275, cake.position.z + 0.15);
        this.app.scene.add(candle1);

        let candle2 = new MyCandle(this.app, 0.03, 0.18, 40, this.orange, this.yellow);
        candle2.position.set(cake.position.x + 0.2, cake.position.y + 0.275, cake.position.z + 0.15);
        this.app.scene.add(candle2);

        let candle3 = new MyCandle(this.app, 0.03, 0.18, 40, this.orange, this.yellow);
        candle3.position.set(cake.position.x - 0.2, cake.position.y + 0.275, cake.position.z - 0.3);
        this.app.scene.add(candle3);

        let candle4 = new MyCandle(this.app, 0.03, 0.18, 40, this.orange, this.yellow);
        candle4.rotation.set(0, -Math.PI / 2.8, Math.PI / 2)
        candle4.position.set(cake.position.x + 0.2, 1.76, cake.position.z - 0.3);
        this.app.scene.add(candle4);

        // GARFO
        let fork1 = new MyFork(this.app, 5, 0.8, 0.03, "#9C9C9C");
        this.setScale(fork1, 0.2)
        fork1.position.set(0.95, 1.27, 6.5)
        this.app.scene.add(fork1)

        let fork2 = new MyFork(this.app, 5, 0.8, 0.03, "#9C9C9C");
        fork2.rotation.set(0, Math.PI - Math.PI / 14, 0)
        this.setScale(fork2, 0.2)
        fork2.position.set(-0.95, 1.27, 5.2)
        this.app.scene.add(fork2)

        //LUZ DA MESA (BOLO SPOT LIGHT)
        this.tableLight = new THREE.SpotLight(this.lightColor, 5.5, 5, Math.PI / 3, 1, 0.2);
        this.tableLight.target = cake;

        //CANDEEIRO DE TETO DO BOLO
        let lampTable = new MyLamp(this.app, 0.02, 0.6, 0.4, 1, 40, this.orange, this.lightColor, this.tableLight);
        lampTable.position.set(0, 5.5, 4.8);
        this.app.scene.add(lampTable);

        // MOLDURAS
        let frame1Texture = new THREE.TextureLoader().load('pictures/painting2.jpg');
        let frame1 = new MyFrame(this.app, 1.47, 2.3, 0.08, "#e0ddd3", this.white, frame1Texture)
        frame1.position.set(4, 3.5, this.wallZPos - 0.04)
        frame1.rotation.set(0, Math.PI / 2, 0)
        this.app.scene.add(frame1);

        let frame2Texture = new THREE.TextureLoader().load('pictures/painting1.jpg');
        let frame2 = new MyFrame(this.app, 2.09, 2.1, 0.1, "#e0ddd3", this.white, frame2Texture);
        frame2.position.set(-4, 3.2, this.wallZPos - 0.05)
        frame2.rotation.set(0, Math.PI / 2, 0)
        this.app.scene.add(frame2)

        let frame3Texture = new THREE.TextureLoader().load('pictures/photography1.jpg');
        let frame3 = new MyFrame(this.app, 2.8, 2.05, 0.1, "#e0ddd3", this.white, frame3Texture)
        frame3.position.set(0, 3, -this.wallZPos + 0.05);
        frame3.rotation.set(0, -Math.PI / 2, 0);
        this.app.scene.add(frame3);

        let carFrameTexture = new THREE.TextureLoader().load('textures/white_texture.png');
        let carFrame = new MyFrame(this.app, 2.3, 1.3, 0.1, "#e0ddd3", this.white, carFrameTexture);
        carFrame.position.set(-3.5, 4, -this.wallZPos + 0.05)
        carFrame.rotation.set(0, -Math.PI / 2, 0)
        this.app.scene.add(carFrame);

        let frame4Texture = new THREE.TextureLoader().load('pictures/photography2.jpg');
        let frame4 = new MyFrame(this.app, 1.3, 1.3, 0.1, "#e0ddd3", this.white, frame4Texture)
        frame4.position.set(3.2, 3.4, -this.wallZPos + 0.05);
        frame4.rotation.set(0, -Math.PI / 2, 0);
        this.app.scene.add(frame4);

        // JANELA
        let windowTexture = new THREE.TextureLoader().load('textures/window_texture.jpg');
        let window = new MyWindow(this.app, this.windowWidth, this.windowHeight, 0.3, "#e0ddd3", windowTexture)
        window.bottomDownPart();
        window.rotation.set(0, Math.PI / 2, 0,);
        window.position.set(-7.4, this.windowY, this.windowZ)
        this.app.scene.add(window);

        let windowLight = new THREE.RectAreaLight(0xffffff, 100, this.windowWidth, this.windowHeight);
        this.setScale(windowLight, 2)
        windowLight.position.set(-8.3, this.windowY, this.windowZ)
        windowLight.rotation.set(0, -Math.PI / 2, 0)
        this.app.scene.add(windowLight)

        //TAPETE
        let carpetTexture = new THREE.TextureLoader().load('textures/carpet_texture.png');
        let carpet = new MyCarpet(this.app, 7.5, 0.1, 5, this.lightBlue, carpetTexture);
        carpet.position.set(0, 0.05, -5);
        this.app.scene.add(carpet);

        //ALMOFADAS
        let pillow1Texture = new THREE.TextureLoader().load('textures/pillow3_print.jpg');
        let pillow2Texture = new THREE.TextureLoader().load('textures/pillow1_print.jpg');
        let pillow3Texture = new THREE.TextureLoader().load('textures/pillow4_print.jpg');
        let pillow4Texture = new THREE.TextureLoader().load('textures/pillow2_print.jpg');

        let pillow1 = new MyPillow(this.app, pillow1Texture);
        this.setScale(pillow1, 0.4)
        pillow1.rotation.y = Math.PI/2.5;
        pillow1.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/16)
    
        let pillow2 = new MyPillow(this.app, pillow2Texture);
        this.setScale(pillow2, 0.3)
        pillow2.rotation.y = -Math.PI/2.5;
        pillow2.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI/16)

        let pillow3 = new MyPillow(this.app, pillow3Texture);
        this.setScale(pillow3, 0.3)
        pillow3.rotation.y = Math.PI/1.5;
        pillow3.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/14)

        let pillow4 = new MyPillow(this.app, pillow4Texture);
        this.setScale(pillow4, 0.35)
        pillow4.rotation.y = -Math.PI/2.7;
        pillow4.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI/16)

        //SOFAS
        let sofa1 = new MySofa(this.app, 1, 0.4, 0.1, this.brown);
        sofa1.rotation.set(0, -Math.PI / 3, 0);
        sofa1.setPillow(pillow1, 0.12, 0.75, -0.4);
        sofa1.setPillow(pillow2, 0.1, 0.6, 0.5);
        sofa1.position.set(-2.5, 0, -6.2);
        this.app.scene.add(sofa1);

        let sofa2 = new MySofa(this.app, 1, 0.4, 0.1, this.brown);
        sofa2.rotation.set(0, Math.PI / 4 + Math.PI, 0);
        sofa2.setPillow(pillow3, -0.13, 0.6, -0.3);
        sofa2.setPillow(pillow4, 0.1, 0.7, 0);
        sofa2.position.set(2.3, 0, -6.2);
        this.app.scene.add(sofa2);


        //CANDEEIRO SOFAS
        let spotLightSofas = new THREE.SpotLight(this.lightColor, 8, 5.2, Math.PI / 4, 1, 0.2);
        spotLightSofas.target = carpet;

        let lampSofas = new MyLamp(this.app, 0.02, 0.6, 0.4, 1, 40, this.orange, this.lightColor, spotLightSofas);
        lampSofas.position.set(0, 5.5, -4.8);
        this.app.scene.add(lampSofas);

        //CANDEEIRO CHÃO
        const floorLampX = 4.7;
        const floorLampY = 0;
        const floorLampZ = -6;
        const floorLampHeight = 2.8;

        //luz que ilumina a lâmpada
        let lampHighlight = new THREE.SpotLight(this.lightColor, 20, 6, Math.PI / 40, 2, 0.2);
        lampHighlight.position.set(0, 0, 5);
        //luz que sai do candeeiro
        let lightFloorLamp = new THREE.SpotLight(this.lightColor, 20, 10, Math.PI / 6, 1, 0.8);

        let floorLamp = new MyFloorLamp(this.app, 0.4, 0.3, 0.2, 0.2, floorLampHeight, 40, this.darkBlue, this.darkBlue, this.lightColor, lampHighlight, lightFloorLamp);
        floorLamp.rotation.set(0, -Math.PI / 4, 0);
        floorLamp.position.set(floorLampX, floorLampY, floorLampZ);
        lightFloorLamp.position.set(0, floorLamp.getLightYPos(), - Math.cos(floorLampHeight) + 1);
        this.app.scene.add(floorLamp);

        //MESA DOS SOFÁS
        let coffeeTable = new MyCoffeeTable(this.app, 1, 0.18, 2, this.green);
        coffeeTable.rotation.set(0, Math.PI / 2, 0);
        coffeeTable.position.set(0, 0.05, -4.2);
        coffeeTable.buildBooks(["#E57373", "#FFD700", "#FFA07A", "#85A1CC", "#AED9E0", "#FFB74D"]);
        this.app.scene.add(coffeeTable);

        // GIRA DISCOS 
        let vinylPlayerHolder = new MyVinylPlayerHolder(this.app, 1.8, 1.8, 1.3, this.orange);
        vinylPlayerHolder.buildPlayer(this.green, this.lightBlue);

        let coverColors = ["#00204A", "#A41A1A", "#6B1B7F", "#8B735B", "#000000", "#FF6B35", "#800000", "#007A7C", "#DAA520", "#967BB6", "#228B22", "#00204A", "#FF6B35", "#A41A1A", "#FFD700"]
        vinylPlayerHolder.buildCovers(coverColors)

        const coverTexture = new THREE.TextureLoader().load('textures/cover4.jpg');
        vinylPlayerHolder.buildNowPlayingShelf("#ffffff", coverTexture)
        vinylPlayerHolder.position.set(-6.7, -0.1, -5.5)
        this.app.scene.add(vinylPlayerHolder);

        //LUZES DE PAREDE
        const wallLampX = 0.15 - this.wallXPos;
        const wallLampY = this.wallHeight - this.wallHeight / 2.5;
        const wallLampZ = this.wallZPos / 2;
        const wallLightY = - 0.15;

        //spot lights das luzes de parede
        let lightWallLampFLeft = new THREE.SpotLight(this.lightColor, 6, 12, Math.PI / 4, 1, 0.8);
        lightWallLampFLeft.position.y = wallLightY;
        lightWallLampFLeft.target = this.createHelperObject(wallLampX, this.wallHeight, wallLampZ);

        let lightWallLampFRight = new THREE.SpotLight(this.lightColor, 6, 12, Math.PI / 4, 1, 0.8);
        lightWallLampFRight.position.y = wallLightY;
        lightWallLampFRight.target = this.createHelperObject(wallLampX, this.wallHeight, -wallLampZ);

        let lightWallLampBLeft = new THREE.SpotLight(this.lightColor, 6, 12, Math.PI / 4, 1, 0.8);
        lightWallLampBLeft.position.y = wallLightY;
        lightWallLampBLeft.target = this.createHelperObject(-wallLampX, this.wallHeight, -wallLampZ);

        let lightWallLampBRight = new THREE.SpotLight(this.lightColor, 6, 12, Math.PI / 4, 1, 0.8);
        lightWallLampBRight.position.y = wallLightY;
        lightWallLampBRight.target = this.createHelperObject(-wallLampX, this.wallHeight, wallLampZ);

        let wallLampFLeft = new MyWallLamp(this.app, 0.1, 0.3, 0.3, this.green, lightWallLampFLeft);
        wallLampFLeft.position.set(wallLampX, wallLampY, wallLampZ);

        let wallLampFRight = new MyWallLamp(this.app, 0.1, 0.3, 0.3, this.green, lightWallLampFRight);
        wallLampFRight.position.set(wallLampX, wallLampY, -wallLampZ);

        let wallLampBLeft = new MyWallLamp(this.app, 0.1, 0.3, 0.3, this.green, lightWallLampBLeft);
        wallLampBLeft.rotation.set(0, Math.PI, 0);
        wallLampBLeft.position.set(-wallLampX, wallLampY, -wallLampZ);

        let wallLampBRight = new MyWallLamp(this.app, 0.1, 0.3, 0.3, this.green, lightWallLampBRight);
        wallLampBRight.rotation.set(0, Math.PI, 0);
        wallLampBRight.position.set(-wallLampX, wallLampY, wallLampZ);

        this.app.scene.add(wallLampFLeft);
        this.app.scene.add(wallLampFRight);
        this.app.scene.add(wallLampBLeft);
        this.app.scene.add(wallLampBRight);


        //LUZES DE TETO
        const ceilingLightX = 5;
        const ceilingLightY = this.wallHeight - 0.04;
        const ceilingLightZ = 4;

        //highlight é o que faz parecer que a luz está ligada (aponta para o candeeiro em si)
        let ceilingHighlight1 = new THREE.SpotLight(this.lightColor, 10, 6, Math.PI / 18, 1, 0.8);
        //ceiling light é a luz que sai do candeeiro
        let ceilingLight1 = new THREE.SpotLight(this.lightColor, 15, 10, Math.PI / 3, 1, 0.8);
        ceilingLight1.castShadow = true;
        ceilingLight1.shadow.mapSize.width = this.mapSize;
        ceilingLight1.shadow.mapSize.height = this.mapSize;
        ceilingLight1.shadow.camera.near = 0.5;
        ceilingLight1.shadow.camera.far = 27;
        ceilingLight1.target = this.createHelperObject(-ceilingLightX, 0, ceilingLightZ);
        //criação do próprio candeeiro
        let ceilinglamp1 = new MyCeilingLamp(this.app, 0.1, 0.4, 0.6, this.grey, this.lightColor, ceilingHighlight1, ceilingLight1);
        ceilinglamp1.rotation.set(0, 0, Math.PI / 2);
        ceilingHighlight1.rotation.set(0, 0, Math.PI / 2);
        ceilingHighlight1.position.set(-this.wallHeight + 2, 0, 0);
        ceilinglamp1.position.set(-ceilingLightX, ceilingLightY, ceilingLightZ);
        ceilinglamp1.scale.x = 0.4;
        this.app.scene.add(ceilinglamp1);

        let ceilingHighlight2 = new THREE.SpotLight(this.lightColor, 10, 6, Math.PI / 18, 1, 0.8);
        let ceilingLight2 = new THREE.SpotLight(this.lightColor, 15, 10, Math.PI / 3, 1, 0.8);
        
        ceilingLight2.target = this.createHelperObject(ceilingLightX, 0, ceilingLightZ);
        let ceilinglamp2 = new MyCeilingLamp(this.app, 0.1, 0.4, 0.6, this.grey, this.lightColor, ceilingHighlight2, ceilingLight2);
        ceilinglamp2.rotation.set(0, 0, Math.PI / 2);
        ceilingHighlight2.rotation.set(0, 0, Math.PI / 2);
        ceilingHighlight2.position.set(-this.wallHeight + 2, 0, 0);
        ceilinglamp2.position.set(ceilingLightX, ceilingLightY, ceilingLightZ);
        ceilinglamp2.scale.x = 0.4;
        this.app.scene.add(ceilinglamp2);

        let ceilingHighlight3 = new THREE.SpotLight(this.lightColor, 10, 6, Math.PI / 18, 1, 0.8);
        let ceilingLight3 = new THREE.SpotLight(this.lightColor, 15, 10, Math.PI / 3, 1, 0.8);
        ceilingLight3.castShadow = true;
        ceilingLight3.shadow.mapSize.width = this.mapSize;
        ceilingLight3.shadow.mapSize.height = this.mapSize;
        ceilingLight3.shadow.camera.near = 0.5;
        ceilingLight3.shadow.camera.far = 27;
        ceilingLight3.target = this.createHelperObject(-ceilingLightX, 0, -ceilingLightZ);
        let ceilinglamp3 = new MyCeilingLamp(this.app, 0.1, 0.4, 0.6, this.grey, this.lightColor, ceilingHighlight3, ceilingLight3);
        ceilinglamp3.rotation.set(0, 0, Math.PI / 2);
        ceilingHighlight3.rotation.set(0, 0, Math.PI / 2);
        ceilingHighlight3.position.set(-this.wallHeight + 2, 0, 0);
        ceilinglamp3.position.set(-ceilingLightX, ceilingLightY, -ceilingLightZ);
        ceilinglamp3.scale.x = 0.4;
        this.app.scene.add(ceilinglamp3);

        let ceilingHighlight4 = new THREE.SpotLight(this.lightColor, 10, 6, Math.PI / 18, 1, 0.8);
        let ceilingLight4 = new THREE.SpotLight(this.lightColor, 15, 10, Math.PI / 3, 1, 0.8);
        
        ceilingLight4.target = this.createHelperObject(ceilingLightX, 0, -ceilingLightZ);
        let ceilinglamp4 = new MyCeilingLamp(this.app, 0.1, 0.4, 0.6, this.grey, this.lightColor, ceilingHighlight4, ceilingLight4);
        ceilinglamp4.rotation.set(0, 0, Math.PI / 2);
        ceilingHighlight4.rotation.set(0, 0, Math.PI / 2);
        ceilingHighlight4.position.set(-this.wallHeight + 2, 0, 0);
        ceilinglamp4.position.set(ceilingLightX, ceilingLightY, -ceilingLightZ);
        ceilinglamp4.scale.x = 0.4;
        this.app.scene.add(ceilinglamp4);


        let car = new MyCar(this.app);
        const carGeometry = new THREE.BufferGeometry().setFromPoints([
            ...car.backRoofCurve.getPoints(50),
            ...car.frontRoofCurve.getPoints(50),
            ...car.hoodCurve.getPoints(50),
            ...car.backWheelCurve.getPoints(50),
            ...car.smallBackWheelCurve.getPoints(50),
            ...car.frontWheelCurve.getPoints(50),
            ...car.smallFrontWheelCurve.getPoints(50),
        ]);

        const carMaterial = new THREE.LineBasicMaterial({ color: "#000000" });
        const carMesh = new THREE.Line(carGeometry, carMaterial);
        carMesh.rotation.y = Math.PI / 2;
        carMesh.position.set(0.02, -0.53, 0.75)
        carFrame.addObject(carMesh);
        this.setScale(carFrame, 0.8, 0.8, 0.8);

        let newspaper = new MyNewspaper(this.app, new THREE.TextureLoader().load('textures/newspaper_texture.png'))
        newspaper.position.set(0, 0.9, -4.9);
        newspaper.rotation.set(0, Math.PI / 10, 0);
        this.app.scene.add(newspaper);

        let spiralSpring = new MySpiralSpring(this.app, "#9C9C9C");
        spiralSpring.rotation.set(0, -Math.PI / 6, 0);
        this.setScale(spiralSpring, 0.3, 0.3, 0.3);
        spiralSpring.position.set(-0.4, 0.94, -4.4);
        this.app.scene.add(spiralSpring);

        let vase = new MyVase(this.app, 1.7, 0.3, "#F2F1E5");
        vase.createFlowers("#40874B", "#F3ED52", ["#51385C", "#DA4B0E", "#83BACC"]);
        vase.position.set(-6, 0, 7);
        vase.scale.z = -1;
        vase.rotation.set(0, Math.PI / 2, 0);
        this.app.scene.add(vase);

        let ballon1 = new MyBalloon(this.app, 0.4, 2, "#b0eff7", "#e0ddd3", 1);
        ballon1.position.set(this.wallXPos - 2.5, 5.55, this.wallZPos - 2.5);
        this.app.scene.add(ballon1);

        let ballon2 = new MyBalloon(this.app, 0.4, 2.5, "#8aa168", "#e0ddd3", -1);
        this.setScale(ballon2, 1.2);
        ballon2.position.set(this.wallXPos - 2, 5.45, this.wallZPos - 1.5);
        this.app.scene.add(ballon2);

        let ballon3 = new MyBalloon(this.app, 0.4, 1.6, "#f0d75b", "#e0ddd3", -1);
        this.setScale(ballon3, 0.8);
        ballon3.position.set(this.wallXPos - 1.2, 5.64, this.wallZPos - 2.2);
        this.app.scene.add(ballon3);


        // PORTA
        let door = new MyDoor(this.app, this.doorHeight, this.doorWidth, 0.4, "#FFFFFF", "#000000");
        door.buildDoor(Math.PI/4);
        door.position.set(7.5, this.doorY, this.doorZ);
        door.rotation.set(0, Math.PI, 0);
        this.app.scene.add(door);
    }

    createHelperObject(x, y, z) {
        let obj = new THREE.Object3D();
        obj.position.set(x, y, z);
        this.app.scene.add(obj);
        return obj;
    }

    setScale(object, s) {
        object.scale.x = s;
        object.scale.y = s;
        object.scale.z = s;
    }

    /**
     * updates the x position of the target of the spotlight
     * @param {THREE.Color} value 
     */
    updateSpotLightTargetX(light, value) {
        const targetObject = new THREE.Object3D();
        targetObject.position.x = value;
        targetObject.position.y = light.target.position.y;
        this.app.scene.add(targetObject);
        light.target = targetObject;
    }
    /**
     * updates the y position of the target of the spotlight
     * @param {THREE.Color} value 
     */
    updateSpotLightTargetY(light, value) {
        const targetObject = new THREE.Object3D();
        targetObject.position.y = value;
        targetObject.position.x = light.target.position.x;
        this.app.scene.add(targetObject);
        light.target = targetObject;
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

}

export { MyContents };
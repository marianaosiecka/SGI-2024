import * as THREE from 'three';

import { MyTrack } from "./elements/MyTrack.js";
import { MyRoute } from "./elements/MyRoute.js";
import { MyObstacle } from "./elements/MyObstacle.js";
import { MyPowerUp } from "./elements/MyPowerUp.js";
import { MyVehicle } from "./elements/MyVehicle.js";
import { MyCloud } from './elements/MyCloud.js';

class MyReader{
    constructor(scene, app, startingPoint, segments){
        this.scene = scene;
        this.app = app;
        this.level = null;
        this.startingPoint = startingPoint;
        this.segments = segments;

        this.track = null;

        this.routes = [];
        this.chosenRoute = null;
        this.mixer = null;

        this.obstacles = [];
        this.powerUps = [];
        
        this.playerVehicle = null;
        this.autonomousVehicle = null;
        //default values
        this.readAutonomousVehicle(1, 1, 1, 1);
        this.readPlayerVehicle(1, 1, 1, 1);

        this.appliedModifiers = [];
        this.appliedModifiersStartTime = [];

        this.shortcut = false;
        this.startShortcut = false;
        this.shortcutMixer = null;
        this.shortcutAction = null;
        this.endPosition = null;
    }

    readTrack(layer){
        this.trackWidth = 8;

        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(16, 0, 0),
            new THREE.Vector3(10, 0, -15),
            new THREE.Vector3(5, 0, -20),
            new THREE.Vector3(0, 0, -20.5),
            new THREE.Vector3(-5, 0, -20.5),
            new THREE.Vector3(-10, 0, -20),
            new THREE.Vector3(-15, 0, -15),
            new THREE.Vector3(-20, 0, 4),
            new THREE.Vector3(-30, 0, 8),
            new THREE.Vector3(-38, 0, 4),
            new THREE.Vector3(-45, 0, -15),
            new THREE.Vector3(-50, 0, -20),
            new THREE.Vector3(-55, 0, -20.5),
            new THREE.Vector3(-60, 0, -20.5),
            new THREE.Vector3(-65, 0, -20),
            new THREE.Vector3(-70, 0, -15),
            new THREE.Vector3(-75, 0, -5),
            new THREE.Vector3(-80, 0, 1),
            new THREE.Vector3(-85, 0, 4),
            new THREE.Vector3(-90, 0, 4),
            new THREE.Vector3(-95, 0, 2),
            new THREE.Vector3(-100, 0, -4),
            new THREE.Vector3(-105, 0, -30),
            new THREE.Vector3(-100, 0, -45),
            new THREE.Vector3(-90, 0, -52),
            new THREE.Vector3(-80, 0, -55),
            new THREE.Vector3(30, 0, -55),
            new THREE.Vector3(40, 0, -52),
            new THREE.Vector3(50, 0, -45),
            new THREE.Vector3(50, 0, 10),
            new THREE.Vector3(55, 0, 25),
            new THREE.Vector3(60, 0, 30),
            new THREE.Vector3(65, 0, 35),
            new THREE.Vector3(65.5, 0, 40),
            new THREE.Vector3(65, 0, 45),
            new THREE.Vector3(60, 0, 50),
            new THREE.Vector3(55, 0, 52),
            new THREE.Vector3(50, 0, 53),
            new THREE.Vector3(45, 0, 52),
            new THREE.Vector3(38, 0, 48),
            new THREE.Vector3(35, 0, 45),
            new THREE.Vector3(32, 0, 42),
            new THREE.Vector3(30, 0, 40),
            new THREE.Vector3(20, 0, 12),
            new THREE.Vector3(16, 0, 0)
        ]);


        this.track = new MyTrack(this.app, this.segments, this.trackWidth, path);
        this.track.position.set(-30, 0, 0);
        this.app.scene.add(this.track);
    }

    setFinishLine() {
        let pillarGeo = new THREE.CylinderGeometry( 0.3, 0.3, 14.2, 32 );
        let pillarMat = new THREE.MeshPhongMaterial( {color: "#000000", shininess: 5} );
        
        let pillarRight = new THREE.Mesh( pillarGeo, pillarMat );
        pillarRight.position.set(this.startingPoint.x, this.startingPoint.y + 6.15, this.startingPoint.z - this.trackWidth*1.25);
        
        let pillarLeft = new THREE.Mesh( pillarGeo, pillarMat );
        pillarLeft.position.set(this.startingPoint.x, this.startingPoint.y + 6.15, this.startingPoint.z + this.trackWidth*2.05);
        
        let panelGeo = new THREE.BoxGeometry(0.4, 3.5 ,this.trackWidth*3.25);
        let texture = new THREE.TextureLoader().load("textures/checkers.jpg")
        texture.repeat.set(2, 0.5)
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        let panelMat = new THREE.MeshPhongMaterial( {map:texture} );
        let panel = new THREE.Mesh( panelGeo, panelMat );
        panel.position.set(this.startingPoint.x, this.startingPoint.y + 11.5, this.startingPoint.z + this.trackWidth/2.5);
        
        this.app.scene.add(pillarRight);
        this.app.scene.add(pillarLeft);
        this.app.scene.add(panel);
    }

    readRoutes(layer, visualRepresentation = false){
        let startingPointRoute = new THREE.Vector3(this.startingPoint.x, this.startingPoint.y, this.startingPoint.z);
        // LEVEL 1
        this.keyPoints1 = [
            startingPointRoute,
            new THREE.Vector3(15, 2, -117),
            new THREE.Vector3(-51, 2, -115),
            new THREE.Vector3(-105, 2, -112),
            new THREE.Vector3(-128, 2, -108),
            new THREE.Vector3(-140, 2, -105),
            new THREE.Vector3(-151, 2, -98),
            new THREE.Vector3(-160, 2, -85),
            new THREE.Vector3(-160, 2, -60),
            new THREE.Vector3(-157, 2, -35),
            new THREE.Vector3(-153, 2, 5),
            new THREE.Vector3(-153, 2, 35),
            new THREE.Vector3(-165, 2, 50),
            new THREE.Vector3(-177, 2, 60),
            new THREE.Vector3(-191, 2, 70),
            new THREE.Vector3(-194, 2, 78),
            new THREE.Vector3(-194, 2, 85),
            new THREE.Vector3(-189, 2, 89),
            new THREE.Vector3(-180, 2, 95),
            new THREE.Vector3(-168, 2, 100),
            new THREE.Vector3(-157.5, 2, 102),
            new THREE.Vector3(-147, 2, 102),
            new THREE.Vector3(-135, 2, 100),
            new THREE.Vector3(-120, 2, 90),
            new THREE.Vector3(-112, 2, 80),
            new THREE.Vector3(-105, 2, 70),
            new THREE.Vector3(-98, 2, 60),
            new THREE.Vector3(-90, 2, 50),
            new THREE.Vector3(-80, 2, 30),
            new THREE.Vector3(-70, 2, 10),
            new THREE.Vector3(-65, 2, -5),
            new THREE.Vector3(-50, 2, -30),
            new THREE.Vector3(-32, 2, -40),
            new THREE.Vector3(-10, 2, -40),
            new THREE.Vector3(0, 2, -37),
            new THREE.Vector3(8, 2, -28),
            new THREE.Vector3(15, 2, -20),
            new THREE.Vector3(18, 2, -12),
            new THREE.Vector3(25, 2, 0),
            new THREE.Vector3(35, 2, 8),
            new THREE.Vector3(45, 2, 12),
            new THREE.Vector3(55, 2, 10),
            new THREE.Vector3(65, 2, 0),
            new THREE.Vector3(72, 2, -15),
            new THREE.Vector3(78, 2, -25),
            new THREE.Vector3(85, 2, -30),
            new THREE.Vector3(95, 2, -35),
            new THREE.Vector3(105, 2, -38),
            new THREE.Vector3(115, 2, -38),
            new THREE.Vector3(125, 2, -37),
            new THREE.Vector3(140, 2, -25),
            new THREE.Vector3(150, 2, -10),
            new THREE.Vector3(165, 2, 2),
            new THREE.Vector3(175, 2, 5),
            new THREE.Vector3(185, 2, 6),
            new THREE.Vector3(200, 2, 0),
            new THREE.Vector3(210, 2, -10),
            new THREE.Vector3(215, 2, -18),
            new THREE.Vector3(220, 2, -28),
            new THREE.Vector3(226, 2, -55),
            new THREE.Vector3(225, 2, -70),
            new THREE.Vector3(215, 2, -90),
            new THREE.Vector3(198, 2, -102),
            new THREE.Vector3(160, 2, -112),
            new THREE.Vector3(115, 2, -114),
            new THREE.Vector3(80, 2, -114),
            startingPointRoute
        ];        
      
        const timeInterval1 = 1;
        const offsetPos = new THREE.Vector3(0, 0, 0);
        const offsetRot = 0;

        const route1 = new MyRoute(this.app, this.keyPoints1, timeInterval1, this.autonomousVehicle, offsetPos, offsetRot, visualRepresentation);
        this.routes.push(route1);


        // LEVEL 2
        //...

        this.chosenRoute = this.routes[this.level-1];
        this.mixer = this.chosenRoute.mixer;
        this.app.scene.add(this.chosenRoute);
    }

    readObstacles(layer){
        // TYPE: SWITCH
        const obstacleTexture1 = new THREE.TextureLoader().load("textures/obstacle_switchdirections.png");
        const obstaclesType1 = [ 
            [new THREE.Vector3(-150, 2, -20), new THREE.Vector3(0, Math.PI / 2, 0)],
        ];
    
        for (let i = 0; i < obstaclesType1.length; i++) {
            const obstacle = new MyObstacle(this.app, "switch", obstacleTexture1, 0);
            obstacle.position.set(...obstaclesType1[i][0]);
            obstacle.rotation.set(...obstaclesType1[i][1]);

            obstacle.setBoundingBox();

            this.obstacles.push(obstacle);
            this.app.scene.add(obstacle);
        }

    
        // TYPE: SLIP
        const obstacleTexture2 = new THREE.TextureLoader().load("textures/obstacle_slip.png");
        const obstaclesType2 = [
            [new THREE.Vector3(0, 2, -42), new THREE.Vector3(0, -Math.PI, 0)],
        ];
    
        for (let i = 0; i < obstaclesType2.length; i++) {
            const obstacle = new MyObstacle(this.app, "slip", obstacleTexture2, Math.PI/2);
            obstacle.position.set(...obstaclesType2[i][0]);
            obstacle.rotation.set(...obstaclesType2[i][1]);

            obstacle.setBoundingBox();

            this.obstacles.push(obstacle);
            this.app.scene.add(obstacle);
        }
    }

    pickPointFromRoute() {
        const lastIndex = this.keyPoints1.length - 1;
        const lastQuarterStartIndex = Math.floor(3 * lastIndex / 4);
        const randomIndex = Math.floor(Math.random() * (lastIndex - lastQuarterStartIndex + 1) + lastQuarterStartIndex);
        return this.keyPoints1[randomIndex]
    }

    readPowerUps(layer){
        // TYPE: SHIELD
        const powerUpTexture1 = new THREE.TextureLoader().load("textures/shield_powerup.png");
        const powerUpType1 = [ 
            [new THREE.Vector3(-85, 2, 20), new THREE.Vector3(0, -Math.PI / 2 - 0.3, 0)],
        ];

        for (let i = 0; i < powerUpType1.length; i++) {
            const powerUp = new MyPowerUp(this.app, "shield", powerUpTexture1);
            powerUp.position.set(...powerUpType1[i][0]);
            powerUp.rotation.set(...powerUpType1[i][1]);

            powerUp.setBoundingBox();

            this.powerUps.push(powerUp);
            this.app.scene.add(powerUp);
        }

        // TYPE: SHORTCUT
        const powerUpTexture2 = new THREE.TextureLoader().load("textures/shortcut_powerup.png");
        const powerUpType2 = [
            [new THREE.Vector3(82, 2, -20), new THREE.Vector3(0, -Math.PI / 2 - 0.2, 0)],
        ];

        for (let i = 0; i < powerUpType2.length; i++) {
            const powerUp = new MyPowerUp(this.app, "shortcut", powerUpTexture2);
            powerUp.position.set(...powerUpType2[i][0]);
            powerUp.rotation.set(...powerUpType2[i][1]);

            powerUp.setBoundingBox();

            this.powerUps.push(powerUp);
            this.app.scene.add(powerUp);
        }

        // TYPE: SPEED
        const powerUpTexture3 = new THREE.TextureLoader().load("textures/speed_powerup.png");
        const powerUpType3 = [
            [new THREE.Vector3(220, 2, -90), new THREE.Vector3(0, -Math.PI / 2, 0)],
        ];

        for (let i = 0; i < powerUpType3.length; i++) {
            const powerUp = new MyPowerUp(this.app, "speed", powerUpTexture3);
            powerUp.position.set(...powerUpType3[i][0]);
            powerUp.rotation.set(...powerUpType3[i][1]);

            powerUp.setBoundingBox();

            this.powerUps.push(powerUp);
            this.app.scene.add(powerUp);
        }
    }

    readAutonomousVehicle(wheelsRatio, width, height, depth){
        this.autonomousVehicle = new MyVehicle(this.scene, wheelsRatio, width, height, depth, 10, [this.startingPoint.x, this.startingPoint.y, this.startingPoint.z]);
    }

    readPlayerVehicle(wheelsRatio, width, height, depth){
        this.playerVehicle = new MyVehicle(this.scene, wheelsRatio, width, height, depth, 10, [this.startingPoint.x, this.startingPoint.y, this.startingPoint.z + 10])
    }

    checkForCollisions() {
        // if the player has the shield modifier, he can't collide with anything
        if(this.playerVehicle.shield)
            return;

        this.powerUps.forEach(powerUp => {
            if(this.playerVehicle.detectCollisionsBox(powerUp.bb)){
                console.log("colidiu power up", powerUp.type);
                powerUp.applyModifier(this.playerVehicle);
                if(powerUp.type == "shortcut"){
                    this.shortcut = true;
                    if(!this.startShortcut){
                        this.startShortcut = true;
                        this.shortcutMixer = this.shortcutAnimation();
                    }
                }
                else{
                    this.shortcut = false;
                    this.appliedModifiers.push(powerUp);
                    this.appliedModifiersStartTime.push(Date.now());
                }
            }
        });
        this.obstacles.forEach(obstacle => {
            if(this.playerVehicle.detectCollisionsBox(obstacle.bb)){
                console.log("colidiu obstaculo")
                obstacle.applyModifier(this.playerVehicle);
                this.appliedModifiers.push(obstacle);
                this.appliedModifiersStartTime.push(Date.now());
            }
        });
        if(this.playerVehicle.detectCollisionsVehicles(this.autonomousVehicle)){
            console.log("colidiu carro")   
            this.playerVehicle.collidedCar = true;
            if(!this.playerVehicle.collidedCarStarted){
                this.playerVehicle.velocity *= 0.3;
                this.playerVehicle.collidedCarStarted = true;
            }
            this.appliedModifiers.push(this.autonomousVehicle);
            this.appliedModifiersStartTime.push(Date.now());
        }
        else{
            this.playerVehicle.collidedCar = false;
            this.playerVehicle.collidedCarStarted = false;
        }

        if(this.playerVehicle.detectOutOfTrack(this.track)){
            console.log("saiu track")
            this.playerVehicle.outOfTrack = true;
        }
        else
            this.playerVehicle.outOfTrack = false;
    }

    shortcutAnimation(){
        const startPosition = this.playerVehicle.position.clone();
        this.endPosition = this.pickPointFromRoute().clone();
        const mixer = new THREE.AnimationMixer(this.playerVehicle);

        const positionTrack = new THREE.VectorKeyframeTrack('.position', [0, 3], [startPosition.x, startPosition.y, startPosition.z, this.endPosition.x, this.endPosition.y, this.endPosition.z]);

        const positionClip = new THREE.AnimationClip('ShortCutAnimation', 3, [positionTrack]);

        const positionAction = mixer.clipAction(positionClip);
        positionAction.play();

        this.shortcutAction = positionAction;

        this.cloud = new MyCloud(this.app, this.playerVehicle.position.clone().add(new THREE.Vector3(0, -1, 0)));
        this.app.scene.add(this.cloud);

        return mixer;
    }

    stopShortcutAnimation() {
        let position = this.endPosition.clone();
        position.y = this.endPosition.y + 0.95;
        this.playerVehicle.setPos(this.endPosition);
        this.startShortcut = false;
        this.shortcut = false;
        if (this.shortcutMixer) {
            this.app.scene.remove(this.cloud);
        }
    }

    stopModifier(modifier){
        modifier.stopModifier(this.playerVehicle);
        const index = this.appliedModifiers.indexOf(modifier);
        this.appliedModifiers.splice(index, 1);
        this.appliedModifiersStartTime.splice(index, 1);
    }

    isAppliedModifier(modifierType){
        for (let i = 0; i < this.appliedModifiers.length; i++) {
            if(this.appliedModifiers[i].type == modifierType)
                return true;
        }
        return false;
    }
        

}

export { MyReader };
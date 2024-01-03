import * as THREE from 'three';

import { MyTrack } from "./elements/MyTrack.js";
import { MyRoute } from "./elements/MyRoute.js";
import { MyObstacle } from "./elements/MyObstacle.js";
import { MyPowerUp } from "./elements/MyPowerUp.js";
import { MyVehicle } from "./elements/MyVehicle.js";
import { MyCloud } from './scenario/MyCloud.js';

class MyReader{
    constructor(scene, app, startingPoint){
        this.scene = scene;
        this.app = app;
        this.level = null;
        this.startingPoint = startingPoint;

        this.track = null;
        this.checkKeyLines = [];
        
        this.routes = [];
        this.chosenRoute = null;
        this.mixer = null;

        this.obstacles = [];
        this.powerUps = [];
        
        this.playerVehicle = null;
        this.playerCheckLineIdx = 0;
        this.caughtShortcut = false;

        this.autonomousVehicle = null;
        this.autonomousCheckLineIdx = 0;

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
        this.pickAlreadyApplied = false;
    }

    
    readTrack(layer, segments){
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

        this.track = new MyTrack(this.app, segments, this.trackWidth, path, layer);
        this.track.position.set(-30, 0, 0);
        this.app.scene.add(this.track);
    }

    setFinishLine() {
        this.finishLineGroup = new THREE.Group();
        let pillarGeo = new THREE.CylinderGeometry( 0.3, 0.3, 16.2, 32 );
        let pillarMat = new THREE.MeshPhongMaterial( {color: "#000000", shininess: 5} );
        
        let pillarRight = new THREE.Mesh( pillarGeo, pillarMat );
        pillarRight.position.set(this.startingPoint.x - 10, this.startingPoint.y + 7.15, this.startingPoint.z - this.trackWidth*1.25);
        
        let pillarLeft = new THREE.Mesh( pillarGeo, pillarMat );
        pillarLeft.position.set(this.startingPoint.x - 10, this.startingPoint.y + 7.15, this.startingPoint.z + this.trackWidth*2.05);
        
        let panelGeo = new THREE.BoxGeometry(0.4, 3.5 ,this.trackWidth*3.25);
        let texture1 = new THREE.TextureLoader().load("textures/checkers.jpg")
        texture1.repeat.set(2, 0.5)
        texture1.wrapS = THREE.RepeatWrapping;
        texture1.wrapT = THREE.RepeatWrapping;
        let panelMat = new THREE.MeshPhongMaterial( {map:texture1} );
        let panel = new THREE.Mesh( panelGeo, panelMat );
        panel.position.set(this.startingPoint.x - 10, this.startingPoint.y + 13.5, this.startingPoint.z + this.trackWidth/2.5);
        
        let texture2 = new THREE.TextureLoader().load("textures/checkers.jpg")
        texture2.repeat.set(0.17, 2)
        texture2.wrapS = THREE.RepeatWrapping;
        texture2.wrapT = THREE.RepeatWrapping;
        let lineMat = new THREE.MeshPhongMaterial( {map:texture2} );

        let finishingLineGeo = new THREE.BoxGeometry(1.2, 0.05, this.trackWidth*3.25)
        this.finishingLine = new THREE.Mesh( finishingLineGeo, lineMat );
        this.finishingLine.position.set(this.startingPoint.x - 10, this.startingPoint.y-0.75, this.startingPoint.z + this.trackWidth/2.5);

        this.finishLineGroup.add(pillarRight);
        this.finishLineGroup.add(pillarLeft);
        this.finishLineGroup.add(panel);
        this.finishLineGroup.add(this.finishingLine);
        this.app.scene.add(this.finishLineGroup);
    }

    readRoutes(vehicleDepth, visualRepresentation = false){
        let startingPointRoute = new THREE.Vector3(this.startingPoint.x - vehicleDepth/2, this.startingPoint.y, this.startingPoint.z);
        // LEVEL 1
        this.keyPoints1 = [
            startingPointRoute,
            new THREE.Vector3(-51, 1.7, -115),
            new THREE.Vector3(-105, 1.7, -112),
            new THREE.Vector3(-128, 1.7, -108),
            new THREE.Vector3(-151, 1.7, -98),
            new THREE.Vector3(-160, 1.7, -85),
            new THREE.Vector3(-160, 1.7, -60),
            new THREE.Vector3(-157, 1.7, -35),
            new THREE.Vector3(-153, 1.7, 5),
            new THREE.Vector3(-156, 1.7, 35),
            new THREE.Vector3(-165, 1.7, 50),
            new THREE.Vector3(-177, 1.7, 60),
            new THREE.Vector3(-190, 1.7, 75),
            new THREE.Vector3(-180, 1.7, 98),
            new THREE.Vector3(-147, 1.7, 102),
            new THREE.Vector3(-125, 1.7, 90),
            new THREE.Vector3(-112, 1.7, 80),
            new THREE.Vector3(-98, 1.7, 60),
            new THREE.Vector3(-80, 1.7, 30),
            new THREE.Vector3(-65, 1.7, -5),
            new THREE.Vector3(-50, 1.7, -30),
            new THREE.Vector3(-32, 1.7, -40),
            new THREE.Vector3(-10, 1.7, -40),
            new THREE.Vector3(8, 1.7, -28),
            new THREE.Vector3(18, 1.7, -12),
            new THREE.Vector3(25, 1.7, 10),
            new THREE.Vector3(55, 1.7, 10),
            new THREE.Vector3(65, 1.7, 0),
            new THREE.Vector3(72, 1.7, -15),
            new THREE.Vector3(85, 1.7, -30),
            new THREE.Vector3(95, 1.7, -35),
            new THREE.Vector3(125, 1.7, -37),
            new THREE.Vector3(140, 1.7, -25),
            new THREE.Vector3(150, 1.7, -10),
            new THREE.Vector3(165, 1.7, 2),
            new THREE.Vector3(185, 1.7, 6),
            new THREE.Vector3(200, 1.7, 0),
            new THREE.Vector3(220, 1.7, -28),
            new THREE.Vector3(225, 1.7, -70),
            new THREE.Vector3(215, 1.7, -90),
            new THREE.Vector3(198, 1.7, -102),
            new THREE.Vector3(160, 1.7, -112),
            startingPointRoute
        ];        
    
        // LEVEL 1
        const timeInterval1 = 1.5;
        const offsetPos = new THREE.Vector3(vehicleDepth/2, 0, 0);
        const offsetRot = 0;

        const route1 = new MyRoute(this.app, this.keyPoints1, timeInterval1, this.autonomousVehicle, offsetPos, offsetRot, visualRepresentation);
        this.routes.push(route1);


        // LEVEL 2
        const timeInterval2 = 1;
        const route2 = new MyRoute(this.app, this.keyPoints1, timeInterval2, this.autonomousVehicle, offsetPos, offsetRot, visualRepresentation);
        this.routes.push(route2);

        // LEVEL 3
        const timeInterval3 = 0.5;
        const route3 = new MyRoute(this.app, this.keyPoints1, timeInterval3, this.autonomousVehicle, offsetPos, offsetRot, visualRepresentation);
        this.routes.push(route3);

        this.chosenRoute = this.routes[this.level-1];
        this.mixer = this.chosenRoute.mixer;
        this.app.scene.add(this.chosenRoute);

        this.setCheckKeyPoints(12);
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
            [new THREE.Vector3(0, 2, -42), new THREE.Vector3(0, 0, 0)],
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

    setCheckKeyPoints(numKeyPoints) {
        let checkKeyPoints = [];
        let checkKeyRotations = [];	
        const numPoints = this.keyPoints1.length;
        const offset = Math.floor(numPoints / numKeyPoints);

        for (let i = 0; i < numKeyPoints; i++) {
            const index = (i * offset) % numPoints;
            if(i===0)
                continue;
            checkKeyPoints.push(this.keyPoints1[index]);
            checkKeyRotations.push(this.chosenRoute.q_list[index]);
        }

        checkKeyPoints.forEach((point, index) => {
        let checkLineGeo = new THREE.BoxGeometry(1.2, 0.05, this.trackWidth * 4.5);
        let checkLine = new THREE.Mesh(checkLineGeo, new THREE.MeshBasicMaterial());

        checkLine.quaternion.copy(checkKeyRotations[index]);
        checkLine.position.set(point.x, point.y-0.75, point.z);
        
        checkLine.visible = false;
        this.checkKeyLines.push(checkLine);
        this.app.scene.add(checkLine)
        });
    }

    readPowerUps(layer){
        // TYPE: SHIELD
        const powerUpTexture1 = new THREE.TextureLoader().load("textures/shield_powerup.png");
        const powerUpType1 = [ 
            [new THREE.Vector3(-85, 2, 20), new THREE.Vector3(0, -Math.PI / 2 - 0.3, 0)],
        ];

        for (let i = 0; i < powerUpType1.length; i++) {
            const powerUp = new MyPowerUp(this.app, "shield", powerUpTexture1, Math.PI/2);
            powerUp.position.set(...powerUpType1[i][0]);
            powerUp.rotation.set(...powerUpType1[i][1]);

            powerUp.setBoundingBox();

            this.powerUps.push(powerUp);
            this.app.scene.add(powerUp);
        }

        // TYPE: SHORTCUT
        const powerUpTexture2 = new THREE.TextureLoader().load("textures/cloud.png");
        const powerUpType2 = [
            [new THREE.Vector3(82, 2, -20), new THREE.Vector3(0, -Math.PI / 2 - 0.2, 0)],
        ];

        for (let i = 0; i < powerUpType2.length; i++) {
            const powerUp = new MyPowerUp(this.app, "shortcut", powerUpTexture2, Math.PI/2);
            powerUp.scale.set(1.1, 1.1, 1.1);
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
            const powerUp = new MyPowerUp(this.app, "speed", powerUpTexture3, Math.PI/2);
            powerUp.position.set(...powerUpType3[i][0]);
            powerUp.rotation.set(...powerUpType3[i][1]);

            powerUp.setBoundingBox();

            this.powerUps.push(powerUp);
            this.app.scene.add(powerUp);
        }

        // TYPE: PICK POWER UP
        const powerUpTexture4 = new THREE.TextureLoader().load("textures/pickObstacle_powerup.png");
        const powerUpType4 = [
            [new THREE.Vector3(-131, 2, -95), new THREE.Vector3(0, -Math.PI / 2, 0)],
        ];

        for (let i = 0; i < powerUpType4.length; i++) {
            const powerUp = new MyPowerUp(this.app, "pick", powerUpTexture4, 0);
            powerUp.position.set(...powerUpType4[i][0]);
            powerUp.rotation.set(...powerUpType4[i][1]);

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

    checkForCollisions(obstacles) {
        this.powerUps.forEach(powerUp => {
            if(this.playerVehicle.detectCollisionsBox(powerUp.bb)){
                console.log("colidiu power up", powerUp.type);
                if(powerUp.type !== "pick"){
                    powerUp.applyModifier(this.playerVehicle, obstacles, this.track);
                    if(this.pickAlreadyApplied){
                        this.pickAlreadyApplied = false;
                    }
                }
                else if (!this.pickAlreadyApplied) {
                    powerUp.applyModifier(this.playerVehicle, obstacles, this.track);
                    this.pickAlreadyApplied = true;
                } 
                if(powerUp.type == "shortcut"){
                    this.shortcut = true;
                    this.caughtShortcut = true;
                    if(!this.startShortcut){
                        this.startShortcut = true;
                        this.shortcutMixer = this.shortcutAnimation();
                    }
                }
                else
                    this.shortcut = false;
                
                if(!this.appliedModifiers.includes(powerUp)){
                    this.appliedModifiers.push(powerUp);
                    this.appliedModifiersStartTime.push(Date.now());
                }
            }
        });


        // check if the player has collided with the check lines
        if(this.playerCheckLineIdx < this.checkKeyLines.length){
            if(this.playerVehicle.detectCollisionsObject(this.checkKeyLines[this.playerCheckLineIdx], false)){
                console.log("player colidiu check line", this.playerCheckLineIdx+1)
                this.playerCheckLineIdx = (this.playerCheckLineIdx + 1);
            }
        }

        // check if the autonomous has collided with the check lines
        if(this.autonomousCheckLineIdx < this.checkKeyLines.length){
            if(this.autonomousVehicle.detectCollisionsObject(this.checkKeyLines[this.autonomousCheckLineIdx], false)){
                console.log("autonomo colidiu check line", this.autonomousCheckLineIdx+1)
                this.autonomousCheckLineIdx = (this.autonomousCheckLineIdx + 1);
            }
        }

        // if the player has the shield modifier, he can't collide with anything
        if(!this.playerVehicle.shield){
            this.obstacles.forEach(obstacle => {
                if(this.playerVehicle.detectCollisionsBox(obstacle.bb)){
                    console.log("colidiu obstaculo")
                    obstacle.applyModifier(this.playerVehicle);
                    if(!this.appliedModifiers.includes(obstacle)){
                        this.appliedModifiers.push(obstacle);
                        this.appliedModifiersStartTime.push(Date.now());
                    }
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
        }

        // check if the player has got out of the track
        if(!this.shortcut){
            if(this.playerVehicle.detectCollisionsObject(this.track, true)){
                console.log("saiu track")
                this.playerVehicle.outOfTrack = true;
                if(!this.playerVehicle.outOfTrackStarted){
                    this.playerVehicle.velocity *= 0.4;
                    this.playerVehicle.maxVelocity *= 0.4;
                    this.playerVehicle.outOfTrackStarted = true;
                }
            }
            else{
                this.playerVehicle.outOfTrack = false;
                if(this.playerVehicle.outOfTrackStarted){
                    this.playerVehicle.maxVelocity /= 0.4;
                    this.playerVehicle.outOfTrackStarted = false;
                }
            }
        }
    }

    shortcutAnimation(){
        const startPosition = this.playerVehicle.position.clone();

        // point from the last quarter of the route
        this.endPosition = this.pickPointFromRoute().clone();
        
        const midPoint = new THREE.Vector3(
            (startPosition.x + this.endPosition.x) / 2,
            (startPosition.y + this.endPosition.y) / 2 + 10,
            (startPosition.z + this.endPosition.z) / 2
        );
        let points = [startPosition, midPoint, this.endPosition];
        
        const mixer = new THREE.AnimationMixer(this.playerVehicle);

        let positionTrack = new THREE.VectorKeyframeTrack('.position', [0, 1.5, 2.5],
            points.map(p => [p.x, p.y, p.z, 0]).flat(),
            THREE.InterpolateSmooth
            );

        const positionClip = new THREE.AnimationClip('ShortCutAnimation', 2.5, [positionTrack]);

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
        this.app.scene.remove(this.cloud);
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
        
    updateModifiers(time){
        this.powerUps.forEach(powerUp => {
            powerUp.shader.uniforms.time.value = time;
        });

        this.obstacles.forEach(obstacle => {
            obstacle.shader.uniforms.time.value = time;
        });
    }

    removeShortcut(){
        this.appliedModifiers.forEach(modifier => {
            if(modifier.type == "shortcut"){
                this.stopModifier(modifier);
            }
        });
    }
}

export { MyReader };
import * as THREE from 'three';

import { MyTrack } from "./elements/MyTrack.js";
import { MyRoute } from "./elements/MyRoute.js";
import { MyObstacle } from "./elements/MyObstacle.js";
import { MyPowerUp } from "./elements/MyPowerUp.js";
import { MyVehicle } from "./elements/MyVehicle.js";
import { MyCloud } from './elements/MyCloud.js';

class MyReader{
    constructor(scene, app, level, startingPoint, segments){
        this.scene = scene;
        this.app = app;
        this.level = level;
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
        this.readAutonomousVehicle();
        this.readPlayerVehicle();

        this.appliedModifiers = [];
        this.appliedModifiersStartTime = [];

        this.shortcut = false;
        this.startShortcut = false;
        this.shortcutMixer = null;
        this.shortcutAction = null;
        this.endPosition = null;
    }

    readTrack(){
        this.trackWidth = 7;

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
        //this.track.layers.enable(layer);
        this.app.scene.add(this.track);
    }

    readRoutes(visualRepresentation){
        let startingPointRoute = new THREE.Vector3(this.startingPoint.x, this.startingPoint.y + 0.75, this.startingPoint.z);
        // LEVEL 1
        this.keyPoints1 = [
            startingPointRoute,
            new THREE.Vector3(10, 2, -117),
            new THREE.Vector3(-34, 2, -115),
            new THREE.Vector3(-70, 2, -112),
            new THREE.Vector3(-85, 2, -105),
            new THREE.Vector3(-90, 2, -98),
            new THREE.Vector3(-95, 2, -90),
            new THREE.Vector3(-100, 2, -80),
            new THREE.Vector3(-105, 2, -60),
            new THREE.Vector3(-102, 2, -35),
            new THREE.Vector3(-100, 2, 5),
            new THREE.Vector3(-102, 2, 35),
            new THREE.Vector3(-110, 2, 50),
            new THREE.Vector3(-118, 2, 60),
            new THREE.Vector3(-127, 2, 70),
            new THREE.Vector3(-129, 2, 78),
            new THREE.Vector3(-129, 2, 85),
            new THREE.Vector3(-126, 2, 89),
            new THREE.Vector3(-120, 2, 95),
            new THREE.Vector3(-112, 2, 100),
            new THREE.Vector3(-105, 2, 102),
            new THREE.Vector3(-98, 2, 102),
            new THREE.Vector3(-90, 2, 100),
            new THREE.Vector3(-80, 2, 95),
            new THREE.Vector3(-70, 2, 87),
            new THREE.Vector3(-60, 2, 75),
            new THREE.Vector3(-50, 2, 45),
            new THREE.Vector3(-32, 2, -10),
            new THREE.Vector3(-10, 2, -37),
            new THREE.Vector3(10, 2, -38),
            new THREE.Vector3(20, 2, -35),
            new THREE.Vector3(30, 2, -25),
            new THREE.Vector3(35, 2, -15),
            new THREE.Vector3(40, 2, 0),
            new THREE.Vector3(45, 2, 8),
            new THREE.Vector3(53, 2, 12),
            new THREE.Vector3(60, 2, 12),
            new THREE.Vector3(65, 2, 10),
            new THREE.Vector3(72, 2, 8),
            new THREE.Vector3(80, 2, 0),
            new THREE.Vector3(85, 2, -20),
            new THREE.Vector3(95, 2, -35),
            new THREE.Vector3(105, 2, -38),
            new THREE.Vector3(115, 2, -38),
            new THREE.Vector3(125, 2, -37),
            new THREE.Vector3(140, 2, -25),
            new THREE.Vector3(150, 2, -10),
            new THREE.Vector3(165, 2, 2),
            new THREE.Vector3(175, 2, 5),
            new THREE.Vector3(185, 2, 3),
            new THREE.Vector3(195, 2, -5),
            new THREE.Vector3(203, 2, -30),
            new THREE.Vector3(206, 2, -55),
            new THREE.Vector3(205, 2, -70),
            new THREE.Vector3(200, 2, -85),
            new THREE.Vector3(180, 2, -100),
            new THREE.Vector3(150, 2, -107),
            new THREE.Vector3(115, 2, -110),
            new THREE.Vector3(80, 2, -113),
            startingPointRoute
        ];
      
        const timeInterval1 = 1;
      
        const route1 = new MyRoute(this.app, this.keyPoints1, timeInterval1, this.autonomousVehicle, visualRepresentation);
        this.routes.push(route1);


        // LEVEL 2
        //...

        this.chosenRoute = this.routes[this.level-1];
        this.mixer = this.chosenRoute.mixer;
        this.app.scene.add(this.chosenRoute);
    }

    readObstacles(){
        // TYPE: SWITCH
        const obstacleTexture1 = new THREE.TextureLoader().load("textures/obstacle_switchdirections.png");
        const obstacleColor1 = 0xD71D03;
        const obstaclesType1 = [ 
            [new THREE.Vector3(-97, 1.25, -20), new THREE.Vector3(0, Math.PI / 2, 0)],
        ];
    
        for (let i = 0; i < obstaclesType1.length; i++) {
            const obstacle = new MyObstacle(this.app, "switch", obstacleTexture1, obstacleColor1);
            obstacle.position.set(...obstaclesType1[i][0]);
            obstacle.rotation.set(...obstaclesType1[i][1]);

            obstacle.setBoundingSphere();

            this.obstacles.push(obstacle);
            this.app.scene.add(obstacle);
        }

    
        // TYPE: SLIP
        const obstacleTexture2 = new THREE.TextureLoader().load("textures/obstacle_slip.png");
        const obstacleColor2 = 0xD71D03;
        const obstaclesType2 = [
            [new THREE.Vector3(0, 1.25, -44), new THREE.Vector3(0, -Math.PI, 0)],
        ];
    
        for (let i = 0; i < obstaclesType2.length; i++) {
            const obstacle = new MyObstacle(this.app, "slip", obstacleTexture2, obstacleColor2);
            obstacle.position.set(...obstaclesType2[i][0]);
            obstacle.rotation.set(...obstaclesType2[i][1]);

            obstacle.setBoundingSphere();

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

    readPowerUps(){
        // TYPE: SHIELD
        const powerUpTexture1 = new THREE.TextureLoader().load("textures/shield_powerup.png");
        const powerUpColor1 = 0xFFDF35;
        const powerUpType1 = [ 
            [new THREE.Vector3(-42, 1.25, 20), new THREE.Vector3(0, -Math.PI / 2 - 0.3, 0)],
        ];

        for (let i = 0; i < powerUpType1.length; i++) {
            const powerUp = new MyPowerUp(this.app, "shield", powerUpTexture1, powerUpColor1);
            powerUp.position.set(...powerUpType1[i][0]);
            powerUp.rotation.set(...powerUpType1[i][1]);

            powerUp.setBoundingSphere();

            this.powerUps.push(powerUp);
            this.app.scene.add(powerUp);
        }

        // TYPE: SHORTCUT
        const powerUpTexture2 = new THREE.TextureLoader().load("textures/shortcut_powerup.png");
        const powerUpColor2 = 0xFFDF35;
        const powerUpType2 = [
            [new THREE.Vector3(82, 1, -20), new THREE.Vector3(0, -Math.PI / 2 - 0.2, 0)],
        ];

        for (let i = 0; i < powerUpType2.length; i++) {
            const powerUp = new MyPowerUp(this.app, "shortcut", powerUpTexture2, powerUpColor2);
            powerUp.position.set(...powerUpType2[i][0]);
            powerUp.rotation.set(...powerUpType2[i][1]);

            powerUp.setBoundingSphere();

            this.powerUps.push(powerUp);
            this.app.scene.add(powerUp);
        }

        // TYPE: SPEED
        const powerUpTexture3 = new THREE.TextureLoader().load("textures/speed_powerup.png");
        const powerUpColor3 = 0xFFDF35;
        const powerUpType3 = [
            [new THREE.Vector3(210, 1.25, -70), new THREE.Vector3(0, -Math.PI / 2, 0)],
        ];

        for (let i = 0; i < powerUpType3.length; i++) {
            const powerUp = new MyPowerUp(this.app, "speed", powerUpTexture3, powerUpColor3);
            powerUp.position.set(...powerUpType3[i][0]);
            powerUp.rotation.set(...powerUpType3[i][1]);

            powerUp.setBoundingSphere();

            this.powerUps.push(powerUp);
            this.app.scene.add(powerUp);
        }
    }

    readAutonomousVehicle(){
        this.autonomousVehicle = new MyVehicle(this.scene, 1, 0.5, 1.6, 30, [this.startingPoint.x, this.startingPoint.y, this.startingPoint.z]);
        this.autonomousVehicle.scale.set(3, 3, 3);
        //this.autonomousVehicle.position.set(this.startingPoint.x, this.startingPoint.y, this.startingPoint.z)
        this.app.scene.add(this.autonomousVehicle);
    }

    readPlayerVehicle(){
        this.playerVehicle = new MyVehicle(this.scene, 1, 0.5, 1.6, 30, [this.startingPoint.x, this.startingPoint.y + 0.95, this.startingPoint.z + 10])
        this.playerVehicle.scale.set(3, 3, 3);
        this.app.scene.add(this.playerVehicle);
        
    }

    checkForCollisions() {
        // if the player has the shield modifier, he can't collide with anything
        if(this.playerVehicle.shield)
            return;

        this.powerUps.forEach(powerUp => {
            if(this.playerVehicle.detectCollisionsSphere(powerUp.bs)){
                console.log("colidiu power up");
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
            if(this.playerVehicle.detectCollisionsSphere(obstacle.bs)){
                console.log("colidiu obstaculo")
                obstacle.applyModifier(this.playerVehicle);
                this.appliedModifiers.push(obstacle);
                this.appliedModifiersStartTime.push(Date.now());
            }
        });
        if(this.playerVehicle.detectCollisionsVehicles(this.autonomousVehicle)){
            console.log("colidiu carro")           
            this.playerVehicle.previousVelocity = this.playerVehicle.velocity;
            this.playerVehicle.velocity = 0.7*this.playerVehicle.velocity;
            this.appliedModifiers.push(this.autonomousVehicle);
            this.appliedModifiersStartTime.push(Date.now());
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
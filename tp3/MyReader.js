import * as THREE from 'three';

import { MyTrack } from "./elements/MyTrack.js";
import { MyRoute } from "./elements/MyRoute.js";
import { MyObstacle } from "./elements/MyObstacle.js";
import { MyPowerUp } from "./elements/MyPowerUp.js";
import { MyVehicle } from "./elements/MyVehicle.js";

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
    }

    readTrack(){
        this.trackWidth = 4;

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
        // LEVEL 1
        const keyPoints1 = [
            this.startingPoint,
            new THREE.Vector3(10, 1, -117),
            new THREE.Vector3(-34, 1, -115),
            new THREE.Vector3(-70, 1, -112),
            new THREE.Vector3(-85, 1, -105),
            new THREE.Vector3(-90, 1, -98),
            new THREE.Vector3(-95, 1, -90),
            new THREE.Vector3(-100, 1, -80),
            new THREE.Vector3(-105, 1, -60),
            new THREE.Vector3(-102, 1, -35),
            new THREE.Vector3(-100, 1, 5),
            new THREE.Vector3(-102, 1, 35),
            new THREE.Vector3(-110, 1, 50),
            new THREE.Vector3(-118, 1, 60),
            new THREE.Vector3(-127, 1, 70),
            new THREE.Vector3(-129, 1, 78),
            new THREE.Vector3(-129, 1, 85),
            new THREE.Vector3(-126, 1, 89),
            new THREE.Vector3(-120, 1, 95),
            new THREE.Vector3(-112, 1, 100),
            new THREE.Vector3(-105, 1, 102),
            new THREE.Vector3(-98, 1, 102),
            new THREE.Vector3(-90, 1, 100),
            new THREE.Vector3(-80, 1, 95),
            new THREE.Vector3(-70, 1, 87),
            new THREE.Vector3(-60, 1, 75),
            new THREE.Vector3(-50, 1, 45),
            new THREE.Vector3(-32, 1, -10),
            new THREE.Vector3(-10, 1, -37),
            new THREE.Vector3(10, 1, -38),
            new THREE.Vector3(20, 1, -35),
            new THREE.Vector3(30, 1, -25),
            new THREE.Vector3(35, 1, -15),
            new THREE.Vector3(40, 1, 0),
            new THREE.Vector3(45, 1, 8),
            new THREE.Vector3(53, 1, 12),
            new THREE.Vector3(60, 1, 12),
            new THREE.Vector3(65, 1, 10),
            new THREE.Vector3(72, 1, 8),
            new THREE.Vector3(80, 1, 0),
            new THREE.Vector3(85, 1, -20),
            new THREE.Vector3(95, 1, -35),
            new THREE.Vector3(105, 1, -38),
            new THREE.Vector3(115, 1, -38),
            new THREE.Vector3(125, 1, -37),
            new THREE.Vector3(140, 1, -25),
            new THREE.Vector3(150, 1, -10),
            new THREE.Vector3(165, 1, 2),
            new THREE.Vector3(175, 1, 5),
            new THREE.Vector3(185, 1, 3),
            new THREE.Vector3(195, 1, -5),
            new THREE.Vector3(203, 1, -30),
            new THREE.Vector3(206, 1, -55),
            new THREE.Vector3(205, 1, -70),
            new THREE.Vector3(200, 1, -85),
            new THREE.Vector3(180, 1, -100),
            new THREE.Vector3(150, 1, -107),
            new THREE.Vector3(115, 1, -110),
            new THREE.Vector3(80, 1, -113),
            this.startingPoint
        ];
      
        const timeInterval1 = 1;
      
        const route1 = new MyRoute(this.app, keyPoints1, timeInterval1, this.autonomousVehicle, visualRepresentation);
        this.routes.push(route1);


        // LEVEL 2
        //...

        this.chosenRoute = this.routes[this.level-1];
        this.mixer = this.chosenRoute.mixer;
        this.app.scene.add(this.chosenRoute);
    }

    readObstacles(){
        // TYPE 1
        const obstacleTexture1 = new THREE.TextureLoader().load("textures/obstacle_switchdirections.png");
        const obstacleColor1 = 0xD71D03;
        const obstaclesType1 = [ 
            [new THREE.Vector3(-97, 1, -20), new THREE.Vector3(0, Math.PI / 2, 0)],
        ];
    
        for (let i = 0; i < obstaclesType1.length; i++) {
            const obstacle = new MyObstacle(this.app, 1, obstacleTexture1, obstacleColor1);
            obstacle.position.set(...obstaclesType1[i][0]);
            obstacle.rotation.set(...obstaclesType1[i][1]);

            obstacle.setBoundingSphere();

            this.obstacles.push(obstacle);
            this.app.scene.add(obstacle);
        }

    
        // TYPE 2
        const obstacleTexture2 = new THREE.TextureLoader().load("textures/obstacle_slip.png");
        const obstacleColor2 = 0xD71D03;
        const obstaclesType2 = [
            [new THREE.Vector3(0, 1, -44), new THREE.Vector3(0, -Math.PI, 0)],
        ];
    
        for (let i = 0; i < obstaclesType2.length; i++) {
            const obstacle = new MyObstacle(this.app, 2, obstacleTexture2, obstacleColor2);
            obstacle.position.set(...obstaclesType2[i][0]);
            obstacle.rotation.set(...obstaclesType2[i][1]);

            obstacle.setBoundingSphere();

            this.obstacles.push(obstacle);
            this.app.scene.add(obstacle);
        }
    }

    readPowerUps(){
        // TYPE 1
        const powerUpTexture1 = new THREE.TextureLoader().load("textures/shield_powerup.png");
        const powerUpColor1 = 0xFFDF35;
        const powerUpType1 = [ 
            [new THREE.Vector3(-42, 1, 20), new THREE.Vector3(0, -Math.PI / 2 - 0.3, 0)],
        ];

        for (let i = 0; i < powerUpType1.length; i++) {
            const powerUp = new MyPowerUp(this.app, 1, powerUpTexture1, powerUpColor1);
            powerUp.position.set(...powerUpType1[i][0]);
            powerUp.rotation.set(...powerUpType1[i][1]);

            powerUp.setBoundingSphere();

            this.powerUps.push(powerUp);
            this.app.scene.add(powerUp);
        }

        // TYPE 2
        const powerUpTexture2 = new THREE.TextureLoader().load("textures/shortcut_powerup.png");
        const powerUpColor2 = 0xFFDF35;
        const powerUpType2 = [
            [new THREE.Vector3(82, 1, -20), new THREE.Vector3(0, -Math.PI / 2 - 0.2, 0)],
        ];

        for (let i = 0; i < powerUpType2.length; i++) {
            const powerUp = new MyPowerUp(this.app, 2, powerUpTexture2, powerUpColor2);
            powerUp.position.set(...powerUpType2[i][0]);
            powerUp.rotation.set(...powerUpType2[i][1]);

            powerUp.setBoundingSphere();

            this.powerUps.push(powerUp);
            this.app.scene.add(powerUp);
        }

        // TYPE 3
        const powerUpTexture3 = new THREE.TextureLoader().load("textures/speed_powerup.png");
        const powerUpColor3 = 0xFFDF35;
        const powerUpType3 = [
            [new THREE.Vector3(210, 1, -70), new THREE.Vector3(0, -Math.PI / 2, 0)],
        ];

        for (let i = 0; i < powerUpType3.length; i++) {
            const powerUp = new MyPowerUp(this.app, 3, powerUpTexture3, powerUpColor3);
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
        this.autonomousVehicle.position.y += 0.75;
        //this.autonomousVehicle.position.set(this.startingPoint.x, this.startingPoint.y, this.startingPoint.z)
        this.app.scene.add(this.autonomousVehicle);
    }

    readPlayerVehicle(){
        this.playerVehicle = new MyVehicle(this.scene, 1, 0.5, 1.6, 30, [this.startingPoint.x, this.startingPoint.y, this.startingPoint.z + 7])
        this.playerVehicle.position.y += 0.75;
        this.playerVehicle.scale.set(3, 3, 3);
        this.app.scene.add(this.playerVehicle);
        
    }

    checkForCollisions() {
        this.powerUps.forEach(powerUp => {
            if(this.playerVehicle.detectCollisionsSphere(powerUp.bs)){
                console.log("colidiu power up", powerUp.bs)
            }
        });
        this.obstacles.forEach(obstacle => {
            if(this.playerVehicle.detectCollisionsSphere(obstacle.bs)){
                console.log("colidiu obstaculo", obstacle.bs)
            }
        });
        if(this.playerVehicle.detectCollisionsVehicles(this.autonomousVehicle))
            console.log("colidiu carro")
    }

}

export { MyReader };
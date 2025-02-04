
import * as THREE from 'three';
import { MySky } from './MySky.js';
import { MyBird } from './MyBird.js';
import { MySkyscraper } from './MySkyscraper.js';
import { MyCloud } from './MyCloud.js';
import { MyBillboard } from './MyBillboard.js';

/**
 * MyScenario class, representing the scenario of the game
 */
class MyScenario {
    /**
     * constructor for MyScenario class
     * @param app application
     */
    constructor(app) {
        this.app = app;

        this.sky = new MySky(this.app);
        this.clouds = new MyCloud(this.app);
        this.clouds.createAllClouds();
        this.app.scene.add(this.clouds)

        // birds
        this.bird1 = new MyBird(this.app, 1, 2.4, new THREE.Vector3(20, 0, 0));
        this.bird1.bird.scale.set(5, 5, 5);

        this.bird2 = new MyBird(this.app, 1, 2.4, new THREE.Vector3(0, -3, 0));
        this.bird2.bird.scale.set(5, 5, 5);

        this.bird3 = new MyBird(this.app, 1, 2.4, new THREE.Vector3(-25, 5, 0));
        this.bird3.bird.scale.set(5, 5, 5);

        this.birds = [this.bird1, this.bird2, this.bird3];

        // skyscrapers and their spotlights
        this.skyscraperObstacles = new MySkyscraper(this.app, true, 400, 20, 4, "#ffffff", 4, "#3A6392", 2, -1);
        this.skyscraperObstacles.position.x = -20;
        this.skyscraperObstacles.position.z = 110;
        this.skyscraperObstacles.position.y = 15;
        this.obsParkingLotOffset = 1.5;
       
        let spotlight1 = new THREE.SpotLight(0xffffff, 80, 0, Math.PI/3 );
        spotlight1.target = this.skyscraperObstacles;
        spotlight1.position.set(-20, 35, 110);
        this.app.scene.add(spotlight1);

        this.skyscraperAutonomousVehicle = new MySkyscraper(this.app, true, 400, 30, 6, "#AAAE7F", 4, "#454544", 4, 11.9);
        this.skyscraperAutonomousVehicle.position.x = -250;
        this.skyscraperAutonomousVehicle.position.y = -10;
        this.skyscraperAutonomousVehicle.horizontalLine.position.x = 10;
        this.autoParkingLotOffset = 0;

        let spotlight2 = new THREE.SpotLight(0xffffff, 80, 0, Math.PI/3);
        spotlight2.target = this.skyscraperAutonomousVehicle;
        spotlight2.position.set(-250, 10, 0);
        this.app.scene.add(spotlight2);

        this.skyscraperPlayerVehicle = new MySkyscraper(this.app, true, 400, 30, 30, "#C5351B", 4, "#f1e9d0", 4, 28);
        this.skyscraperPlayerVehicle.position.x = 120;
        this.skyscraperPlayerVehicle.position.y = 10;
        this.skyscraperPlayerVehicle.position.z = -200;
        this.playerParkingLotOffset = 0;

        let spotlight3 = new THREE.SpotLight(0xffffff, 80, 0, Math.PI/3);
        spotlight3.target = this.skyscraperPlayerVehicle;
        spotlight3.position.set(120, 30, -200);
        this.app.scene.add(spotlight3);

        this.skyscraperPodium = new MySkyscraper(this.app, false, 400, 55, 3, "#f7e240", 4, "#736958", 4, -30);
        this.skyscraperPodium.rotation.y = Math.PI/2;
        this.skyscraperPodium.position.x = 200;
        this.skyscraperPodium.position.y = 30;
        this.skyscraperPodium.position.z = 90;
        this.playerParkingLotOffset = 0;

        this.podiumSpotlight = new THREE.SpotLight(0xffffff, 80, 0, Math.PI/3);
        this.podiumSpotlight.target = this.skyscraperPodium;
        this.podiumSpotlight.position.set(200, 70, 90);
        this.app.scene.add(this.podiumSpotlight);

        this.autoParkingLotCars = [];
        this.playerParkingLotCars = [];
        this.obstaclesParkingLot = [];
        this.obstacles = [];

        // pillars supporting the track
        let pillar = new THREE.CylinderGeometry(5, 5, 400, 32);
        let pillarMaterial = new THREE.MeshPhongMaterial({ color: "#454544" });
        let pillarMesh1 = new THREE.Mesh(pillar, pillarMaterial);
        pillarMesh1.position.set(-160, -200, 105)
        let pillarMesh2 = new THREE.Mesh(pillar, pillarMaterial);
        pillarMesh2.position.set(-155, -200, -90)
        let pillarMesh3 = new THREE.Mesh(pillar, pillarMaterial);
        pillarMesh3.position.set(210, -200, -95)
        let pillarMesh4 = new THREE.Mesh(pillar, pillarMaterial);
        pillarMesh4.position.set(210, -200, 5)

        pillarMesh1.layers.enable(this.layer);
        this.app.scene.add(pillarMesh1);
        pillarMesh2.layers.enable(this.layer);
        this.app.scene.add(pillarMesh2);
        pillarMesh3.layers.enable(this.layer);
        this.app.scene.add(pillarMesh3);
        pillarMesh4.layers.enable(this.layer);
        this.app.scene.add(pillarMesh4);

        // billboard
        this.billboard = new MyBillboard(this.app);
        this.billboard.position.set(-10, -200, -170);
        this.billboard.rotation.y = -Math.PI/8;
        this.app.scene.add(this.billboard);
    }

    /**
     * creates a cloud under the car for when the car leaves the track
     * @param vehiclePosition 
     */
    setCloudUnderCar(vehiclePosition) {
        this.cloudUnderCar = new MyCloud(this.app, vehiclePosition);
        this.cloudUnderCar.createOneCloud();
        
        this.app.scene.add(this.cloudUnderCar);
    }

    /**
     * sets the obstacle in the obstacles parking lot
     * @param obstacle obstacle to set
     * @param rotation rotation needed for the obstacle to lay flat on the groud
     * @param y y offset
     */
    setObstaclesParkingLot (obstacle, rotation, y) {
        this.skyscraperObstacles.setObject(obstacle, rotation, y, this.obsParkingLotOffset);
        this.obsParkingLotOffset += this.skyscraperObstacles.lineWidth/3.3;
        this.obstaclesParkingLot.push(obstacle);
        obstacle.mesh.name = "newObstacle" + obstacle.type
        this.obstacles.push(obstacle);
    }

    /**
     * adds the text to the obstacle skyscraper
     */
    addObstacleSkyscraperText () {
        // choose a new obstacle text
        const mainTextGeometry = new THREE.PlaneGeometry(47, 8, 32);
        mainTextGeometry.scale(0.3, 0.3, 0.3);
        const mainText = new THREE.Mesh(mainTextGeometry, new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('textures/new_obstacle.png'),
            side: THREE.DoubleSide,
            transparent: true,
        }));
        mainText.rotation.x = -Math.PI/2;
        mainText.rotation.z = Math.PI/4 + Math.PI/2;
        mainText.position.y = 21;
        mainText.position.x = -27;
        mainText.position.z = 116.5;
        this.app.scene.add(mainText);

        //switch directions obstacle text
        const obstacle1TextGeometry = new THREE.PlaneGeometry(54, 8, 32);
        obstacle1TextGeometry.scale(0.3, 0.3, 0.3);
        const obstacle1Text = new THREE.Mesh(obstacle1TextGeometry, new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('textures/obstacle_1_text.png'),
            side: THREE.DoubleSide,
            transparent: true,
        }));
        obstacle1Text.scale.set(0.6, 0.6, 0.6)
        obstacle1Text.rotation.x = -Math.PI/2;
        obstacle1Text.rotation.z = Math.PI/4 + Math.PI/2;
        obstacle1Text.position.y = 20.75;
        obstacle1Text.position.x = -10;
        obstacle1Text.position.z = 107;
        this.app.scene.add(obstacle1Text);

        //oil slip obstacle text
        const obstacle2TextGeometry = new THREE.PlaneGeometry(12, 8, 28);
        obstacle2TextGeometry.scale(0.3, 0.2, 0.3);
        const obstacle2Text = new THREE.Mesh(obstacle2TextGeometry, new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('textures/obstacle_2_text.png'),
            side: THREE.DoubleSide,
            transparent: true,
        }));
        obstacle2Text.rotation.x = -Math.PI/2;
        obstacle2Text.rotation.z = Math.PI/4 + Math.PI/2;
        obstacle2Text.position.y = 20.75;
        obstacle2Text.position.x = -17.5;
        obstacle2Text.position.z = 99.2;
        this.app.scene.add(obstacle2Text);
    }

    /**
     * sets the picked obstacle in the track
     */
    setPickableObstacles () {
        this.obstacles.forEach(obstacle => {
            if(obstacle.mesh.name.startsWith("newObstacle")){
                this.app.contents.pickableObjects.push(obstacle.mesh);
                this.app.contents.clickableObjects.push(obstacle.mesh);
            }
        });
    }

    /**
     * sets the vehicle in the autonomous parking lot
     * @param vehicle vehicle to set
     * @param rotation rotation needed for the vehicle to be parallel to the parking lot lines
     * @param y y offset
     */
    setAutonomousVehicleParkingLot (vehicle, rotation, y) {
        this.skyscraperAutonomousVehicle.setObject(vehicle, rotation + Math.PI, y, this.autoParkingLotOffset);
        this.autoParkingLotOffset += this.skyscraperAutonomousVehicle.lineWidth/4;
        this.autoParkingLotCars.push(vehicle);
    }

    /**
     * sets the obstacle in the player parking lot
     * @param vehicle vehicle to set
     * @param rotation rotation needed for the vehicle to be parallel to the parking lot lines
     * @param y y offset
     */
    setPlayerVehicleParkingLot (vehicle, rotation, y) {
        this.skyscraperPlayerVehicle.setObject(vehicle, rotation, y, this.playerParkingLotOffset);
        this.playerParkingLotOffset += this.skyscraperPlayerVehicle.lineWidth/4;
        this.playerParkingLotCars.push(vehicle);
    }

    /**
     * sets the podium objects
     * @param winner vehicle that won the game
     * @param loser vehicle that lost the game
     */
    setPodium (winner, loser) {
        // setting the shadows for the podium spotlight
        this.podiumSpotlight.castShadow = true;
        this.podiumSpotlight.shadow.mapSize.width = 1024;
        this.podiumSpotlight.shadow.mapSize.height = 1024;
        this.podiumSpotlight.shadow.camera.near = 0.5;
        this.podiumSpotlight.shadow.camera.far = 27;

        this.podium = new THREE.Group();
        let podium1 = new THREE.BoxGeometry( 22,5, 15 );
        let podiumMaterial = new THREE.MeshPhongMaterial({ color: "#B7661A", specular:  "#777777", emissive: "#000000", shininess: 30 });
        let podiumMesh1 = new THREE.Mesh(podium1, podiumMaterial);
        podiumMesh1.receiveShadow = true;
        podiumMesh1.castShadow = true;
        podiumMesh1.position.copy(this.skyscraperPodium.position);
        podiumMesh1.position.x += 8;
        podiumMesh1.position.y += 8;
        podiumMesh1.position.z -= 6;
        podiumMesh1.rotation.y = Math.PI/6;

        let podium2 = new THREE.BoxGeometry( 22 , 2, 15 );
        let podiumMesh2 = new THREE.Mesh(podium2, podiumMaterial);
        podiumMesh2.receiveShadow = true;
        podiumMesh2.castShadow = true;
        podiumMesh2.position.copy(podiumMesh1.position);
        podiumMesh2.position.x -= 17;
        podiumMesh2.position.z += 22;
      
        // fireworks
        let fireworksPlane = new THREE.PlaneGeometry( 8, 8 );
        this.fireworksMesh = new THREE.Mesh( fireworksPlane, 
            new THREE.MeshPhongMaterial({ color: "#736958",  specular:  "#777777", emissive: "#000000", shininess: 30 }) );
        this.fireworksMesh.rotation.x = -Math.PI / 2;
        this.fireworksMesh.rotation.z = -Math.PI / 8;
        this.fireworksMesh.position.copy(this.skyscraperPodium.position);
        this.fireworksMesh.position.y += 6;
        this.fireworksMesh.position.x -= 10;
        this.fireworksMesh.position.z -= 14;

        // set the winner and loser vehicles after the camera transition starts
        setTimeout(() => {
            winner.castShadow = true;
            winner.position.copy(podiumMesh1.position);
            winner.position.y += 4;
            const winnerRotation = new THREE.Vector3(0, Math.PI - Math.PI/3.5, 0);
            winner.rotation.set(winnerRotation.x, winnerRotation.y, winnerRotation.z);
            winner.scale.set(1.5, 1.5, 1.5)

            loser.castShadow = true;
            loser.position.copy(podiumMesh2.position);
            loser.position.y += 2;
            const loserRotation = new THREE.Vector3(0, - Math.PI, 0);
            loser.rotation.set(loserRotation.x, loserRotation.y, loserRotation.z);
            loser.scale.set(1.5, 1.5, 1.5)
        }, 1000);    

        this.skyscraperPodium.parkingLot.receiveShadow = true;
        this.podium.add(podiumMesh1);
        this.podium.add(podiumMesh2);
        this.podium.add(this.fireworksMesh);
        this.podium.add(this.app.contents.winner);
        this.podium.add(this.app.contents.loser);
        this.app.scene.add(this.podium);
    }
    
    /**
     * updates the scenario
     * @param playerVehicle the position of the player vehicle is needed for the clound under it to be updated
     * @param elapsedTime 
     * @param time 
     */
    update(playerVehicle, elapsedTime, time) {
        // update the clouds
        this.clouds.updateAllClouds();

        // update the birds position
        this.birds.forEach(bird => bird.update(elapsedTime));

        if (this.app.contents.currentState == this.app.contents.states.PLAYING) {
            if (playerVehicle.outOfTrack && playerVehicle.allCarOutOfTrack) {
                this.cloudUnderCar.visible = true;
                this.cloudUnderCar.updateOneCloud(playerVehicle.position);
            }
            else {
                this.cloudUnderCar.visible = false;
            }
        }

        // call getImage() to update the texture of the billboard (every 60 seconds)
        if(time - this.app.contents.billboardTime >= 60000){
            this.billboard.getImage();
            this.app.contents.billboardTime = time;
        }
    }

    /**
     * scale effect on hover during picking
     * @param obstacle obstacle to scale
     */
    handleObstacleHover(obstacle) {
        obstacle.scale.set(obstacle.scale.x + 0.2, obstacle.scale.y + 0.2, obstacle.scale.z + 0.2);
    }

    /**
     * resets the scale to the normal one after the hover effect
     * @param obstacle obstacke to scale
     */
    resetObstacleState(obstacle) {
        obstacle.scale.set(obstacle.scale.x - 0.2, obstacle.scale.y - 0.2, obstacle.scale.z - 0.2);
    }

    
}

export { MyScenario }
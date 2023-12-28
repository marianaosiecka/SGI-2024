
import * as THREE from 'three';
import { MySky } from './MySky.js';
import { MyClouds } from './MyClouds.js';
import { MyBird } from './MyBird.js';
import { MySkyscraper } from './MySkyscraper.js';
import { MyCloud } from '../elements/MyCloud.js';

class MyScenario {
    constructor(app, layer) {
        this.app = app;
        this.layer = layer;

        this.sky = new MySky(this.app, this.layer);
        this.clouds = new MyClouds(this.app, this.layer);
        this.app.scene.add(this.clouds)

        // birds
        this.bird1 = new MyBird(this.app, 1, 2.4, new THREE.Vector3(20, 0, 0), this.layer);
        this.bird1.bird.scale.set(5, 5, 5);

        this.bird2 = new MyBird(this.app, 1, 2.4, new THREE.Vector3(0, -3, 0), this.layer);
        this.bird2.bird.scale.set(5, 5, 5);

        this.bird3 = new MyBird(this.app, 1, 2.4, new THREE.Vector3(-25, 5, 0), this.layer);
        this.bird3.bird.scale.set(5, 5, 5);

        this.birds = [this.bird1, this.bird2, this.bird3];

        this.skyscraperObstacles = new MySkyscraper(this.app, 400, 20, 4, "#ffffff", 4, "#3A6392", 2, layer, -1.5);
        this.skyscraperObstacles.position.x = -20;
        this.skyscraperObstacles.position.z = 110;
        this.skyscraperObstacles.position.y = 30;
        this.obsParkingLotOffset = 1.5;
       
        let spotlight1 = new THREE.SpotLight(0xffffff, 80, 0, Math.PI/3 );
        spotlight1.target = this.skyscraperObstacles;
        spotlight1.position.set(-30, 50, 70);
        this.app.scene.add(spotlight1);

        this.skyscraperAutonomousVehicle = new MySkyscraper(this.app, 400, 30, 6, "#AAAE7F", 4, "#454544", 4, layer, 12);
        this.skyscraperAutonomousVehicle.position.x = -250;
        this.skyscraperAutonomousVehicle.position.y = -10;
        this.skyscraperAutonomousVehicle.position.z = -40;
        this.autoParkingLotOffset = 0;

        let spotlight2 = new THREE.SpotLight(0xffffff, 80, 0, Math.PI/3);
        spotlight2.target = this.skyscraperAutonomousVehicle;
        spotlight2.position.set(-250, 10, 0);
        this.app.scene.add(spotlight2);

        this.skyscraperPlayerVehicle = new MySkyscraper(this.app, 400, 30, 30, "#C5351B", 4, "#f1e9d0", 4, layer, 28);
        this.skyscraperPlayerVehicle.position.x = 120;
        this.skyscraperPlayerVehicle.position.y = 10;
        this.skyscraperPlayerVehicle.position.z = -200;
        this.playerParkingLotOffset = 0;

        let spotlight3 = new THREE.SpotLight(0xffffff, 80, 0, Math.PI/3);
        spotlight3.target = this.skyscraperPlayerVehicle;
        spotlight3.position.set(120, 30, -200);
        this.app.scene.add(spotlight3);

        this.autoParkingLotCars = [];
        this.playerParkingLotCars = [];
        this.obstaclesParkingLot = [];

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
    }

    setCloudUnderCar(vehiclePosition) {
        this.cloudUnderCar = new MyCloud(this.app, vehiclePosition);
    }

    setObstaclesParkingLot (obstacle, rotation, y) {
        this.skyscraperObstacles.setObject(obstacle, rotation, y, this.obsParkingLotOffset);
        this.obsParkingLotOffset += this.skyscraperObstacles.lineWidth/3.3;
        this.obstaclesParkingLot.push(obstacle);
    }

    setAutonomousVehicleParkingLot (vehicle, rotation, y) {
        this.skyscraperAutonomousVehicle.setObject(vehicle, rotation, y, this.autoParkingLotOffset);
        this.autoParkingLotOffset += this.skyscraperAutonomousVehicle.lineWidth/4;
        this.autoParkingLotCars.push(vehicle);
    }

    setPlayerVehicleParkingLot (vehicle, rotation, y) {
        this.skyscraperPlayerVehicle.setObject(vehicle, rotation, y, this.playerParkingLotOffset);
        this.playerParkingLotOffset += this.skyscraperPlayerVehicle.lineWidth/4;
        this.playerParkingLotCars.push(vehicle);
    }
    
    update(playerVehicle, elapsedTime) {
        this.clouds.update();
        this.birds.forEach(bird => bird.update(elapsedTime));

        if (this.app.contents.playing) {
            if (playerVehicle.outOfTrack && playerVehicle.allCarOutOfTrack) {
                this.cloudUnderCar.cloud.visible = true;
                this.cloudUnderCar.update(playerVehicle.position, playerVehicle.orientation);
            }
            else {
                this.cloudUnderCar.cloud.visible = false;
            }
        }
    }
}

export { MyScenario }
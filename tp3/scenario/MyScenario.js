
import * as THREE from 'three';
import { MySky } from './MySky.js';
import { MyClouds } from './MyClouds.js';
import { MyBird } from './MyBird.js';
import { MySkyscraper } from './MySkyscraper.js';
import { MyCloud } from '../elements/MyCloud.js';

class MyScenario {
    constructor(app, layer) {
        this.app = app;

        this.sky = new MySky(this.app, layer);
        this.clouds = new MyClouds(this.app);
        this.clouds.layers.set(6);
        this.app.scene.add(this.clouds)

        // birds
        this.bird1 = new MyBird(this.app, 1, 2.4, new THREE.Vector3(20, 0, 0));
        this.bird1.bird.scale.set(5, 5, 5);

        this.bird2 = new MyBird(this.app, 1, 2.4, new THREE.Vector3(0, -3, 0));
        this.bird2.bird.scale.set(5, 5, 5);

        this.bird3 = new MyBird(this.app, 1, 2.4, new THREE.Vector3(-25, 5, 0));
        this.bird3.bird.scale.set(5, 5, 5);

        this.birds = [this.bird1, this.bird2, this.bird3];

        this.skyscraperAutonomousVehicle = new MySkyscraper(this.app, 400, 20, 4, "#ffffff", 4, "#3A6392", layer, 0);
        this.skyscraperAutonomousVehicle.skyscraper.position.x = -30;
        this.skyscraperAutonomousVehicle.skyscraper.position.z = 70;
        let spotlight1 = new THREE.SpotLight(0xffffff, 80, 0, Math.PI/3 );
        spotlight1.target = this.skyscraperAutonomousVehicle.skyscraper;
        spotlight1.position.set(-30, 20, 70);
        this.app.scene.add(spotlight1);

        this.skyscraperObstacles = new MySkyscraper(this.app, 400, 30, 5, "#AAAE7F", 4, "#454544", layer, 10);
        this.skyscraperObstacles.skyscraper.position.x = -250;
        let spotlight2 = new THREE.SpotLight(0xffffff, 80, 0, Math.PI/3);
        spotlight2.target = this.skyscraperObstacles.skyscraper;
        spotlight2.position.set(-250, 20, 0);
        this.app.scene.add(spotlight2);
        /*this.skyscraperPlayerVehicle = new MySkyscraper(this.app, 400, 15, 3, "#e15d31", 2, "#dc764d", -8);
        this.skyscraperPlayerVehicle.skyscraper.position.x = 250;*/

        this.skyscraper1 = new MySkyscraper(this.app, 400, 30, 30, "#C5351B", 4, "#f1e9d0", layer, 28);
        this.skyscraper1.skyscraper.position.x = 120;
        this.skyscraper1.skyscraper.position.z = -200;
        let spotlight3 = new THREE.SpotLight(0xffffff, 80, 0, Math.PI/3);
        spotlight3.target = this.skyscraper1.skyscraper;
        spotlight3.position.set(120, 20, -200);
        this.app.scene.add(spotlight3);

        // pillars supporting the track
        let pillar = new THREE.CylinderGeometry( 5, 5, 400, 32 );
        let pillarMaterial = new THREE.MeshPhongMaterial( {color: "#454544"} );
        let pillarMesh1 = new THREE.Mesh( pillar, pillarMaterial );
        pillarMesh1.position.set(-160, -200, 105)
        let pillarMesh2 = new THREE.Mesh( pillar, pillarMaterial );
        pillarMesh2.position.set(-155, -200, -90)
        let pillarMesh3 = new THREE.Mesh( pillar, pillarMaterial );
        pillarMesh3.position.set(210, -200, -95)
        let pillarMesh4 = new THREE.Mesh( pillar, pillarMaterial );
        pillarMesh4.position.set(210, -200, 5)

        pillarMesh1.layers.enable(layer);
        this.app.scene.add(pillarMesh1);
        pillarMesh2.layers.enable(layer);
        this.app.scene.add(pillarMesh2);
        pillarMesh3.layers.enable(layer);
        this.app.scene.add(pillarMesh3);
        pillarMesh4.layers.enable(layer);
        this.app.scene.add(pillarMesh4);
    }

    setCloudUnderCar (vehiclePosition) {
        this.cloudUnderCar = new MyCloud(this.app, vehiclePosition);
    }

    update(playerVehicle, elapsedTime) {
        this.clouds.update();
        this.birds.forEach(bird => bird.update(elapsedTime));

        if(playerVehicle.outOfTrack && playerVehicle.allCarOutOfTrack){
            this.cloudUnderCar.cloud.visible = true;
            this.cloudUnderCar.update(playerVehicle.position, playerVehicle.orientation);
        }
        else{
            this.cloudUnderCar.cloud.visible = false;
        }
    }
}

export { MyScenario}
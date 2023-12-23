
import * as THREE from 'three';
import { MySky } from './MySky.js';
import { MyClouds } from './MyClouds.js';
import { MyBird } from './MyBird.js';
import { MySkyscraper } from './MySkyscraper.js';

class MyScenario {
    constructor(app) {
        this.app = app;

        this.sky = new MySky(this.app);
        this.clouds = new MyClouds(this.app);
        this.bird = new MyBird(this.app, 1, 2.4);

        this.skyscraperAutonomousVehicle = new MySkyscraper(this.app, 500, 20, 4, "#CCCCCC", 4, "#001F3F", -1);
        this.skyscraperObstacles = new MySkyscraper(this.app, 500, 30, 5, "#d2c4b9", 4, "#583f2f", 8);
        this.skyscraperObstacles.skyscraper.position.x = -250;
        this.skyscraperPlayerVehicle = new MySkyscraper(this.app, 400, 15, 3, "#e15d31", 2, "#dc764d", -8);
        this.skyscraperPlayerVehicle.skyscraper.position.x = 250;

        this.skyscraper1 = new MySkyscraper(this.app, 500, 30, 30, "#d2c4b9", 4, "#583f2f", 28);
        this.skyscraper1.skyscraper.position.x = -250;
        this.skyscraper1.skyscraper.position.z = -200;
    }

    update() {
        this.clouds.update();
        this.bird.update();
    }
}

export { MyScenario}
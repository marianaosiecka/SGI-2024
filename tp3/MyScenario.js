
import * as THREE from 'three';
import { MySky } from './MySky.js';
import { MyClouds } from './MyClouds.js';

class MyScenario {
    constructor(app) {
        this.app = app;

        this.sky = new MySky(this.app);
        this.clouds = new MyClouds(this.app);
    }
}

export { MyScenario}
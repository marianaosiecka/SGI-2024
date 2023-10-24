import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains a 3D axis representation
 */
class MyScene extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';
        
    }
}

MyScene.prototype.isGroup = true;

export { MyScene };
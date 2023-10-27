import * as THREE from 'three';
import { MyApp } from './MyApp.js';

class MyNode extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app, id, material, texture, ma, mp = 1) {
        super();
        this.app = app;
        this.type = 'Group';

        this.id = id;
        this.material = material;
        this.texture = texture;
        this.ma = ma;
        this.mp = mp;

        this.m = ma * mp;
    }

    createDescendentNode(newNodeId){
        return new MyNode(this.app, newNodeId, this.material, this.texture, this.ma);
    }
}

MyNode.prototype.isGroup = true;

export { MyNode };
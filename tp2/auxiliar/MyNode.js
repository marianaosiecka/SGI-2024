import * as THREE from 'three';
import { MyApp } from './MyApp.js';

class MyNode extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app, id, ma, material, texture, mp = 1) {
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

    createDescendentNode(newNodeId, mp = 1, material = null, texture = null){
        if(material == null)
            material = this.material;
        if(texture == null)
            texture = this.texture;

        this.add(new MyNode(this.app, newNodeId, this.ma, material, texture, mp));
    }

    // updatePos -> updateChildren
    
}

MyNode.prototype.isGroup = true;

export { MyNode };
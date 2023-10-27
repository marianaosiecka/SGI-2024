import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
this.descriptors["texture"] = [
			{name: "id", type: "string" },
			{name: "filepath", type: "string"},
            {name: "isVideo", type: "boolean", required: false, default: false}, // a nice way to see if the texture is a video or not            
            {name: "magFilter", type: "string", required: false, default: "LinearFilter"}, // to be used in later classes
            {name: "minFilter", type: "string", required: false, default: "LinearMipmapLinearFilter"}, // to be used in later classes
            {name: "mipmaps", type: "boolean", required: false, default: true}, // by default threejs generates mipmaps for you
            {name: "anisotropy", type: "integer", required: false, default: 1}, // default is 1. A higher value gives a less blurry result than a basic mipmap, at the cost of more texture samples being used
		] */

class MyTexture extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app, id, filepath) {
        super();
        this.app = app;
        this.id = id;
        this.filepath = filepath;
        this.texture = new THREE.TextureLoader().load(filepath);
    }
}

export { MyTexture };
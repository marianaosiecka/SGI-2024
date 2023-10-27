import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MyTexture } from './MyTexture.js';

/*
 this.descriptors["material"] = [
            {name: "id", type: "string"},
            {name: "color", type: "rgba"},
            {name: "specular", type: "rgba"},
            {name: "emissive", type: "rgba"},
            {name: "shininess", type: "float"},
            {name: "wireframe", type: "boolean", required: false, default: false},
            {name: "shading", type: "item", required: false, choices: ["none","flat","smooth"], default: "smooth"},
            {name: "textureref", type: "string", required: false, default: null}, // The color map. May optionally include an alpha channel. The texture map color is modulated by the diffuse color. Default null.
            {name: "texlength_s", type: "float", required: false, default: 1.0},
            {name: "texlength_t", type: "float", required: false, default: 1.0},
            {name: "twosided", type: "boolean", required: false, default: false},
            {name: "bump_ref", type: "string", required: false, default: null}, // bump map is to be used in later classes
            {name: "bump_scale", type: "float", required: false, default: 1.0},
        ]
        */
class MyMaterial {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(materialData, texture, bumpTexture) {
        this.id = materialData.id;
        this.color = materialData.color;
        this.specular = materialData.specular;
        this.shininess = materialData.shininess;
        this.emissive = materialData.emissive;
        this.shading = materialData.shading;
        this.texture = texture;
        this.twoSided = materialData.twosided;
        this.bumpTexture = bumpTexture;

        this.flatShading = false;
        if (this.shading == "flat") this.flatShading = true;

        this.material = new THREE.MeshPhongMaterial({ color:this.color, flatShading: this.flatShading, specular: this.specular, shininess: this.shininess, emissive: this.emissive, wireframe:this.wireframe});

        if(this.textureref != null) {
            this.texture.wrapS = materialData.texlength_s;
            this.texture.wrapT = materialData.texlength_t;
            this.material.map = this.texture;
        }

        if (this.twoSided) {
            this.material.twoSided = THREE.DoubleSide;
        }

        if(materialData.bump_ref != null) {
            this.material.bumpMap = this.bumpTexture;
            this.material.bumpScale = materialData.bump_scale;
        }
    }
}


export { MyMaterial };
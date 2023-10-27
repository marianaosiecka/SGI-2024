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
    constructor(app, id, color, specular, shininess, emissive, shading = "smooth") {
        super();
        this.app = app;
        this.id = id;
        this.color = color;
        this.specular = specular;
        this.shininess = shininess;
        this.emissive = emissive;
        this.shading = shading;

        this.flatShading = false;
        if (shading == "flat") this.flatShading = true;

        if (this.shading == "none") this.material = new THREE.MeshBasicMaterial();
        else this.material = new THREE.MeshPhongMaterial({ flatShading: flatShading, specular: this.specular, shininess: this.shininess, emissive: this.emissive });

        this.material.color = color;

        // set optional parameters default value
        this.wireframe = false;
        this.textureref = null;
        this.texlength_s = 1;
        this.texlength_t = 1;
        this.twosided = false;
    }

    setShading(shading) {
        if (shading == "none") {
            this.material = new THREE.MeshBasicMaterial({ color: this.color })
        }
        else if (shading == "flat") {
            this.flatShading = true;
            this.material.flatShading = this.flatShading;
        }
    }

    setTexture(textureref, texlength_s = 1, texlength_t = 1) {
        this.texture = new MyTexture(this.app, textureref, texlength_s, texlength_t);
    }

    setTwoSided(twosided) {
        this.twosided = twosided ? THREE.DoubleSide : null;;
    }

}


export { MyMaterial };
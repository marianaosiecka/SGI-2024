import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MyTexture } from './MyTexture.js';


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

        if(shading == "smooth") shading = false;
        else if(shading == "flat") shading = true;

        if (this.shading == "none") this.material = new THREE.MeshBasicMaterial();
        else this.material = new THREE.MeshPhongMaterial({ flatShading: shading, specular: this.specular, shininess: this.shininess, emissive: this.emissive });

        // set optional parameters default value
        this.wireframe = false;
        this.textureref = null;
        this.texlength_s = 1;
        this.texlength_t = 1;
        this.twosided = false;
    }

    setWireframe(wireframe){
        this.wireframe = wireframe;
    }

    setShading(shading){
        if(shading == "smooth") this.shading = true;
        else if(shading == "flat") this.shading = false;
        this.shading = shading;
    }
   
    setTexture(textureref, texlength_s = 1, texlength_t = 1){
        this.texture = new MyTexture(this.app, textureref, texlength_s, texlength_t);
    }

    setTwoSided(twosided){
        this.twosided = twosided ? THREE.DoubleSide : null;;
    }

}


export { MyMaterial };
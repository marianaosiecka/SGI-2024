import * as THREE from 'three';

class MyMaterial {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(materialData, myTexture, bumpTexture) {
        this.id = materialData.id;
        this.color = materialData.color;
        this.specular = materialData.specular;
        this.shininess = materialData.shininess;
        this.emissive = materialData.emissive;
        this.wireframe = materialData.wireframe;
        this.shading = materialData.shading;
        this.myTexture = myTexture;
        this.twoSided = materialData.twosided;
        this.bumpTexture = bumpTexture;

        this.flatShading = false;
        if (this.shading == "flat") this.flatShading = true;

        this.material = new THREE.MeshPhongMaterial({ color:this.color, flatShading: this.flatShading, specular: this.specular, shininess: this.shininess, emissive: this.emissive, wireframe: this.wireframe});

        if(this.textureref != null) {
            this.myTexture.texture.wrapS = materialData.texlength_s;
            this.myTexture.texture.wrapT = materialData.texlength_t;
            this.material.map = this.myTexture.texture;
        }

        if (this.twoSided) {
            this.material.twoSided = THREE.DoubleSide;
        }

        if(materialData.bump_ref != null) {
            this.material.bumpMap = this.bumpTexture.texture;
            this.material.bumpScale = materialData.bump_scale;
        }
    }
}


export { MyMaterial };
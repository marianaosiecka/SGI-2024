import * as THREE from 'three';

class MyMaterial {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(materialData, myTexture, bumpTexture, specularTexture) {
        this.id = materialData.id;
        this.textureref = materialData.textureref;
        this.bumpref = materialData.bumpref;
        this.wireframe = materialData.wireframe;
        this.texlength_t = materialData.texlength_t;
        this.texlength_s = materialData.texlength_s;
        this.myTexture = myTexture;
        this.bumpTexture = bumpTexture;
        this.specularTexture = specularTexture;
        
        let flatShading = false;
        if (materialData.shading == "flat") flatShading = true;

        this.transparent = (materialData.color.a != 1);
 
        this.material = new THREE.MeshPhongMaterial({ color: materialData.color, flatShading: flatShading, specular: materialData.specular, shininess: materialData.shininess, emissive: materialData.emissive, wireframe: this.wireframe});

        if(this.textureref != null) {
            this.material.needsUpdate = true;  
            this.material.map = this.myTexture;
        }

        if(materialData.twosided)
            this.material.side = THREE.DoubleSide;

            
        if(this.bumpref != null) {
            this.material.bumpMap = this.bumpTexture;
            this.material.bumpScale = materialData.bumpscale;
        }

        if(this.specularref != null) {
            this.material.specularMap = this.specularTexture;
        }

        if(this.transparent){
            this.material.transparent = true;
            this.material.opacity = materialData.color.a;
        }
    }

    setRepeat(width, height) {
        if(this.textureref != null) {
            this.material.map.repeat.set(width/this.texlength_s, height/this.texlength_t);
        }
        if(this.bumpref != null) {
            this.material.bumpMap.repeat.set(width/this.texlength_s, height/this.texlength_t)
        }
        if(this.specularref != null) {
            this.material.specularMap.repeat.set(width/this.texlength_s, height/this.texlength_t)
        }
    }
}


export { MyMaterial };
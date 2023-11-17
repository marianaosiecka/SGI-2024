import * as THREE from 'three';

class MyMaterial {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(materialData, myTexture, bumpTexture) {
        this.id = materialData.id;
        this.color = new THREE.Color(materialData.color.r, materialData.color.g, materialData.color.b)
        this.transparent = materialData.color.a != 1;
        this.specular = new THREE.Color(materialData.specular.r, materialData.specular.g, materialData.specular.b);
        this.shininess = materialData.shininess;
        this.emissive = new THREE.Color(materialData.emissive.r, materialData.emissive.g, materialData.emissive.b);
        this.wireframe = materialData.wireframe;
        this.shading = materialData.shading;
        this.myTexture = myTexture;
        this.bumpTexture = bumpTexture;
        
        this.flatShading = false;
        if (this.shading == "flat") this.flatShading = true;
 
        this.material = new THREE.MeshPhongMaterial({ color:this.color, flatShading: this.flatShading, specular: this.specular, shininess: this.shininess, emissive: this.emissive, wireframe: this.wireframe});

        if(materialData.textureref != null) {
            this.myTexture.wrapS = materialData.texlength_s;
            this.myTexture.wrapT = materialData.texlength_t;
            this.material.map = this.myTexture;
        }

        if(materialData.twosided)
            this.material.side = THREE.DoubleSide;

            
        if(materialData.bump_ref != null) {
            this.material.bumpMap = this.bumpTexture;
            this.material.bumpScale = materialData.bump_scale;
        }

        if(this.transparent){
            this.material.transparent = true;
            this.material.opacity = materialData.color.a;
        }

    
    }
}


export { MyMaterial };
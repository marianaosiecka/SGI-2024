import * as THREE from 'three';

class MyMaterial {

    /**
     * Constructor for MyMaterial class.
     *
     * @param {Object} materialData - The material properties data.
     * @param {THREE.Texture} myTexture - The texture to add to the material map property.
     * @param {THREE.Texture} bumpTexture - The bump texture to add to the material bumpMap property.
     * @param {THREE.Texture} specularTexture - The specular texture to add to the material specularMap property.
     * @param {Boolean} defaultMaterial - Determines if the node has a material defined for it.
     */
    constructor(materialData, myTexture, bumpTexture, specularTexture, defaultMaterial = false) {
        if(defaultMaterial){
            this.id = "defaultMaterial"
            this.material = materialData
            return
        }
        this.id = materialData.id;
        this.textureref = materialData.textureref;
        this.bumpref = materialData.bumpref;
        this.wireframe = materialData.wireframe;
        this.texlength_t = materialData.texlength_t;
        this.texlength_s = materialData.texlength_s;
        this.myTexture = myTexture;
        this.bumpTexture = bumpTexture;
        this.specularTexture = specularTexture;
        let color = new THREE.Color();
        color.setRGB(materialData.color.r, materialData.color.g, materialData.color.b)

        let flatShading = false;
        if (materialData.shading == "flat") flatShading = true;

        this.transparent = (materialData.color.a != 1);

        this.material = new THREE.MeshPhongMaterial({ color: color, flatShading: flatShading, specular: materialData.specular, shininess: materialData.shininess, emissive: materialData.emissive, wireframe: this.wireframe});

        if(this.textureref != null) {
            this.material.map = this.myTexture;
            this.material.needsUpdate = true;
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

    /**
     * Defines the repeat values based on the mesh width and height.
     */
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
import * as THREE from 'three';

class MyTexture {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(textureData) {
        console.log(textureData)
        this.id = textureData.id;
        this.filepath = textureData.filepath;
        this.isVideo = textureData.isVideo;
        this.magFilter = textureData.magFilter;
        this.minFilter = textureData.minFilter;
        this.mipmaps = textureData.mipmaps;
        this.anisotropy = textureData.anisotropy;
        
        if(textureData.isVideo){
            //let video = HTML.get
            //this.texture = new THREE.VideoTexture(video.src); //supostamente é com um elemento HTML e nao com um filepath por isso ?idk?
        }
        else
            this.texture = new THREE.TextureLoader().load(this.filepath);

        this.texture.magFilter = textureData.magFilter;
        this.texture.minFilter = textureData.minFilter;
        this.texture.mipmaps = textureData.mipmaps;
        this.texture.anisotropy = textureData.anisotropy;
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
    }
}

export { MyTexture };
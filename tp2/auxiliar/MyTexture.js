import * as THREE from 'three';

class MyTexture {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(textureData) {
        this.id = textureData.id;
        this.filepath = textureData.filepath;
        this.isVideo = textureData.isVideo;
        
        if(textureData.isVideo){
            let video = document.getElementById('video');
            this.texture = new THREE.VideoTexture(video);   
        }
        else{
            this.texture = new THREE.TextureLoader().load(this.filepath);
            this.texture.mipmaps = textureData.mipmaps;
        }


        this.texture.magFilter = textureData.magFilter;
        this.texture.minFilter = textureData.minFilter;
        this.texture.anisotropy = textureData.anisotropy;
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        console.log("VIDEO", this.texture)

    }
}

export { MyTexture };
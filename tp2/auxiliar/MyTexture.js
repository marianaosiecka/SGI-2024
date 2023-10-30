import * as THREE from 'three';

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
    constructor(textureData) {
        this.id = textureData.id;
        this.filepath = textureData.filepath;
        this.isVideo = textureData.isVideo;
        this.magFilter = textureData.magFilter;
        this.minFilter = textureData.minFilter;
        this.mipmaps = textureData.mipmaps;
        this.anisotropy = textureData.anisotropy;
        
        if(textureData.isVideo) 
            this.texture = new THREE.VideoTexture(this.filepath); //supostamente é com um elemento HTML e nao com um filepath por isso ?idk?
        else
            this.texture = new THREE.TextureLoader().load(filepath);

        this.texture.magFilter = textureData.magFilter;
        this.texture.minFilter = textureData.minFilter;
        this.texture.mipmaps = textureData.mipmaps;
        this.texture.anisotropy = textureData.anisotropy;
    }
}

export { MyTexture };
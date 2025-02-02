import * as THREE from 'three';

class MyTexture {

    /**
     * Constructor for MyTexture class.
     *
     * @param {Object} textureData - The texture properties data.
     * @param {number} videoNum - The index of the video element if the texture is a video.
     */
    constructor(textureData, videoNum) {
        this.id = textureData.id;
        this.filepath = textureData.filepath;
        this.isVideo = textureData.isVideo;
        this.videoNum = videoNum
        
        if(textureData.isVideo){    // the video num is a way of having more than one video in the scene
            let video = document.getElementsByClassName('video')[this.videoNum];
            this.texture = new THREE.VideoTexture(video);  
            this.texture.needsUpdate = true; 
            this.videoNum++;
        }
        
        else{
            this.texture = new THREE.TextureLoader().load(this.filepath);
            if(!textureData.mipmaps){
                this.texture.generateMipmaps = false
                if(textureData.mipmap0 != null)
                    this.loadMipmap(this.texture, 0, textureData.mipmap0)    
                if(textureData.mipmap1 != null)
                    this.loadMipmap(this.texture, 1, textureData.mipmap1)    
                if(textureData.mipmap2 != null)
                    this.loadMipmap(this.texture, 2, textureData.mipmap2)    
                if(textureData.mipmap3 != null)
                    this.loadMipmap(this.texture, 3, textureData.mipmap3)    
                if(textureData.mipmap4 != null)
                    this.loadMipmap(this.texture, 4, textureData.mipmap4)    
                if(textureData.mipmap5 != null)
                    this.loadMipmap(this.texture, 5, textureData.mipmap5)    
                if(textureData.mipmap6 != null)
                    this.loadMipmap(this.texture, 6, textureData.mipmap6)    
                if(textureData.mipmap7 != null)
                    this.loadMipmap(this.texture, 7, textureData.mipmap7) 
                this.texture.needsUpdate = true;
           }
            else {
                let magFilter = null;
                let minFilter = null;
                switch (textureData.magFilter) {
                    case "LinearFilter":
                        magFilter = THREE.LinearFilter;
                        break;
                    case "NearestFilter":
                        magFilter = THREE.NearestFilter ;
                        break;
                }
                switch (textureData.minFilter) {
                    case "NearestFilter":
                        minFilter = THREE.NearestFilter ;
                        break;
                    case "NearestMipmapNearestFilter":
                        minFilter = THREE.NearestMipmapNearestFilter ;
                        break;
                    case "NearestMipmapLinearFilter":
                        minFilter = THREE.NearestMipmapLinearFilter ;
                        break;
                    case "LinearFilter":
                        minFilter = THREE.LinearFilter ;
                        break;
                    case "LinearMipmapNearestFilter":
                        minFilter = THREE.LinearMipmapNearestFilter ;
                        break;
                    case "LinearMipmapLinearFilter":
                        minFilter = THREE.LinearMipmapLinearFilter ;
                        break;
                }
                this.texture.magFilter = magFilter;
                this.texture.minFilter = minFilter;
            }
        }

        this.texture.anisotropy = textureData.anisotropy;
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
    }

    /**
     * Loads a mipmap for the texture.
     *
     * @param {THREE.Texture} parentTexture - The parent texture to which the mipmap will be added.
     * @param {number} level - The mipmap level.
     * @param {string} path - The file path for the mipmap image.
     */
    loadMipmap(parentTexture, level, path)
    {
        // load texture. On loaded call the function to create the mipmap for the specified level 
        new THREE.TextureLoader().load(path, 
            function(mipmapTexture)  // onLoad callback
            {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                ctx.scale(1, 1);
                
                // const fontSize = 48
                const img = mipmapTexture.image         
                canvas.width = img.width;
                canvas.height = img.height

                // first draw the image
                ctx.drawImage(img, 0, 0 )
                             
                // set the mipmap image in the parent texture in the appropriate level
                parentTexture.mipmaps[level] = canvas
            },
            undefined, // onProgress callback currently not supported
            function(err) {
                console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
            }
        )
    }
}

export { MyTexture };
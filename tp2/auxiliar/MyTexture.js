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
            this.texture.needsUpdate = true
        }
        else {
            this.texture.magFilter = textureData.magFilter;
            this.texture.minFilter = textureData.minFilter;
        }
        
        this.texture.anisotropy = textureData.anisotropy;
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
    }

    loadMipmap(parentTexture, level, path)
    {
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
import * as THREE from 'three';

class MyCarpet extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} width The width of the carpet
       @param {number} height The height of the carpet
       @param {number} depth The depth of the carpet
       @param {color} color The color of the carpet
       @param {carpetTexture} carpetTexture The texture for the carpet
       */ 
    constructor(app, width, height, depth, color, carpetTexture) {
        super();
        this.app = app;

        this.carpet = new THREE.BoxGeometry(width, height, depth);

        let carpetUVRate = width / depth;
        let textureUVRate = 459 / 612; // image dimensions
        let textureRepeatU = 1;
        let textureRepeatV = textureRepeatU * carpetUVRate * textureUVRate;
        carpetTexture.wrapS = THREE.MirroredRepeatWrapping;
        carpetTexture.wrapT = THREE.MirroredRepeatWrapping;
        carpetTexture.repeat.set(textureRepeatU, textureRepeatV );

        this.carpetMaterial = new THREE.MeshPhongMaterial({color: color, specular:color, shininess:5, map:carpetTexture, opacity:0.7});
        
        this.carpetMesh = new THREE.Mesh(this.carpet, this.carpetMaterial);
        this.carpetMesh.receiveShadow = true;
        this.add(this.carpetMesh);
    }

    changeColor(color) {
        this.carpetMesh.material.color = new THREE.Color(color);
    }

}

export { MyCarpet };
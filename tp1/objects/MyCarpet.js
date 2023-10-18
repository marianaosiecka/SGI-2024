import * as THREE from 'three';

class MyCarpet extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, width, height, depth, color, carpetTexture) {
        super();
        this.app = app;

        this.carpet = new THREE.BoxGeometry(width, height, depth);

        let carpetUVRate = width / depth;
        let textureUVRate = 459 / 612; // image dimensions
        let textureRepeatU = 1.5;
        let textureRepeatV = textureRepeatU * carpetUVRate * textureUVRate;
        carpetTexture.wrapS = THREE.RepeatWrapping;
        carpetTexture.wrapT = THREE.RepeatWrapping;
        carpetTexture.rotation = Math.PI/4;
        carpetTexture.repeat.set(textureRepeatU, textureRepeatV );
        carpetTexture.offset = new THREE.Vector2(0,1);

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
import * as THREE from 'three';

class MyPillow extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, width, height, depth, color, texture) {      
        super();
        this.app = app;
        
        let pillowUVRate = width / height;
        let textureUVRate = 654 / 1002; // image dimensions
        let textureRepeatU = 1.5;
        let textureRepeatV = textureRepeatU * pillowUVRate * textureUVRate;
        texture.wrapS = THREE.MirroredRepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.repeat.set(textureRepeatU, textureRepeatV );
        texture.rotation = Math.PI/6;
        texture.offset = new THREE.Vector2(0,0);
        this.pillowMaterial = new THREE.MeshPhongMaterial({ color: color , specular:"#777777", shininess:6, map: texture});
        
        this.pillow = new THREE.BoxGeometry(width, height, depth);         
        this.pillowMesh = new THREE.Mesh(this.pillow, this.pillowMaterial);
        this.pillowMesh.rotation.z = Math.PI/2;
        this.add(this.pillowMesh);
    }

}

export { MyPillow };
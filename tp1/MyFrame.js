import * as THREE from 'three';

class MyFrame extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, width, height, depth, x, y, z, color, picturePath) {
        super();
        this.app = app;
        this.type = 'Group';

        this.frame = new THREE.BoxGeometry(width, height, depth);
        this.frameMaterial = new THREE.MeshBasicMaterial({ color: color });
        this.frameMesh = new THREE.Mesh(this.frame, this.frameMaterial);
        this.frameMesh.position.x = x;
        this.frameMesh.position.y = y;
        this.frameMesh.position.z = z;

        this.picture = new THREE.PlaneGeometry(width-0.3, height-0.3);
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(picturePath);
        this.pictureMaterial = new THREE.MeshBasicMaterial({ map: texture });
        this.pictureMesh = new THREE.Mesh(this.picture, this.pictureMaterial);
        this.pictureMesh.rotateY(Math.PI)
        this.pictureMesh.position.x = x;
        this.pictureMesh.position.y = y;
        this.pictureMesh.position.z = z - depth/2 - 0.01;

        
        this.add(this.frameMesh);
        this.add(this.pictureMesh)
    }

    changeColor(color) {
        this.frame.material.color = new THREE.Color(color);
    }
}


MyFrame.prototype.isGroup = true;
export { MyFrame };
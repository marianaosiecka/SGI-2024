import * as THREE from 'three';

class MyFrame extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, width, height, depth, color, picturePath) {
        super();
        this.app = app;
        this.type = 'Group';

        this.frame = new THREE.BoxGeometry(width, height, depth);
        this.frameMaterial = new THREE.MeshPhongMaterial({ color: color });
        this.frameMesh = new THREE.Mesh(this.frame, this.frameMaterial);


        this.picture = new THREE.PlaneGeometry(width-0.5, height-0.5);
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(picturePath);
        this.pictureMaterial = new THREE.MeshBasicMaterial({ map: texture, opacity: 0.8 });
        this.pictureMesh = new THREE.Mesh(this.picture, this.pictureMaterial);
        this.pictureMesh.rotateY(Math.PI)
        this.pictureMesh.position.z = - depth/2 - 0.03;

        
        this.add(this.frameMesh);
        this.add(this.pictureMesh)
    }

    changeColor(color) {
        this.frame.material.color = new THREE.Color(color);
    }
}


MyFrame.prototype.isGroup = true;
export { MyFrame };
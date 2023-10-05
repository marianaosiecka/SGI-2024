import * as THREE from 'three';

class MyWindow extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, width, height, depth, x, y, z, color) {
        super();
        this.app = app;
        this.type = 'Group';

        this.windowMaterial = new THREE.MeshBasicMaterial({ color: color });

        this.horizontal = new THREE.BoxGeometry(width, depth, depth);
        this.horizontal1Mesh = new THREE.Mesh(this.horizontal, this.windowMaterial);
        this.horizontal1Mesh.position.x = x;
        this.horizontal1Mesh.position.y = y + height/2;
        this.horizontal1Mesh.position.z = z;
        this.horizontal2Mesh = new THREE.Mesh(this.horizontal, this.windowMaterial);
        this.horizontal2Mesh.position.x = x;
        this.horizontal2Mesh.position.y = y - height/2;
        this.horizontal2Mesh.position.z = z;

        this.vertical = new THREE.BoxGeometry(depth, height, depth);
        this.verticall1Mesh = new THREE.Mesh(this.vertical, this.windowMaterial);
        this.verticall1Mesh.position.x = x + width/2;
        this.verticall1Mesh.position.y = y;
        this.verticall1Mesh.position.z = z;
        this.verticall2Mesh = new THREE.Mesh(this.vertical, this.windowMaterial);
        this.verticall2Mesh.position.x = x - width/2;
        this.verticall2Mesh.position.y = y;
        this.verticall2Mesh.position.z = z;


        
        this.add(this.horizontal1Mesh);
        this.add(this.horizontal2Mesh);
        this.add(this.verticall1Mesh);
        this.add(this.verticall2Mesh);

    }

    changeColor(color) {
        this.window.material.color = new THREE.Color(color);
    }
}


MyWindow.prototype.isGroup = true;
export { MyFrame };
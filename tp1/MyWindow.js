import * as THREE from 'three';

class MyWindow extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, width, height, depth, color, texture) {
        super();
        this.app = app;
        this.type = 'Group';

        this.windowMaterial = new THREE.MeshPhongMaterial({ color: color });

        // FRAME
        this.frameHorizontal = new THREE.BoxGeometry(width, width/10, depth);
        this.frameHorizontalTopMesh = new THREE.Mesh(this.frameHorizontal, this.windowMaterial);
        this.frameHorizontalTopMesh.position.y = height/2;
        this.frameHorizontalDownMesh =  new THREE.Mesh(this.frameHorizontal, this.windowMaterial);
        this.frameHorizontalDownMesh.position.y = -height/2;

        this.frameVertical = new THREE.BoxGeometry(height, width/10, depth);

        /*

        this.horizontal = new THREE.BoxGeometry(width, depth, depth);
        this.horizontal1Mesh = new THREE.Mesh(this.horizontal, this.windowMaterial);
        this.horizontal1Mesh.position.y = height/2 - depth/2;
        this.horizontal2Mesh = new THREE.Mesh(this.horizontal, this.windowMaterial);
        this.horizontal2Mesh.position.y = - height/2 + depth/2;

        this.vertical = new THREE.BoxGeometry(depth, height, depth);
        this.verticall1Mesh = new THREE.Mesh(this.vertical, this.windowMaterial);
        this.verticall1Mesh.position.x = width/2;
        this.verticall2Mesh = new THREE.Mesh(this.vertical, this.windowMaterial);
        this.verticall2Mesh.position.x = - width/2;

        this.window = new THREE.PlaneGeometry(width - depth, height - depth);
        this.windowMaterial = new THREE.MeshBasicMaterial({ color: "#FFFFFF", transparent: true, opacity: 0.1 })
        this.windowMesh = new THREE.Mesh(this.window, this.windowMaterial)
        this.windowMesh.position.z = 0.2
        
        this.view = new THREE.PlaneGeometry(width - depth, height - depth)
        this.viewMaterial = new THREE.MeshBasicMaterial({ map: texture })
        this.viewMesh = new THREE.Mesh(this.view, this.viewMaterial);
        
        this.add(this.horizontal1Mesh);
        this.add(this.horizontal2Mesh);
        this.add(this.verticall1Mesh);
        this.add(this.verticall2Mesh);
        this.add(this.windowMesh);
        this.add(this.viewMesh)
        */
       this.add(this.frameHorizontalTopMesh)
       this.add(this.frameHorizontalDownMesh)
    }

    changeColor(color) {
        this.window.material.color = new THREE.Color(color);
    }
}


MyWindow.prototype.isGroup = true;
export { MyWindow };
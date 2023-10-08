import * as THREE from 'three';

class MyCoffeeTable extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, width, height, depth, color) {
        super();
        this.app = app;
        this.type = 'Group';
        this.sideHeight = depth/3.5;
        this.halfSideWidth = height/2;

        this.tableMaterial = new THREE.MeshPhongMaterial({color: color, specular:color, shininess:5});
        this.top = new THREE.BoxGeometry(width, height, depth);
        this.topMesh = new THREE.Mesh(this.top, this.tableMaterial);
        this.topMesh.position.y = height + this.sideHeight;
        this.add(this.topMesh);

        this.left = new THREE.BoxGeometry(width, height, this.sideHeight);
        this.leftMesh = new THREE.Mesh(this.left, this.tableMaterial);
        this.leftMesh.rotation.x = Math.PI/2;
        this.leftMesh.position.y = height+this.sideHeight/2;
        this.leftMesh.position.z = depth/2 - this.halfSideWidth;
        this.add(this.leftMesh);

        this.right = new THREE.BoxGeometry(width, height, this.sideHeight);
        this.rightMesh = new THREE.Mesh(this.right, this.tableMaterial);
        this.rightMesh.rotation.x = Math.PI/2;
        this.rightMesh.position.y = height+this.sideHeight/2;
        this.rightMesh.position.z = -depth/2 + this.halfSideWidth;
        this.add(this.rightMesh);

        this.bottom = new THREE.BoxGeometry(width, height, depth);
        this.bottomMesh = new THREE.Mesh(this.bottom, this.tableMaterial);
        this.bottomMesh.position.y = this.halfSideWidth;
        this.add(this.bottomMesh);
        
    }
}


MyCoffeeTable.prototype.isGroup = true;
export { MyCoffeeTable };
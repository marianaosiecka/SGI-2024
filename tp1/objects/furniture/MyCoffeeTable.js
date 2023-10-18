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
        this.width = width;
        this.height = height;
        this.sideHeight = depth/3.5;
        this.halfSideWidth = height/2;

        this.tableMaterial = new THREE.MeshPhongMaterial({color: color, specular:color, shininess:5});
        this.top = new THREE.BoxGeometry(width, height, depth);
        this.topMesh = new THREE.Mesh(this.top, this.tableMaterial);
        this.topMesh.position.y = height + this.sideHeight;
        this.topMesh.receiveShadow = true;
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

    buildBooks(bookColors){
        const bookY = this.rightMesh.position.y - this.height/2;
        const bookZ = -this.rightMesh.position.z - this.height;
        this.book = new THREE.BoxGeometry(0.08, this.sideHeight - this.sideHeight*0.2, this.width - this.width*0.3);
        this.book1Material = new THREE.MeshPhongMaterial({ color: bookColors[0], specular: bookColors[0], shininess:3 });
        this.book1Mesh = new THREE.Mesh(this.book, this.book1Material);
        this.book1Mesh.rotation.y = Math.PI/2;
        this.book1Mesh.position.y = bookY;
        this.book1Mesh.position.z = bookZ + 0.04;

        this.book2Material = new THREE.MeshPhongMaterial({ color: bookColors[1], specular: bookColors[1], shininess:3 });
        this.book2Mesh = new THREE.Mesh(this.book, this.book2Material);
        this.book2Mesh.rotation.y = Math.PI/2;
        this.book2Mesh.position.y = bookY;
        this.book2Mesh.position.z = bookZ - 0.05;

        this.book3Material = new THREE.MeshPhongMaterial({ color: bookColors[2], specular: bookColors[2], shininess:3 });
        this.book3Mesh = new THREE.Mesh(this.book, this.book3Material);
        this.book3Mesh.rotation.y = Math.PI/2;
        this.book3Mesh.position.y = bookY;
        this.book3Mesh.position.z = bookZ - 0.15;

        this.book4Material = new THREE.MeshPhongMaterial({ color: bookColors[3], specular: bookColors[3], shininess:3 });
        this.book4Mesh = new THREE.Mesh(this.book, this.book4Material);
        this.book4Mesh.rotation.y = Math.PI/2;
        this.book4Mesh.position.y = bookY;
        this.book4Mesh.position.z = bookZ - 0.24;

        this.book5Material = new THREE.MeshPhongMaterial({ color: bookColors[4], specular: bookColors[4], shininess:3 });
        this.book5Mesh = new THREE.Mesh(this.book, this.book5Material);
        this.book5Mesh.rotation.y = Math.PI/2;
        this.book5Mesh.position.y = bookY;
        this.book5Mesh.position.z = bookZ - 0.33;

        this.book6Material = new THREE.MeshPhongMaterial({ color: bookColors[5], specular: bookColors[5], shininess:3 });
        this.book6Mesh = new THREE.Mesh(this.cover, this.cover6Material);
        this.book6Mesh.rotation.y = Math.PI/2;
        this.book6Mesh.position.y = bookY;
        this.book6Mesh.position.z = bookZ - 0.42;

        this.book7Mesh = new THREE.Mesh(this.book, this.book1Material);
        this.book7Mesh.rotation.y = Math.PI/2;
        this.book7Mesh.rotation.x = Math.PI/8
        this.book7Mesh.position.y = bookY;
        this.book7Mesh.position.z = bookZ - 0.5;

        this.book8Mesh = new THREE.Mesh(this.book, this.book3Material);
        this.book8Mesh.rotation.y = Math.PI/2;
        this.book8Mesh.position.y = bookY;
        this.book8Mesh.position.z = -bookZ - 0.04;

        this.book9Mesh = new THREE.Mesh(this.book, this.book5Material);
        this.book9Mesh.rotation.y = Math.PI/2;
        this.book9Mesh.position.y = bookY;
        this.book9Mesh.position.z = -bookZ + 0.05;

        this.book10Mesh = new THREE.Mesh(this.book, this.book1Material);
        this.book10Mesh.rotation.y = Math.PI/2;
        this.book10Mesh.position.y = bookY;
        this.book10Mesh.position.z = -bookZ + 0.15;

        this.book11Mesh = new THREE.Mesh(this.book, this.book2Material);
        this.book11Mesh.rotation.y = Math.PI/2;
        this.book11Mesh.position.y = bookY;
        this.book11Mesh.position.z = -bookZ + 0.24;

        this.book12Mesh = new THREE.Mesh(this.book, this.book6Material);
        this.book12Mesh.rotation.y = Math.PI/2;
        this.book12Mesh.position.y = bookY;
        this.book12Mesh.rotation.x = -Math.PI/14;
        this.book12Mesh.position.z = -bookZ + 0.37;

        this.add(this.book1Mesh)
        this.add(this.book2Mesh)
        this.add(this.book3Mesh)
        this.add(this.book4Mesh)
        this.add(this.book5Mesh)
        this.add(this.book6Mesh)
        this.add(this.book7Mesh)
        this.add(this.book8Mesh)
        this.add(this.book9Mesh)
        this.add(this.book10Mesh)
        this.add(this.book11Mesh)
        this.add(this.book12Mesh)
    }
}


MyCoffeeTable.prototype.isGroup = true;
export { MyCoffeeTable };
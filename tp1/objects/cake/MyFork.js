import * as THREE from 'three';

class MyFork extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, height, width, depth, color) {
        super();
        this.app = app;
        this.type = 'Group';

        this.forkMaterial = new THREE.MeshPhongMaterial({ color : color, shininess: 50, specular: 0xffffff})
        
        // TINES
        this.tine = new THREE.ConeGeometry(width/10, height/5, 10);

        this.tineMesh1 = new THREE.Mesh(this.tine, this.forkMaterial);
        this.tineMesh1.scale.x = 0.43
        this.tineMesh1.rotation.z = Math.PI / 2;
        this.tineMesh1.position.x = - height/7 - height/10;
        this.tineMesh1.position.z = width/2 - width/10;

        this.tineMesh2 = new THREE.Mesh(this.tine, this.forkMaterial);
        this.tineMesh2.scale.x = 0.43
        this.tineMesh2.rotation.z = Math.PI / 2;
        this.tineMesh2.position.x = - height/7 - height/10;
        this.tineMesh2.position.z = width/2 - 5 * width/14;

        this.tineMesh3 = new THREE.Mesh(this.tine, this.forkMaterial);
        this.tineMesh3.scale.x = 0.43
        this.tineMesh3.rotation.z = Math.PI / 2;
        this.tineMesh3.position.x = - height/7 - height/10;
        this.tineMesh3.position.z = -width/2 + width/10;

        this.tineMesh4 = new THREE.Mesh(this.tine, this.forkMaterial);
        this.tineMesh4.scale.x = 0.43
        this.tineMesh4.rotation.z = Math.PI / 2;
        this.tineMesh4.position.x = - height/7 - height/10;
        this.tineMesh4.position.z = -width/2 + 5*width/14;

        
        // NECK 
        this.neck = new THREE.SphereGeometry(width/2, 10, 10, Math.PI/2, Math.PI);
        this.neckMesh = new THREE.Mesh(this.neck, this.forkMaterial)
        this.neckMesh.scale.y = 0.18
        this.neckMesh.scale.x = 2.3
        this.neckMesh.position.x = -height/7


        // HANDLE
        this.handle = new THREE.BoxGeometry(3*height/4, depth, 2*width/3-0.2)
        this.handleMesh = new THREE.Mesh(this.handle, this.forkMaterial)
        this.handleMesh.position.x = height/3-0.3

        this.add(this.tineMesh1)
        this.add(this.tineMesh2)
        this.add(this.tineMesh3)
        this.add(this.tineMesh4)
        this.add(this.neckMesh)
        this.add(this.handleMesh)
        
    }

    changeColor(color) {
        this.material.color = new THREE.Color(color);
    }
}


MyFork.prototype.isGroup = true;
export { MyFork };
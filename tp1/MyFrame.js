import * as THREE from 'three';

class MyFrame extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, width, height, depth, colorFrame, colorBorder, texture) {
        super();
        this.app = app;
        this.type = 'Group';

        // FRAME
        this.frameMaterial = new THREE.MeshPhongMaterial({ color: colorFrame });

        const borderFrame = height > width ? width/10 : height/10;

        this.upDown = new THREE.BoxGeometry(depth, borderFrame, width);
        this.upMesh = new THREE.Mesh(this.upDown, this.frameMaterial);
        this.upMesh.position.y = height/2 - borderFrame/2;
        this.downMesh = new THREE.Mesh(this.upDown, this.frameMaterial);
        this.downMesh.position.y = -height/2 + borderFrame/2;

        this.sides = new THREE.BoxGeometry(depth, height, borderFrame);
        this.leftMesh = new THREE.Mesh(this.sides, this.frameMaterial);
        this.leftMesh.position.z = width/2 - borderFrame/2;
        this.rightMesh = new THREE.Mesh(this.sides, this.frameMaterial);
        this.rightMesh.position.z = -width/2 + borderFrame/2;

        // INSIDE BORDER
        const borderInside = height > width ? width/9 : height/9;
        this.insideBorderMaterial = new THREE.MeshBasicMaterial({ color: colorBorder })
        this.insideBorder = new THREE.PlaneGeometry(width - borderFrame*2, height - borderFrame*2);
        this.insideBorderMesh = new THREE.Mesh(this.insideBorder, this.insideBorderMaterial);
        this.insideBorderMesh.rotation.y = Math.PI / 2;
        this.insideBorderMesh.position.x = -depth/2;

        // PICTURE
        this.picture = new THREE.PlaneGeometry(width - borderFrame*2 - borderInside*2, height- borderFrame*2 - borderInside*2);
        this.pictureMaterial = new THREE.MeshBasicMaterial({ map: texture });
        this.pictureMesh = new THREE.Mesh(this.picture, this.pictureMaterial);
        this.pictureMesh.rotation.y = Math.PI / 2;
        this.pictureMesh.position.x = - depth/2 + 0.02;

        // GLASS
        this.glassMaterial = new THREE.MeshPhongMaterial({ transparent: true, opacity: 0.2, color: 0xffffff, specular: 0xffffff, shininess:40 });
        this.glassMesh = new THREE.Mesh(this.insideBorder, this.glassMaterial); 
        this.glassMesh.rotation.y = Math.PI / 2;
        this.glassMesh.position.x = depth/2 - 0.01;

        this.add(this.upMesh)
        this.add(this.downMesh)
        this.add(this.leftMesh)
        this.add(this.rightMesh)
        this.add(this.insideBorderMesh)
        this.add(this.pictureMesh);
        this.add(this.glassMesh)
    }

    addObject(object){
        this.add(object);
    }
    
    changeColor(color) {
        this.frame.material.color = new THREE.Color(color);
    }
}


MyFrame.prototype.isGroup = true;
export { MyFrame };
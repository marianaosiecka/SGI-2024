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

        this.width = width;
        this.height = height;
        this.depth = depth;

        this.windowMaterial = new THREE.MeshPhongMaterial({ color: color });

        // FRAME
        this.frameHorizontal = new THREE.BoxGeometry(width, width/10, depth);
        this.frameTopMesh = new THREE.Mesh(this.frameHorizontal, this.windowMaterial);
        this.frameTopMesh.position.y = height/2;
        this.frameDownMesh =  new THREE.Mesh(this.frameHorizontal, this.windowMaterial);
        this.frameDownMesh.position.y = -height/2;

        this.frameVertical = new THREE.BoxGeometry(width/10, height + width/10, depth);
        this.frameRightMesh = new THREE.Mesh(this.frameVertical, this.windowMaterial);
        this.frameRightMesh.position.x = width/2 - depth/10
        this.frameLeftMesh =  new THREE.Mesh(this.frameVertical, this.windowMaterial);
        this.frameLeftMesh.position.x = -width/2 + depth/10


        // BOTTOM UP PART
        this.centerFrameUpHorizontal = new THREE.BoxGeometry(width, width/14, depth/3);
        this.centerFrameUpTopMesh = new THREE.Mesh(this.centerFrameUpHorizontal, this.windowMaterial);
        this.centerFrameUpTopMesh.position.y = height/2 - width/10 + width/28;
        this.centerFrameUpTopMesh.position.z = -depth/3;
        this.centerFrameUpDownMesh = new THREE.Mesh(this.centerFrameUpHorizontal, this.windowMaterial);
        this.centerFrameUpDownMesh.position.z = -depth/3;

        this.centerFrameUpVertical = new THREE.BoxGeometry(width/14, height/2, depth/3);
        this.centerFrameUpRightMesh = new THREE.Mesh(this.centerFrameUpVertical, this.windowMaterial);
        this.centerFrameUpRightMesh.position.z = -depth/3;
        this.centerFrameUpRightMesh.position.x = width/2 - width/10;
        this.centerFrameUpRightMesh.position.y = height/4;
        this.centerFrameUpLeftMesh = new THREE.Mesh(this.centerFrameUpVertical, this.windowMaterial);
        this.centerFrameUpLeftMesh.position.z = -depth/3;
        this.centerFrameUpLeftMesh.position.x = - width/2 + width/10;
        this.centerFrameUpLeftMesh.position.y = height/4;

        this.horizontalLine = new THREE.BoxGeometry(width, width/100, depth/3);
        this.horizontalLineMesh = new THREE.Mesh(this.horizontalLine, this.windowMaterial);
        this.horizontalLineMesh.position.y = height/4 - width/10 + width/28;
        this.horizontalLineMesh.position.z = - depth/3
        this.verticalLine = new THREE.BoxGeometry(width/100, height/2, depth/3);
        this.verticalLineMesh1 = new THREE.Mesh(this.verticalLine, this.windowMaterial);
        this.verticalLineMesh1.position.y = height/4;
        this.verticalLineMesh1.position.x = width/4 - width/8;
        this.verticalLineMesh1.position.z = -depth/3;
        this.verticalLineMesh2 = new THREE.Mesh(this.verticalLine, this.windowMaterial);
        this.verticalLineMesh2.position.y = height/4;
        this.verticalLineMesh2.position.x = -width/4 + width/8
        this.verticalLineMesh2.position.z = -depth/3;

        this.glass = new THREE.PlaneGeometry(width, height/2);
        this.glassMaterial = new THREE.MeshPhongMaterial({ transparent: true, opacity: 0.2, color: 0xffffff, specular: 0xffffff, shininess:40 });
        this.upGlassMesh = new THREE.Mesh(this.glass, this.glassMaterial);
        this.upGlassMesh.position.z = -depth/3
        this.upGlassMesh.position.y = height/4

        this.add(this.frameTopMesh);
        this.add(this.frameDownMesh);
        this.add(this.frameLeftMesh);
        this.add(this.frameRightMesh);

        this.add(this.centerFrameUpTopMesh);
        this.add(this.centerFrameUpDownMesh);
        this.add(this.centerFrameUpRightMesh);
        this.add(this.centerFrameUpLeftMesh);
        this.add(this.horizontalLineMesh);
        this.add(this.verticalLineMesh1)
        this.add(this.verticalLineMesh2)
        this.add(this.upGlassMesh)
       
       
    }

    bottomDownPart(y = 0){
        const width = this.width;
        const height = this.height;
        const depth = this.depth;

        this.centerFrameDownHorizontal = new THREE.BoxGeometry(width, width/14, 2*depth/3);
        this.centerFrameDownTopMesh = new THREE.Mesh(this.centerFrameDownHorizontal, this.windowMaterial);
        this.centerFrameDownTopMesh.position.z = depth/6;
        this.centerFrameDownTopMesh.position.y = y;
        this.centerFrameDownDownMesh = new THREE.Mesh(this.centerFrameDownHorizontal, this.windowMaterial);
        this.centerFrameDownDownMesh.position.z = depth/6;
        this.centerFrameDownDownMesh.position.y = -height/2 + width/10 - width/28 + y;

        this.centerFrameDownVertical = new THREE.BoxGeometry(width/14, height/2, 2*depth/3);
        this.centerFrameDownRightMesh = new THREE.Mesh(this.centerFrameDownVertical, this.windowMaterial);
        this.centerFrameDownRightMesh.position.z = depth/6;
        this.centerFrameDownRightMesh.position.x = width/2 - width/10;
        this.centerFrameDownRightMesh.position.y = -height/4 + y;
        this.centerFrameDownLeftMesh = new THREE.Mesh(this.centerFrameDownVertical, this.windowMaterial);
        this.centerFrameDownLeftMesh.position.z = depth/6;
        this.centerFrameDownLeftMesh.position.x = - width/2 + width/10;
        this.centerFrameDownLeftMesh.position.y = -height/4 + y;

        this.downGlassMesh = new THREE.Mesh(this.glass, this.glassMaterial);
        this.downGlassMesh.position.y = -height/4 + y
        this.downGlassMesh.position.z = depth/3 - depth/6

        this.add(this.centerFrameDownTopMesh);
        this.add(this.centerFrameDownDownMesh);
        this.add(this.centerFrameDownRightMesh);
        this.add(this.centerFrameDownLeftMesh);
        this.add(this.downGlassMesh)
    }



    changeColor(color) {
        this.window.material.color = new THREE.Color(color);
    }
}


MyWindow.prototype.isGroup = true;
export { MyWindow };
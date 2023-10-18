import * as THREE from 'three';

class MyCeilingLamp extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, width, height, depth, color, lightColor, highlight, light) {
        super();
        this.app = app;
        this.type = 'Group';
        this.sideWidth = depth/2;
        this.sideDepth = width/3;

        this.lampMaterial = new THREE.MeshPhongMaterial({color: color, specular:color, shininess:5});
        this.front = new THREE.BoxGeometry(width, height, depth);
        this.frontMesh = new THREE.Mesh(this.front, this.lampMaterial);
        this.add(this.frontMesh);

        this.side = new THREE.BoxGeometry(this.sideWidth, height, this.sideDepth);
        this.leftMesh = new THREE.Mesh(this.side, this.lampMaterial);
        this.leftMesh.position.x = -width/2 - this.sideWidth/2;
        this.leftMesh.position.z = depth/2 - this.sideDepth/2;
        this.add(this.leftMesh);

        this.rightMesh = new THREE.Mesh(this.side, this.lampMaterial);
        this.rightMesh.position.x = -width/2 - this.sideWidth/2;
        this.rightMesh.position.z = -depth/2 + this.sideDepth/2;
        this.add(this.rightMesh);

        this.bottomWidth = width + this.sideWidth;
        this.bottomHeight = height/5;
        this.bottom = new THREE.BoxGeometry(this.bottomWidth, this.bottomHeight, depth);
        this.bottomMesh = new THREE.Mesh(this.bottom, this.lampMaterial);
        this.bottomMesh.position.x = -this.bottomWidth/2 + width/2;
        this.bottomMesh.position.y = -height/2 - this.bottomHeight/2;
        this.add(this.bottomMesh);

        this.topMesh = new THREE.Mesh(this.bottom, this.lampMaterial);
        this.topMesh.position.x = -this.bottomWidth/2 + width/2;
        this.topMesh.position.y = height/2 + this.bottomHeight/2;
        this.add(this.topMesh);

        this.light = new THREE.BoxGeometry(this.sideWidth/2, height, depth-depth*0.2);
        this.lightMaterial = new THREE.MeshPhongMaterial({color: lightColor, specular:"#FFFFFF", shininess:5});
        this.lightMesh = new THREE.Mesh(this.light, this.lightMaterial);
        this.lightMesh.position.x = -width - this.sideWidth/4;
        this.add(this.lightMesh);

        highlight.target = this.lightMesh;
        this.add(highlight)
        
        this.add(light);
    }
}


MyCeilingLamp.prototype.isGroup = true;
export { MyCeilingLamp };
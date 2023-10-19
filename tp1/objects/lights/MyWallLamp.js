import * as THREE from 'three';

class MyWallLamp extends THREE.Object3D  {

    /**
     * Constructs the object.
     * @param {MyApp} app - The application object.
     * @param {number} width - The width of the wall lamp.
     * @param {number} height - The height of the wall lamp.
     * @param {number} depth - The depth of the wall lamp.
     * @param {number} color - The color of the lamp material.
     * @param {Light} light - The light source for the wall lamp.
     */ 
    constructor(app, width, height, depth, color, light) {
        super();
        this.app = app;
        this.type = 'Group';
        this.sideWidth = depth/2;
        this.sideDepth = width/3;

        this.lampMaterial = new THREE.MeshPhongMaterial({color: color, specular:color, shininess:5});
        
        //front of the lamp box
        this.front = new THREE.BoxGeometry(width, height, depth);
        this.frontMesh = new THREE.Mesh(this.front, this.lampMaterial);
        this.add(this.frontMesh);

        //side of the box geometry
        this.side = new THREE.BoxGeometry(this.sideWidth, height, this.sideDepth);
        
        //left side
        this.leftMesh = new THREE.Mesh(this.side, this.lampMaterial);
        this.leftMesh.position.x = -width/2 - this.sideWidth/2;
        this.leftMesh.position.z = depth/2 - this.sideDepth/2;
        this.add(this.leftMesh);

        //right side
        this.rightMesh = new THREE.Mesh(this.side, this.lampMaterial);
        this.rightMesh.position.x = -width/2 - this.sideWidth/2;
        this.rightMesh.position.z = -depth/2 + this.sideDepth/2;
        this.add(this.rightMesh);

        //bottom of the lamp box
        this.bottomWidth = width + this.sideWidth;
        this.bottomHeight = height/5;
        this.bottom = new THREE.BoxGeometry(this.bottomWidth, this.bottomHeight, depth);
        this.bottomMesh = new THREE.Mesh(this.bottom, this.lampMaterial);
        this.bottomMesh.position.x = -this.bottomWidth/2 + width/2;
        this.bottomMesh.position.y = -height/2 - this.bottomHeight/2;
        this.add(this.bottomMesh);
        
        this.add(light);
    }
}


MyWallLamp.prototype.isGroup = true;
export { MyWallLamp };
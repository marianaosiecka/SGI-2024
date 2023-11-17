import * as THREE from 'three';

class MyCeilingLamp extends THREE.Object3D {

    /**
    * Constructs the object.
    * @param {MyApp} app - The application object.
    * @param {number} width - The width of the lamp.
    * @param {number} height - The height of the lamp.
    * @param {number} depth - The depth of the lamp.
    * @param {number} color - The color of the lamp material.
    * @param {number} lightColor - The color of the light material.
    * @param {Object3D} highlight - The bulb highlight.
    * @param {Light} light - The light source for the lamp.
    */
    constructor(app, width, height, depth, color, lightColor, highlight, light) {
        // 0.1, 0.4, 0.6,
        super();
        this.app = app;
        this.type = 'Group';
        this.sideWidth = depth / 2;
        this.sideDepth = width / 3;

        this.lampMaterial = new THREE.MeshPhongMaterial({ color: color, specular: color, shininess: 5 });
        
        //top of the lamp box
        this.top = new THREE.BoxGeometry(width, height, depth);
        this.topMesh = new THREE.Mesh(this.top, this.lampMaterial);
        this.add(this.topMesh);

        this.side = new THREE.BoxGeometry(this.sideWidth, height, this.sideDepth);
        //left side of the lamp box (the smallest)
        this.leftMesh = new THREE.Mesh(this.side, this.lampMaterial);
        this.leftMesh.position.x = -width / 2 - this.sideWidth / 2;
        this.leftMesh.position.z = depth / 2 - this.sideDepth / 2;
        this.add(this.leftMesh);

        //right side of the lamp box (the smallest)
        this.rightMesh = new THREE.Mesh(this.side, this.lampMaterial);
        this.rightMesh.position.x = -width / 2 - this.sideWidth / 2;
        this.rightMesh.position.z = -depth / 2 + this.sideDepth / 2;
        this.add(this.rightMesh);

        this.backWidth = width + this.sideWidth;
        this.backHeight = height / 5;
        
        //back of the lamp box
        this.back = new THREE.BoxGeometry(this.backWidth, this.backHeight, depth);
        this.backMesh = new THREE.Mesh(this.back, this.lampMaterial);
        this.backMesh.position.x = -this.backWidth / 2 + width / 2;
        this.backMesh.position.y = -height / 2 - this.backHeight / 2;
        this.add(this.backMesh);

        //front of the lamp box
        this.frontMesh = new THREE.Mesh(this.back, this.lampMaterial);
        this.frontMesh.position.x = -this.backWidth / 2 + width / 2;
        this.frontMesh.position.y = height / 2 + this.backHeight / 2;
        this.add(this.frontMesh);

        //light bulb
        this.light = new THREE.BoxGeometry(this.sideWidth / 2, height, depth - depth * 0.2);
        this.lightMaterial = new THREE.MeshPhongMaterial({ color: lightColor, specular: "#FFFFFF", shininess: 5 });
        this.lightMesh = new THREE.Mesh(this.light, this.lightMaterial);
        this.lightMesh.position.x = -width - this.sideWidth / 4;
        this.add(this.lightMesh);

        //light bulb highlight (makes it look like the light is turned on)
        highlight.target = this.lightMesh;
        this.add(highlight)

        this.add(light);
    }
}


MyCeilingLamp.prototype.isGroup = true;
export { MyCeilingLamp };
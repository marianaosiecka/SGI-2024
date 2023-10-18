import * as THREE from 'three';

class MyDoor extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app, height, width, depth, color, knobColor) {
        super();
        this.app = app;
        this.type = 'Group';

        this.height = height;
        this.width = width;
        this.depth = depth;

        this.material = new THREE.MeshPhongMaterial({ color: color });
        this.knobMaterial = new THREE.MeshPhongMaterial({ color: knobColor })

        // frame
        let frameUp = new THREE.BoxGeometry(depth, 0.07 * height, width);
        let frameUpMesh = new THREE.Mesh(frameUp, this.material);
        frameUpMesh.position.y = height / 2 - (0.07 * height) / 2;
        this.add(frameUpMesh)

        let frameSides = new THREE.BoxGeometry(depth, height, 0.14 * width);
        let frameRightMesh = new THREE.Mesh(frameSides, this.material);
        frameRightMesh.position.z = width / 2 - (0.14 * width) / 2;
        this.add(frameRightMesh);
        let frameLeftMesh = new THREE.Mesh(frameSides, this.material);
        frameLeftMesh.position.z = -width / 2 + (0.14 * width) / 2;
        this.add(frameLeftMesh);
    }

    buildDoor(angle) {
        const doorHeight = this.height - 0.07 * this.height;
        const doorWidth = this.width - 2 * 0.14 * this.width;
        const doorDepth = 2 * this.depth / 3;
        const doorY = - 0.07 * this.height / 2

        let door = new THREE.BoxGeometry(doorDepth, doorHeight, doorWidth);
        let doorMesh = new THREE.Mesh(door, this.material);
        doorMesh.position.x = -this.depth/2 + doorDepth/2;
        doorMesh.position.y = doorY;
        //doorMesh.rotation.y = Math.cos(angle);
        this.add(doorMesh);

        
        const rectanglesBorder = 0.02 * doorHeight;
        const rectanglesWidth = 0.65 * doorWidth;
        const rectanglesDepth = 0.1 * doorDepth;
        const rectanglesX = -this.depth/2 + doorDepth + rectanglesDepth;
        const topRectangleHeight = 0.55 * doorHeight;
        const downRectangleHeight = 0.2 * doorHeight

        // TOP
        let topRectangleHorizontal = new THREE.BoxGeometry(rectanglesDepth, rectanglesBorder, rectanglesWidth + rectanglesBorder);
        let topRectangleTopMesh = new THREE.Mesh(topRectangleHorizontal, this.material);
        topRectangleTopMesh.position.x = rectanglesX;
        topRectangleTopMesh.position.y = doorY + doorHeight/2 - topRectangleHeight / 8;
        //topRectangleTopMesh.rotation.y = Math.cos(angle);
        this.add(topRectangleTopMesh);
        let topRectangleDownMesh = new THREE.Mesh(topRectangleHorizontal, this.material);
        topRectangleDownMesh.position.x = rectanglesX;
        topRectangleDownMesh.position.y =  doorY + doorHeight/2 - topRectangleHeight / 8 - topRectangleHeight;
       // topRectangleDownMesh.rotation.y =Math.cos(angle);
        this.add(topRectangleDownMesh);

        let topRectangleVertical = new THREE.BoxGeometry(rectanglesDepth, topRectangleHeight, rectanglesBorder);
        let topRectangleRightMesh = new THREE.Mesh(topRectangleVertical, this.material);
        topRectangleRightMesh.position.x = rectanglesX;
        topRectangleRightMesh.position.y = doorY + doorHeight/2 - topRectangleHeight / 8 - topRectangleHeight/2;
        topRectangleRightMesh.position.z = -rectanglesWidth/2;
        //topRectangleRightMesh.rotation.y = Math.cos(angle);
        this.add(topRectangleRightMesh);
        let topRectangleLeftMesh = new THREE.Mesh(topRectangleVertical, this.material);
        topRectangleLeftMesh.position.x = rectanglesX;
        topRectangleLeftMesh.position.y = doorY + doorHeight/2 - topRectangleHeight / 8 - topRectangleHeight/2;
        topRectangleLeftMesh.position.z = rectanglesWidth/2;
       // topRectangleLeftMesh.rotation.y = Math.cos(angle);
        this.add(topRectangleLeftMesh);

        // DOWN
        let downRectangleHorizontal = new THREE.BoxGeometry(rectanglesDepth, rectanglesBorder, rectanglesWidth + rectanglesBorder);
        let downRectangledownMesh = new THREE.Mesh(downRectangleHorizontal, this.material);
        downRectangledownMesh.position.x = rectanglesX;
        downRectangledownMesh.position.y = doorY - doorHeight/2 + topRectangleHeight / 8 + downRectangleHeight;
        //downRectangledownMesh.rotation.y = Math.cos(angle);
        this.add(downRectangledownMesh);
        let downRectangleDownMesh = new THREE.Mesh(downRectangleHorizontal, this.material);
        downRectangleDownMesh.position.x = rectanglesX;
        downRectangleDownMesh.position.y =  doorY - doorHeight/2 + topRectangleHeight / 8;
        //downRectangleDownMesh.rotation.y = Math.cos(angle);
        this.add(downRectangleDownMesh);

        let downRectangleVertical = new THREE.BoxGeometry(rectanglesDepth, downRectangleHeight, rectanglesBorder);
        let downRectangleRightMesh = new THREE.Mesh(downRectangleVertical, this.material);
        downRectangleRightMesh.position.x = rectanglesX;
        downRectangleRightMesh.position.y = doorY - doorHeight/2 + topRectangleHeight / 8 + downRectangleHeight/2;
        downRectangleRightMesh.position.z = -rectanglesWidth/2;
       // downRectangleRightMesh.rotation.y = Math.cos(angle);
        this.add(downRectangleRightMesh);
        let downRectangleLeftMesh = new THREE.Mesh(downRectangleVertical, this.material);
        downRectangleLeftMesh.position.x = rectanglesX;
        downRectangleLeftMesh.position.y = doorY - doorHeight/2 + topRectangleHeight / 8 + downRectangleHeight/2;
        downRectangleLeftMesh.position.z = rectanglesWidth/2;
      //  downRectangleLeftMesh.rotation.y = Math.cos(angle);
        this.add(downRectangleLeftMesh);

        
        // KNOB
        let knobSphere = new THREE.CylinderGeometry(doorWidth / 25, doorWidth /25, doorDepth/10, 20, 20, false);
        let knobSphereMesh = new THREE.Mesh(knobSphere, this.knobMaterial);
        knobSphereMesh.position.x = rectanglesX + doorDepth/10/2;
        knobSphereMesh.position.y = -0.3;
        knobSphereMesh.position.z = doorWidth / 2 - 0.15
        knobSphereMesh.rotation.z = Math.PI / 2;
      //  knobSphereMesh.rotation.y = Math.cos(angle);
        this.add(knobSphereMesh);

        const knobHeight = 0.2;
        const knobWidth = 0.4;
        let knobCurve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, knobHeight, 0),
            new THREE.Vector3(0, knobHeight, 0),
            new THREE.Vector3(0, knobHeight, knobWidth),
        );

        const knob = new THREE.TubeGeometry(knobCurve, 10, doorWidth / 50, 10, false);
        const knobMesh = new THREE.Mesh(knob, this.knobMaterial);
        knobMesh.position.x = rectanglesX + doorDepth/10;
        knobMesh.position.y = -0.3;
        knobMesh.position.z = doorWidth / 2 - 0.15
        knobMesh.rotation.x = Math.PI
        knobMesh.rotation.z = -Math.PI / 2
    //    knobMesh.rotation.y = Math.cos(angle);
        this.add(knobMesh)

    }

}


MyDoor.prototype.isGroup = true;
export { MyDoor };
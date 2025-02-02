import * as THREE from 'three';

class MyFrame extends THREE.Object3D {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} width The width of the frame
       @param {number} height The height of the frame
       @param {number} depth The depth of the frame
       @param {string} colorFrame The color of the frame material
       @param {string} colorBorder The color of the inside border material
       @param {THREE.Texture} texture The texture to be used as the picture in the frame
     
    */
    constructor(app, width, height, depth, colorFrame, colorBorder, texture) {
        super();
        this.app = app;
        this.type = 'Group';

        // FRAME
        this.frameMaterial = new THREE.MeshPhongMaterial({ color: colorFrame });

        const borderFrame = height > width ? width / 10 : height / 10;

        // Create top and bottom parts of the frame
        this.horizontal = new THREE.BoxGeometry(depth, borderFrame, width);
        this.upMesh = new THREE.Mesh(this.horizontal, this.frameMaterial);
        this.upMesh.position.y = height / 2 - borderFrame / 2;
        this.downMesh = new THREE.Mesh(this.horizontal, this.frameMaterial);
        this.downMesh.position.y = -height / 2 + borderFrame / 2;
        
        // Create left and right parts of the frame
        this.sides = new THREE.BoxGeometry(depth, height, borderFrame);
        this.leftMesh = new THREE.Mesh(this.sides, this.frameMaterial);
        this.leftMesh.position.z = width / 2 - borderFrame / 2;
        this.rightMesh = new THREE.Mesh(this.sides, this.frameMaterial);
        this.rightMesh.position.z = -width / 2 + borderFrame / 2;

        // INSIDE BORDER
        const borderInside = height > width ? width / 9 : height / 9;
        this.insideBorderMaterial = new THREE.MeshBasicMaterial({ color: colorBorder });
        const widthInsideBorder = width - borderFrame * 2;
        const heightInsideBorder = height - borderFrame * 2;
        const depthInsideBorder = depth / 2;

        // Create top and bottom parts of the inside border
        this.upDownInside = new THREE.BoxGeometry(depthInsideBorder, borderInside, widthInsideBorder);
        this.upInsideMesh = new THREE.Mesh(this.upDownInside, this.insideBorderMaterial);
        this.upInsideMesh.position.x = -depthInsideBorder / 3;
        this.upInsideMesh.position.y = heightInsideBorder / 2 - borderInside / 2;
        this.downInsideMesh = new THREE.Mesh(this.upDownInside, this.insideBorderMaterial);
        this.downInsideMesh.position.y = -heightInsideBorder / 2 + borderInside / 2;
        this.downInsideMesh.position.x = -depthInsideBorder / 3;

        // Create left and right parts of the inside border
        this.sidesInside = new THREE.BoxGeometry(depthInsideBorder, heightInsideBorder, borderInside);
        this.leftInsideMesh = new THREE.Mesh(this.sidesInside, this.insideBorderMaterial);
        this.leftInsideMesh.position.x = -depthInsideBorder / 3;
        this.leftInsideMesh.position.z = widthInsideBorder / 2 - borderInside / 2;
        this.rightInsideMesh = new THREE.Mesh(this.sidesInside, this.insideBorderMaterial);
        this.rightInsideMesh.position.x = -depthInsideBorder / 3;
        this.rightInsideMesh.position.z = -widthInsideBorder / 2 + borderInside / 2;


        // PICTURE
        this.picture = new THREE.PlaneGeometry(width - borderFrame * 2 - borderInside * 2, height - borderFrame * 2 - borderInside * 2);
        this.pictureMaterial = new THREE.MeshBasicMaterial({ map: texture });
        this.pictureMesh = new THREE.Mesh(this.picture, this.pictureMaterial);
        this.pictureMesh.rotation.y = Math.PI / 2;
        this.pictureMesh.position.x = this.rightInsideMesh.position.x;

        // GLASS
        this.glassMaterial = new THREE.MeshPhysicalMaterial({
            transmission: 1,
            side: THREE.DoubleSide,
            reflectivity: 0.5,
            thickness: 0.08,
            transparent: true,
            opacity: 0.2,
            color: 0xffffff,
        });
        this.glassMesh = new THREE.Mesh(this.insideBorder, this.glassMaterial);
        this.glassMesh.rotation.y = Math.PI / 2;
        this.glassMesh.position.x = depth / 2 - 0.01;

        this.add(this.upMesh)
        this.add(this.downMesh)
        this.add(this.leftMesh)
        this.add(this.rightMesh)
        this.add(this.upInsideMesh)
        this.add(this.downInsideMesh)
        this.add(this.leftInsideMesh)
        this.add(this.rightInsideMesh)
        this.add(this.pictureMesh);
        this.add(this.glassMesh)
    }

    addObject(object) {
        this.add(object);
    } 
}


MyFrame.prototype.isGroup = true;
export { MyFrame };
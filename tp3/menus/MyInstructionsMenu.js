import * as THREE from 'three';

class MyInstructionsMenu extends THREE.Object3D {
    constructor(app, layer, pickableObjects, clickableObjects, fromMenuName) {
        super();

        this.app = app;
        this.layer = layer;
        this.pickableObjects = pickableObjects;
        this.clickableObjects = clickableObjects;
        this.fromMenuName = fromMenuName;

        this.backButton = null;

        this.initInstructionsMenu();
    }

    initInstructionsMenu() {
        // add go back button
        const backgroudButtonGeometry = new THREE.CircleGeometry(2, 32);
        const backgroudButtonMaterial = new THREE.MeshBasicMaterial({ color: 0xB7661A, side: THREE.DoubleSide });
        let backgroundButtonMesh = new THREE.Mesh(backgroudButtonGeometry, backgroudButtonMaterial);
        backgroundButtonMesh.layers.enable(this.layer);
        this.pickableObjects.push(backgroundButtonMesh);
        this.clickableObjects.push(backgroundButtonMesh);
        backgroundButtonMesh.name = "backButtonTo" + this.fromMenuName;
        const buttonGeometry = new THREE.CircleGeometry(1.1, 32);
        const buttonTexture = new THREE.TextureLoader().load("textures/backButton.png");
        const buttonMaterial = new THREE.MeshBasicMaterial({ map: buttonTexture, side: THREE.DoubleSide, transparent: true });
        const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
        buttonMesh.layers.enable(this.layer);
        this.clickableObjects.push(buttonMesh);
        buttonMesh.name = "backButtonTo" + this.fromMenuName;
        this.add(backgroundButtonMesh);
        backgroundButtonMesh.position.y = 12;
        backgroundButtonMesh.position.x = -10;
        buttonMesh.position.y = 12;
        buttonMesh.position.x = -10;
        this.add(buttonMesh);

        console.log(buttonMesh.name)

        // add a black plane
        const planeGeometry = new THREE.PlaneGeometry(10, 10, 32);
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.layers.enable(this.layer);
        this.add(planeMesh);

        this.app.contents.setPosAndRotRelativeToCamera(this);
    }

    handleButtonHover(button) {
        this.buttonOriginalColor = button.material.color.getHex();
        button.material.color.setHex(0xf58e2c);
    }

    resetButtonState(button) {
        button.material.color.setHex(this.buttonOriginalColor);
    }
}

export { MyInstructionsMenu };
import * as THREE from 'three';

class MyEnterUsernameMenu extends THREE.Object3D {
    constructor(app, layer, pickableObjects, clickableObjects) {
        super();

        this.app = app;
        this.layer = layer;
        this.pickableObjects = pickableObjects;
        this.clickableObjects = clickableObjects;

        this.initEnterUsernameMenu();
    }

    initEnterUsernameMenu() {
        // Add go back button
        const backgroudButtonGeometry = new THREE.CircleGeometry(2, 32);
        const backgroudButtonMaterial = new THREE.MeshBasicMaterial({ color: 0xB7661A, side: THREE.DoubleSide });
        let backgroundButtonMesh = new THREE.Mesh(backgroudButtonGeometry, backgroudButtonMaterial);
        backgroundButtonMesh.layers.enable(this.layer);
        this.pickableObjects.push(backgroundButtonMesh);
        this.clickableObjects.push(backgroundButtonMesh);
        backgroundButtonMesh.name = "backButtonToMainMenu";

        const buttonGeometry = new THREE.CircleGeometry(1.1, 32);
        const buttonTexture = new THREE.TextureLoader().load("textures/backButton.png");
        const buttonMaterial = new THREE.MeshBasicMaterial({ map: buttonTexture, side: THREE.DoubleSide, transparent: true });
        const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
        buttonMesh.layers.enable(this.layer);
        this.clickableObjects.push(buttonMesh);
        buttonMesh.name = "backButtonToMainMenu";

        let button = new THREE.Object3D();
        button.add(backgroundButtonMesh);
        button.add(buttonMesh);

        button.position.y = 12;
        button.position.x = -10;
        this.add(button);


        // Add text saying "Enter your username"
        const textGeometry = new THREE.PlaneGeometry(8, 1.2, 32);
        const textTexture = new THREE.TextureLoader().load('textures/enter_username.png');
        const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true, side: THREE.DoubleSide });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 3, 0);
        this.add(textMesh);

        // Add a text input for the username
        const inputGeometry = new THREE.PlaneGeometry(10, 2, 32);
        const inputMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const inputMesh = new THREE.Mesh(inputGeometry, inputMaterial);
        this.add(inputMesh);

        setTimeout(() => {
            const input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("id", "username");
            input.setAttribute("name", "username");
            input.setAttribute("maxlength", "20");
            input.setAttribute("style", `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 180px;
                height: 36px;
            `);
            inputMesh.element = input;
            document.body.appendChild(input);
        }, 2400);


        // Add a submit button
        const submitGeometry = new THREE.PlaneGeometry(4, 2, 32);
        const submitMaterial = new THREE.MeshBasicMaterial({ color: 0xB7661A, side: THREE.DoubleSide });
        const submitMesh = new THREE.Mesh(submitGeometry, submitMaterial);
        submitMesh.position.set(0, -3, 0);
        submitMesh.name = 'submitUsernameButton';
        submitMesh.layers.enable(this.layer);
        this.pickableObjects.push(submitMesh);
        this.clickableObjects.push(submitMesh);
        this.add(submitMesh);
        const submitTextGeometry = new THREE.PlaneGeometry(3, 1, 32);
        const submitTextTexture = new THREE.TextureLoader().load('textures/submit.png');
        const submitTextMaterial = new THREE.MeshBasicMaterial({ map: submitTextTexture, transparent: true, side: THREE.DoubleSide });
        const submitTextMesh = new THREE.Mesh(submitTextGeometry, submitTextMaterial);
        submitTextMesh.position.set(0, -3, 0.1);
        submitTextMesh.name = 'submitUsernameButton';
        submitTextMesh.layers.enable(this.layer);
        this.clickableObjects.push(submitTextMesh);
        this.add(submitTextMesh);
        this.app.contents.setPosAndRotRelativeToCamera(this, this.app.cameras['StartMenuPerspective']);
    }

    handleButtonHover(button) {
        this.buttonOriginalColor = button.material.color.getHex();
        button.material.color.setHex(0xf58e2c);
    }

    resetButtonState(button) {
        if(button.material.color != this.buttonOriginalColor){
            button.material.color.setHex(this.buttonOriginalColor);
        }
    }
}

export { MyEnterUsernameMenu };

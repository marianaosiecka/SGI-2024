import * as THREE from 'three';

class MyChoosePlayerVehicleMenu extends THREE.Object3D {
    constructor(app, layer, pickableObjects, clickableObjects) {
        super();

        this.app = app;
        this.layer = layer;
        this.pickableObjects = pickableObjects;
        this.clickableObjects = clickableObjects;

        this.cars = [];
        this.cars.push('PlayerParkingLot1');
        this.cars.push('PlayerParkingLot2');
        this.cars.push('PlayerParkingLot3');
        this.cars.push('PlayerParkingLot4');

        this.initChoosePlayerVehicleMenu();
    }

    initChoosePlayerVehicleMenu() {
        // Add text saying "select your car"
        const textGeometry = new THREE.PlaneGeometry(7, 1.2, 32);
        const textTexture = new THREE.TextureLoader().load('textures/select_player_car.png');
        const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true, side: THREE.DoubleSide });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 11, 0);
        this.add(textMesh);

        // 
        const rightButton = this.addArrowButton("rightCarButton");
        rightButton.rotation.z = Math.PI;
        rightButton.position.x = 10;
        rightButton.position.y = 8;
        this.add(rightButton);

        const leftButton = this.addArrowButton("leftCarButton");
        leftButton.position.x = -10;
        leftButton.position.y = 8;
        this.add(leftButton);

        // Add a select button
        const selectGeometry = new THREE.PlaneGeometry(4, 2, 32);
        const selectMaterial = new THREE.MeshBasicMaterial({ color: 0xB7661A, side: THREE.DoubleSide });
        const selectMesh = new THREE.Mesh(selectGeometry, selectMaterial);
        selectMesh.position.set(0, 8, 0);
        selectMesh.name = 'selectPlayerVehicleButton';
        selectMesh.layers.enable(this.layer);
        this.pickableObjects.push(selectMesh);
        this.clickableObjects.push(selectMesh);
        this.add(selectMesh);
        const selectTextGeometry = new THREE.PlaneGeometry(3, 1, 32);
        const selectTextTexture = new THREE.TextureLoader().load('textures/select.png');
        const selectTextMaterial = new THREE.MeshBasicMaterial({ map: selectTextTexture, transparent: true, side: THREE.DoubleSide });
        const selectTextMesh = new THREE.Mesh(selectTextGeometry, selectTextMaterial);
        selectTextMesh.position.set(0, 8, 0.1);
        selectTextMesh.name = 'selectPlayerVehicleButton';
        selectTextMesh.layers.enable(this.layer);
        this.clickableObjects.push(selectTextMesh);
        this.add(selectTextMesh);

        this.app.contents.setPosAndRotRelativeToCamera(this, this.app.cameras['PlayerParkingLot1'])
    }

    updateChoosePlayerVehicleMenu(num) {
        const currentCamera = this.app.activeCameraName;
        const currentCameraIndex = this.cars.indexOf(currentCamera);
        let newCameraIndex = currentCameraIndex + num;
        if (newCameraIndex < 0) {
            newCameraIndex = this.cars.length - 1;
        }
        else if (newCameraIndex >= this.cars.length) {
            newCameraIndex = 0;
        }
        const cameraName = this.cars[newCameraIndex];
        this.app.contents.setPosAndRotRelativeToCamera(this, this.app.cameras[cameraName])
        this.app.smoothCameraTransition(cameraName, 2000)
    }

    addArrowButton(name) {
        const backgroudButtonGeometry = new THREE.CircleGeometry(2, 32);
        const backgroudButtonMaterial = new THREE.MeshBasicMaterial({ color: 0xB7661A, side: THREE.DoubleSide });
        let backgroundButtonMesh = new THREE.Mesh(backgroudButtonGeometry, backgroudButtonMaterial);
        backgroundButtonMesh.layers.enable(this.layer);
        this.pickableObjects.push(backgroundButtonMesh);
        this.clickableObjects.push(backgroundButtonMesh);
        backgroundButtonMesh.name = name;

        const buttonGeometry = new THREE.CircleGeometry(1.1, 32);
        const buttonTexture = new THREE.TextureLoader().load("textures/backButton.png");
        const buttonMaterial = new THREE.MeshBasicMaterial({ map: buttonTexture, side: THREE.DoubleSide, transparent: true });
        const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
        buttonMesh.layers.enable(this.layer);
        this.clickableObjects.push(buttonMesh);
        buttonMesh.name = name;
        let button = new THREE.Object3D();
        button.add(backgroundButtonMesh);
        button.add(buttonMesh);

        return button;
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

export { MyChoosePlayerVehicleMenu };

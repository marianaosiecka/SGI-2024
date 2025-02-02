import * as THREE from 'three';

/**
 * MyChooseOpponentVehicleMenu
 * @constructor
 * @param app
 * @param layer - Layer to place the menu
 * @param pickableObjects - Array of objects that can be picked
 * @param clickableObjects - Array of objects that can be clicked
 * @extends THREE.Object3D
 */
class MyChooseOpponentVehicleMenu extends THREE.Object3D {
    constructor(app, layer, pickableObjects, clickableObjects) {
        super();

        this.app = app;
        this.layer = layer;
        this.pickableObjects = pickableObjects;
        this.clickableObjects = clickableObjects;

        // array of cameras of the cars
        this.cars = [];
        this.cars.push('OpponentParkingLot1');
        this.cars.push('OpponentParkingLot2');
        this.cars.push('OpponentParkingLot3');
        this.cars.push('OpponentParkingLot4');

        this.initChooseOpponentVehicleMenu();
    }

    /**
     * initializes the menu
     */
    initChooseOpponentVehicleMenu() {
        // add text saying "select your opponents car"
        const textGeometry = new THREE.PlaneGeometry(9, 1.2, 32);
        const textTexture = new THREE.TextureLoader().load('textures/select_opponent_car.png');
        const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true, side: THREE.DoubleSide });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 11, 0);
        this.add(textMesh);

        // add right and left arrow buttons
        const rightButton = this.addArrowButton("rightCarButton");
        rightButton.rotation.z = Math.PI;
        rightButton.position.x = 10;
        rightButton.position.y = 8;
        this.add(rightButton);

        const leftButton = this.addArrowButton("leftCarButton");
        leftButton.position.x = -10;
        leftButton.position.y = 8;
        this.add(leftButton);

        // add a select button
        const selectGeometry = new THREE.PlaneGeometry(4, 2, 32);
        const selectMaterial = new THREE.MeshBasicMaterial({ color: 0xB7661A, side: THREE.DoubleSide });
        const selectMesh = new THREE.Mesh(selectGeometry, selectMaterial);
        selectMesh.position.set(0, 8, 0);
        selectMesh.name = 'selectOpponentVehicleButton';
        selectMesh.layers.enable(this.layer);
        this.pickableObjects.push(selectMesh);
        this.clickableObjects.push(selectMesh);
        this.add(selectMesh);
        const selectTextGeometry = new THREE.PlaneGeometry(3, 1, 32);
        const selectTextTexture = new THREE.TextureLoader().load('textures/select.png');
        const selectTextMaterial = new THREE.MeshBasicMaterial({ map: selectTextTexture, transparent: true, side: THREE.DoubleSide });
        const selectTextMesh = new THREE.Mesh(selectTextGeometry, selectTextMaterial);
        selectTextMesh.position.set(0, 8, 0.1);
        selectTextMesh.name = 'selectOpponentVehicleButton';
        selectTextMesh.layers.enable(this.layer);
        this.clickableObjects.push(selectTextMesh);
        this.add(selectTextMesh);

        this.app.contents.setPosAndRotRelativeToCamera(this, this.app.cameras['OpponentParkingLot1'], this.app.getCameraTarget('OpponentParkingLot1'), 25)
    }

    /**
     * update the camera based on the arrow button clicked
     * @param num - 1 if right button was clicked, -1 if left button was clicked
     */
    updateChooseOpponentVehicleMenu(num) {
        const currentCamera = this.app.activeCameraName;
        const currentCameraIndex = this.cars.indexOf(currentCamera); // get the index of the current camera
        let newCameraIndex = currentCameraIndex + num;

        // if the new camera index is out of bounds, wrap around
        if (newCameraIndex < 0) {
            newCameraIndex = this.cars.length - 1;
        }
        else if (newCameraIndex >= this.cars.length) {
            newCameraIndex = 0;
        }

        const cameraName = this.cars[newCameraIndex];
        this.app.contents.setPosAndRotRelativeToCamera(this, this.app.cameras[cameraName], this.app.getCameraTarget(cameraName), 25)
        this.app.smoothCameraTransition(cameraName, 2000) // transition to the new camera
    }

    /**
     * adds an arrow button
     * @param name - name of the button
     * @returns {THREE.Object3D}
     */
    addArrowButton(name) {
        // circle
        const backgroudButtonGeometry = new THREE.CircleGeometry(2, 32);
        const backgroudButtonMaterial = new THREE.MeshBasicMaterial({ color: 0xB7661A, side: THREE.DoubleSide });
        let backgroundButtonMesh = new THREE.Mesh(backgroudButtonGeometry, backgroudButtonMaterial);
        backgroundButtonMesh.layers.enable(this.layer);
        this.pickableObjects.push(backgroundButtonMesh);
        this.clickableObjects.push(backgroundButtonMesh);
        backgroundButtonMesh.name = name;

        // arrow
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
        buttonMesh.position.z = 0.01;

        return button;
    }


    /**
     * handle button hover
     * @param button - button to handle
     */
    handleButtonHover(button) {
        // change color
        this.buttonOriginalColor = button.material.color.getHex();
        button.material.color.setHex(0xf58e2c);
    }

    /**
     * reset button state after hover
     * @param button - button to reset
     */
    resetButtonState(button) {
        // reset color
        if(button.material.color != this.buttonOriginalColor){
            button.material.color.setHex(this.buttonOriginalColor);
        }
    }
}

export { MyChooseOpponentVehicleMenu };

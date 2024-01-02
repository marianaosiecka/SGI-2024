import * as THREE from 'three';

class MyFinishMenu extends THREE.Object3D {
    constructor(app, layer, pickableObjects, clickableObjects, playerTime, autoTime, level, username) {
        super();

        this.app = app;
        this.layer = layer;
        this.pickableObjects = pickableObjects;
        this.clickableObjects = clickableObjects;

        this.playerTime = playerTime;
        this.autoTime = autoTime;
        this.level = level;
        this.username = username;
        this.spritesheetRegularBlack = this.app.contents.spritesheetRegularBlack;

        this.initFinishMenu();
    }

    initFinishMenu() {
        // Add go back button
        const levelText = this.spritesheetRegularBlack.getText("Level " + this.app.contents.reader.level);
        this.app.contents.setPosAndRotRelativeToCamera(levelText, this.app.activeCamera, this.app.controls.target, 15);
        levelText.position.y += 8.5;
        this.app.scene.add(levelText);

        const playerTimeText = this.spritesheetRegularBlack.getText("Player time: " + this.playerTime.toFixed(2) + "s");
        this.app.contents.setPosAndRotRelativeToCamera(playerTimeText, this.app.activeCamera, this.app.controls.target, 15);
        playerTimeText.position.y += 7.5;
        this.app.scene.add(playerTimeText);

        const autoTimeText = this.spritesheetRegularBlack.getText("Autonomous time: " + this.autoTime.toFixed(2) + "s");
        this.app.contents.setPosAndRotRelativeToCamera(autoTimeText, this.app.activeCamera, this.app.controls.target, 15);
        autoTimeText.position.y += 6.5;
        this.app.scene.add(autoTimeText);

        const restartButtonText = this.spritesheetRegularBlack.getText("Redo Run");
        const restartButtonPlane = new THREE.PlaneGeometry(2, 1);
        const restartButtonMaterial = new THREE.MeshBasicMaterial({ color: 0xB7661A });
        const restartButtonMesh = new THREE.Mesh(restartButtonPlane, restartButtonMaterial);
        restartButtonMesh.name = "restartButton";
        restartButtonMesh.layers.enable(this.layer);
        this.pickableObjects.push(restartButtonMesh);
        this.clickableObjects.push(restartButtonMesh);
        restartButtonMesh.add(restartButtonText);
        restartButtonMesh.position.y -= 5;
        this.add(restartButtonMesh);

        const mainMenuButtonText = this.spritesheetRegularBlack.getText("Main Menu");
        const mainMenuButtonPlane = new THREE.PlaneGeometry(2, 1);
        const mainMenuButtonMaterial = new THREE.MeshBasicMaterial({ color: 0xB7661A });
        const mainMenuButtonMesh = new THREE.Mesh(mainMenuButtonPlane, mainMenuButtonMaterial);
        mainMenuButtonMesh.name = "mainMenuButton";
        mainMenuButtonMesh.layers.enable(this.layer);
        this.pickableObjects.push(mainMenuButtonMesh);
        this.clickableObjects.push(mainMenuButtonMesh);
        mainMenuButtonMesh.add(mainMenuButtonText);
        mainMenuButtonMesh.position.y -= 6;
        this.add(mainMenuButtonMesh);

        this.app.contents.setPosAndRotRelativeToCamera(this, this.app.cameras['FinishMenuPerspective'], this.app.getCameraTarget('FinishMenuPerspective'), 15);
    }

    handleButtonHover(button) {
        this.buttonOriginalColor = button.material.color.getHex();
        button.material.color.setHex(0xf58e2c);
    }

    resetButtonState(button) {
        button.material.color.setHex(this.buttonOriginalColor);
    }
}

export { MyFinishMenu };
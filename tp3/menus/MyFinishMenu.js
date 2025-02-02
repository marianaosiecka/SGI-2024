import * as THREE from 'three';

/**
 * MyFinishMenu
 * @constructor
 * @param app
 * @param layer - Layer to place the menu
 * @param pickableObjects - Array of objects that can be picked
 * @param clickableObjects - Array of objects that can be clicked
 * @param playerTime - Time of the player car
 * @param autoTime - Time of the automous car
 * @param level - Level of the game
 * @param username - Username of the player
 * @extends THREE.Object3D
 */
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

    /**
     * initializes the menu
     */
    initFinishMenu() {
        // level text
        const levelText = this.spritesheetRegularBlack.getText("Level " + this.app.contents.reader.level);
        levelText.position.y += 8.5;
        this.add(levelText);

        // player time text
        const playerTimeText = this.spritesheetRegularBlack.getText(this.username +" time: " + this.playerTime.toFixed(2) + "s");
        playerTimeText.position.y += 7.5;
        this.add(playerTimeText);

        // autonomous time text
        const autoTimeText = this.spritesheetRegularBlack.getText("Opponent time: " + this.autoTime.toFixed(2) + "s");
        autoTimeText.position.y += 6.5;
        this.add(autoTimeText);

        // winner or loser text
        if(this.playerTime < this.autoTime) {
            const winnerText = this.app.contents.spritesheetTitle1.getText("WINNER :)");
            winnerText.position.y += 4;
            winnerText.scale.set(3,3,3)
            this.add(winnerText);
        } else if(this.playerTime > this.autoTime){
            const loserText = this.app.contents.spritesheetTitle2.getText("LOSER :(");
            loserText.position.y += 4;
            loserText.scale.set(2,2,2)
            this.add(loserText);
        } else {
            const tieText = this.app.contents.spritesheetTitle2.getText("TIE");
            tieText.position.y += 4;
            tieText.scale.set(2,2,2)
            this.add(tieText);
        }

        // add redo run button
        const restartButtonText = this.app.contents.spritesheetRegularWhite.getText("Redo Run", 0.3);
        const restartButtonPlane = new THREE.PlaneGeometry(5, 1);
        const restartButtonMaterial = new THREE.MeshBasicMaterial({ color: 0xB7661A });
        const restartButtonMesh = new THREE.Mesh(restartButtonPlane, restartButtonMaterial);
        restartButtonMesh.name = "redoRunButton";
        restartButtonMesh.layers.enable(this.layer);
        this.pickableObjects.push(restartButtonMesh);
        this.clickableObjects.push(restartButtonMesh);
        restartButtonMesh.position.y -= 5.5;
        restartButtonText.position.y -= 5.5;
        this.add(restartButtonText);
        this.add(restartButtonMesh);

        // add main menu button
        const mainMenuButtonText = this.app.contents.spritesheetRegularWhite.getText("Main Menu", 0.3);
        const mainMenuButtonPlane = new THREE.PlaneGeometry(5, 1);
        const mainMenuButtonMaterial = new THREE.MeshBasicMaterial({ color: 0xB7661A });
        const mainMenuButtonMesh = new THREE.Mesh(mainMenuButtonPlane, mainMenuButtonMaterial);
        mainMenuButtonMesh.name = "mainMenuButton";
        mainMenuButtonMesh.layers.enable(this.layer);
        this.pickableObjects.push(mainMenuButtonMesh);
        this.clickableObjects.push(mainMenuButtonMesh);
        mainMenuButtonMesh.position.y -= 7;
        mainMenuButtonText.position.y -= 7;
        this.add(mainMenuButtonMesh);
        this.add(mainMenuButtonText);

        this.app.contents.setPosAndRotRelativeToCamera(this, this.app.cameras['PodiumPerspective'], this.app.getCameraTarget('PodiumPerspective'), 15);
    }

    /**
     * handles the button hover
     * @param button - button to handle
     */
    handleButtonHover(button) {
        this.buttonOriginalColor = button.material.color.getHex();
        button.material.color.setHex(0xf58e2c);
    }

    /**
     * resets the button state after hover
     * @param button - button to reset
     */
    resetButtonState(button) {
        if(button.material.color != this.buttonOriginalColor){
            button.material.color.setHex(this.buttonOriginalColor);
        }
    }
}

export { MyFinishMenu };
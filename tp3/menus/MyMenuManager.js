import * as THREE from 'three';

import { MyMainMenu } from './MyMainMenu.js';
import { MyEnterUsernameMenu } from './MyEnterUsernameMenu.js';
import { MyChooseLevelMenu } from './MyChooseLevelMenu.js';
import { MyChoosePlayerVehicleMenu } from './MyChoosePlayerVehicleMenu.js';
import { MyChooseOpponentVehicleMenu } from './MyChooseOpponentVehicleMenu.js';
import { MyFinishMenu } from './MyFinishMenu.js';


/**
 * MyMenuManager
 * @constructor
 * @param app
 * @param layer - Layer to place the menu
 * @param pickableObjects - Array of objects that can be picked
 * @param clickableObjects - Array of objects that can be clicked
 * @extends THREE.Object3D
 */
class MyMenuManager {
    constructor(app, layer, pickableObjects, clickableObjects) {
        this.app = app;
        this.layer = layer;
        this.pickableObjects = pickableObjects;
        this.clickableObjects = clickableObjects;

        // current menu object
        this.currentMenu = null;
    }

    /**
     * initializes the main menu
     */
    initMainMenu() {
        this.app.contents.selectedLayer = this.layer;
        this.app.contents.updateSelectedLayer();
        this.clearCurrentMenu();
        this.app.smoothCameraTransition('MainMenuPerspective', 30000);
        this.currentMenu = new MyMainMenu(this.app, this.layer, this.pickableObjects, this.clickableObjects);
        this.app.scene.add(this.currentMenu);
    }

     /**
      * initializes the enter username menu
      */
     initEnterUsernameMenu() {
        this.clearCurrentMenu();
        this.app.smoothCameraTransition('StartMenuPerspective', 30000);
        this.currentMenu = new MyEnterUsernameMenu(this.app, this.layer, this.pickableObjects, this.clickableObjects);
        this.app.scene.add(this.currentMenu);
    }

    /**
     * initializes the choose level menu
     */
    initChooseLevelMenu() {
        this.app.setActiveCamera('StartMenuPerspective');
        this.clearCurrentMenu();
        this.currentMenu = new MyChooseLevelMenu(this.app, this.layer, this.pickableObjects, this.clickableObjects);
        this.app.scene.add(this.currentMenu);
    }

    /**
     * initializes the choose vehicle menu
     */
    initChoosePlayerVehicleMenu() {
        this.clearCurrentMenu();
        this.app.smoothCameraTransition('PlayerParkingLot1', 90000)
        this.currentMenu = new MyChoosePlayerVehicleMenu(this.app, this.layer, this.pickableObjects, this.clickableObjects);
        this.app.scene.add(this.currentMenu);
    }

    /**
     * initializes the choose opponent vehicle menu
     */
    initChooseOpponentVehicleMenu() {
        this.clearCurrentMenu();
        this.app.smoothCameraTransition('OpponentParkingLot1', 90000)
        this.currentMenu = new MyChooseOpponentVehicleMenu(this.app, this.layer, this.pickableObjects, this.clickableObjects);
        this.app.scene.add(this.currentMenu);
    }

    /**
     * update choose vehicle menu (when clicking the arrows)
     * @param num - 1 if right arrow, -1 if left arrow
     */
    updateChooseVehicleMenu(num) {
        if(this.currentMenu instanceof MyChoosePlayerVehicleMenu){
            this.currentMenu.updateChoosePlayerVehicleMenu(num);
        }
        else if(this.currentMenu instanceof MyChooseOpponentVehicleMenu){
            this.currentMenu.updateChooseOpponentVehicleMenu(num);
        }
    }

    /**
     * initializes the finish menu
     */
    initFinishMenu(playerTime, autoTime, level, username) {
        this.clearCurrentMenu();
        this.currentMenu = new MyFinishMenu(this.app, this.layer, this.pickableObjects, this.clickableObjects, playerTime, autoTime, level, username);
        this.app.scene.add(this.currentMenu);
    }

    /**
     * initializes the menu
     * @param menuName - name of the menu to initialize
     */
    initMenu(menuName) {
        switch (menuName) {
            case 'MainMenu':
                this.initMainMenu();
                break;
            case 'EnterUsernameMenu':
                this.initEnterUsernameMenu();
                break;
            case 'ChooseLevelMenu':
                this.initChooseLevelMenu();
                break;
            case 'ChoosePlayerVehicleMenu':
                this.initChoosePlayerVehicleMenu();
                break;
            case 'ChooseOpponentVehicleMenu':
                this.initChooseOpponentVehicleMenu();
                break;
            default:
                console.error('Invalid menu name: ' + menuName);
        }
    }

    /**
     * clears the current menu
     */
    clearCurrentMenu() {
        if (this.currentMenu) {
            this.pickableObjects.length = 0; // clear the pickable objects array
            this.clickableObjects.length = 0; // clear the clickable objects array
            this.app.scene.remove(this.currentMenu); // remove the current menu from the scene
            this.currentMenu.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose();
                    child.material.dispose();
                    if(child.material.map) child.material.map.dispose();
                }
            });
            this.currentMenu = null;
        }
    }

    /**
     * handle button hover
     * @param button - button to handle
     */
    handleButtonHover(button) {
        if (this.currentMenu) this.currentMenu.handleButtonHover(button);
    }

    /**
     * reset button state after hover
     * @param button - button to reset
     */
    resetButtonState(button) {
        if (this.currentMenu) this.currentMenu.resetButtonState(button);
    }

    /**
     * handle button click
     * @param button - button to handle
     */
    handleClickButton(button){
        if (this.currentMenu) this.currentMenu.handleClickButton(button);
    }
}

export { MyMenuManager };

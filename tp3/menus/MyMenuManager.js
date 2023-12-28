import { MyMainMenu } from './MyMainMenu.js';
import { MyInstructionsMenu } from './MyInstructionsMenu.js';
import { MyEnterUsernameMenu } from './MyEnterUsernameMenu.js';
import { MyChooseLevelMenu } from './MyChooseLevelMenu.js';
import { MyChoosePlayerVehicleMenu } from './MyChoosePlayerVehicleMenu.js';
import { MyChooseOpponentVehicleMenu } from './MyChooseOpponentVehicleMenu.js';

class MyMenuManager {
    constructor(app, layer, pickableObjects, clickableObjects) {
        this.app = app;
        this.layer = layer;
        this.pickableObjects = pickableObjects;
        this.clickableObjects = clickableObjects;

        this.currentMenu = null;
    }

    // main menu
    initMainMenu() {
        this.clearCurrentMenu();
        this.app.smoothCameraTransition('MainMenuPerspective', 30000);
        this.currentMenu = new MyMainMenu(this.app, this.layer, this.pickableObjects, this.clickableObjects);
        this.app.scene.add(this.currentMenu);
    }

     // start menu
     initEnterUsernameMenu() {
        this.clearCurrentMenu();
        this.app.smoothCameraTransition('StartMenuPerspective', 30000);
        this.currentMenu = new MyEnterUsernameMenu(this.app, this.layer, this.pickableObjects, this.clickableObjects);
        this.app.scene.add(this.currentMenu);
    }

    // choose level menu
    initChooseLevelMenu() {
        this.app.setActiveCamera('StartMenuPerspective');
        this.clearCurrentMenu();
        this.currentMenu = new MyChooseLevelMenu(this.app, this.layer, this.pickableObjects, this.clickableObjects);
        this.app.scene.add(this.currentMenu);
    }

    // choose player vehicle menu
    initChoosePlayerVehicleMenu() {
        this.clearCurrentMenu();
        this.app.smoothCameraTransition('PlayerParkingLot1', 90000)
        this.currentMenu = new MyChoosePlayerVehicleMenu(this.app, this.layer, this.pickableObjects, this.clickableObjects);
        this.app.scene.add(this.currentMenu);
    }

    initChooseOpponentVehicleMenu() {
        this.clearCurrentMenu();
        this.app.smoothCameraTransition('OpponentParkingLot1', 90000)
        this.currentMenu = new MyChooseOpponentVehicleMenu(this.app, this.layer, this.pickableObjects, this.clickableObjects);
        this.app.scene.add(this.currentMenu);
    }

    // update choose vehicle menu
    updateChooseVehicleMenu(num) {
        if(this.currentMenu instanceof MyChoosePlayerVehicleMenu){
            this.currentMenu.updateChoosePlayerVehicleMenu(num);
        }
        else if(this.currentMenu instanceof MyChooseOpponentVehicleMenu){
            this.currentMenu.updateChooseOpponentVehicleMenu(num);
        }
    }

    // instructions menu
    initInstructionsMenu(fromMenuName) {
        this.clearCurrentMenu();
        this.currentMenu = new MyInstructionsMenu(this.app, this.layer, this.pickableObjects, this.clickableObjects, fromMenuName);
        this.app.scene.add(this.currentMenu);
    }

    // leaderboard menu
    initLeaderboardMenu(fromMenuName) {
        /*this.clearCurrentMenu();
        this.currentMenu = new MyLeaderboardMenu(this.app, this.layer, this.pickableObjects, this.clickableObjects, fromMenuName);
        this.app.scene.add(this.currentMenu);
        */
    }

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

    clearCurrentMenu() {
        if (this.currentMenu) {
            this.pickableObjects.length = 0;
            this.clickableObjects.length = 0;
            this.app.scene.remove(this.currentMenu);
            this.currentMenu = null;
        }
    }

    handleButtonHover(button) {
        this.currentMenu.handleButtonHover(button);
    }

    resetButtonState(button) {
        this.currentMenu.resetButtonState(button);
    }

    handleClickButton(button){
        this.currentMenu.handleClickButton(button);
    }
}

export { MyMenuManager };

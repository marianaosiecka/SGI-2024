import * as THREE from 'three';

/**
 * MyChooseLevelMenu
 * @constructor
 * @param app 
 * @param layer - Layer to place the menu
 * @param pickableObjects - Array of objects that can be picked
 * @param clickableObjects - Array of objects that can be clicked
 * @extends THREE.Object3D
 */
class MyChooseLevelMenu extends THREE.Object3D {
    constructor(app, layer, pickableObjects, clickableObjects) {
        super();

        this.app = app;
        this.layer = layer;
        this.pickableObjects = pickableObjects;
        this.clickableObjects = clickableObjects;

        this.initChooseLevelMenu();
    }

    /**
     * initializes the menu
     */
    initChooseLevelMenu() {
        // add go back button
        const backgroudButtonGeometry = new THREE.CircleGeometry(2, 32);
        const backgroudButtonMaterial = new THREE.MeshBasicMaterial({ color: 0xB7661A, side: THREE.DoubleSide });
        let backgroundButtonMesh = new THREE.Mesh(backgroudButtonGeometry, backgroudButtonMaterial);
        backgroundButtonMesh.layers.enable(this.layer);
        this.pickableObjects.push(backgroundButtonMesh);
        this.clickableObjects.push(backgroundButtonMesh);
        backgroundButtonMesh.name = "backButtonToEnterUsernameMenu";

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
        
        buttonMesh.position.z = 0.01;

        button.position.y = 12;
        button.position.x = -10;
        this.add(button);


        // add text saying "Choose level"
        const textGeometry = new THREE.PlaneGeometry(8, 1.2, 32);
        const textTexture = new THREE.TextureLoader().load('textures/choose_level.png');
        const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true, side: THREE.DoubleSide });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 3, 0);
        this.add(textMesh);

        // add buttons to levels
        const level1Button = this.addLevelButton(0x72BA51, "textures/level1.png", "level1Button")
        level1Button.position.x = -5
        this.add(level1Button)
        const level2Button = this.addLevelButton(0xEBE70C, "textures/level2.png", "level2Button")
        this.add(level2Button)
        const level3Button = this.addLevelButton(0x98132A, "textures/level3.png", "level3Button")
        level3Button.position.x = 5
        this.add(level3Button)

        this.app.contents.setPosAndRotRelativeToCamera(this, this.app.cameras['StartMenuPerspective']);
    }

    /**
     * adds a level button
     * @param color - color of the button
     * @param texturePath - path of the texture of the level
     * @param buttonName - name of the button
     * @returns {THREE.Object3D} - level button
     */
    addLevelButton(color, texturePath, buttonName){
        // plane
        const levelGeometry = new THREE.PlaneGeometry(3, 3, 32)
        const levelMaterial = new THREE.MeshBasicMaterial({color: color })
        const levelMesh = new THREE.Mesh(levelGeometry, levelMaterial)
        levelMesh.layers.enable(this.layer)
        this.pickableObjects.push(levelMesh)
        this.clickableObjects.push(levelMesh)
        levelMesh.name = buttonName

        // text
        const levelTextGeometry = new THREE.PlaneGeometry(0.7, 1.2, 32)
        const levelTextTexture = new THREE.TextureLoader().load(texturePath);
        const levelTextMaterial = new THREE.MeshBasicMaterial({ map: levelTextTexture, transparent: true, side: THREE.DoubleSide });
        const levelTextMesh = new THREE.Mesh(levelTextGeometry, levelTextMaterial)
        levelTextMesh.layers.enable(this.layer)
        this.clickableObjects.push(levelTextMesh)
        levelTextMesh.name = buttonName

        let levelButton = new THREE.Object3D()
        levelButton.add(levelMesh, levelTextMesh)
        return levelButton;
    }

    /**
     * handles the hover of a button
     * @param button - button to handle
     */
    handleButtonHover(button) {
        // if button is a level button, change scale
        if(button.name.startsWith("level")){
            button.scale.set(1.2, 1.2, 1.2)
        }

        // else, change color
        else {
            this.buttonOriginalColor = button.material.color.getHex();
            button.material.color.setHex(0xf58e2c);
        }
    }

    /**
     * resets the state of a button after hover
     * @param button - button to reset
     */
    resetButtonState(button) {
        // if button is a level button, reset scale to 1
        if(button.name.startsWith("level")){
            button.scale.set(1, 1, 1)
        }
        // else, reset to original color
        else if (button.material.color != this.buttonOriginalColor){
            button.material.color.setHex(this.buttonOriginalColor);
        }
    }
}

export { MyChooseLevelMenu };

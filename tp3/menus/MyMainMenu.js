import * as THREE from 'three';

/**
 * MyMainMenu
 * @constructor
 * @param app
 * @param layer - Layer to place the menu
 * @param pickableObjects - Array of objects that can be picked
 * @param clickableObjects - Array of objects that can be clicked
 * @extends THREE.Object3D
 */
class MyMainMenu extends THREE.Object3D {
    constructor(app, layer, pickableObjects, clickableObjects) {
        super();

        this.app = app;
        this.layer = layer;
        this.pickableObjects = pickableObjects;
        this.clickableObjects = clickableObjects;

        this.initMainMenu();
    }

    /**
     * initializes the menu
     */
    initMainMenu() {
        this.addGameLogo();
        this.addNames();
        this.addFeupLogo();
        this.addClickToStartText();
        this.app.contents.setPosAndRotRelativeToCamera(this, this.app.cameras['MainMenuPerspective']);
    }

    /**
     * adds the game logo
     */
    addGameLogo() {
        const logoGeometry = new THREE.PlaneGeometry(20, 13, 32);
        logoGeometry.scale(1.5, 1.5, 1.5);
        const logoTexture = new THREE.TextureLoader().load('textures/logo.png');
        const logoMaterial = new THREE.MeshBasicMaterial({
            map: logoTexture,
            side: THREE.DoubleSide,
            transparent: true,
        });
        const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
        this.add(logoMesh);
    }

    /**
     * adds the names of the authors
     */
    addNames() {
        const marianaGeometry = new THREE.PlaneGeometry(14, 10, 32);
        marianaGeometry.scale(0.3, 0.3, 0.3);
        const marianaMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('textures/Mariana Carvalho.png'),
            side: THREE.DoubleSide,
            transparent: true,
        });
        const marianaMesh = new THREE.Mesh(marianaGeometry, marianaMaterial);
        marianaMesh.position.y = 3;
        marianaMesh.position.x = 10;
        this.add(marianaMesh);

        const mafaladaGeometry = new THREE.PlaneGeometry(13, 10, 32);
        mafaladaGeometry.scale(0.3, 0.3, 0.3);
        const mafaldaMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('textures/Mafalda Costa.png'),
            side: THREE.DoubleSide,
            transparent: true,
        });
        const mafaldaMesh = new THREE.Mesh(mafaladaGeometry, mafaldaMaterial);
        mafaldaMesh.position.y = 6;
        mafaldaMesh.position.x = 9.85;
        this.add(mafaldaMesh);
    }

    /**
     * adds the feup logo
     */
    addFeupLogo() {
        const feupGeometry = new THREE.PlaneGeometry(27, 10, 32);
        feupGeometry.scale(0.3, 0.3, 0.3);
        const feupTexture = new THREE.TextureLoader().load('textures/feup.png');
        const feupMaterial = new THREE.MeshBasicMaterial({
            map: feupTexture,
            side: THREE.DoubleSide,
            transparent: true,
        });
        const feupMesh = new THREE.Mesh(feupGeometry, feupMaterial);
        feupMesh.position.y = 14;
        this.add(feupMesh);
    }

    /**
     * adds the click to start button
     */
    addClickToStartText() {
        const clickGeometry = new THREE.PlaneGeometry(18, 3, 32);
        clickGeometry.scale(0.5, 0.5, 0.5);
        const clickTexture = new THREE.TextureLoader().load('textures/click.png');
        const clickMaterial = new THREE.MeshBasicMaterial({
            map: clickTexture,
            side: THREE.DoubleSide,
            transparent: true,
        });
        
        const clickMesh = new THREE.Mesh(clickGeometry, clickMaterial);
        clickMesh.position.y = -13;
        this.add(clickMesh);
        clickMesh.name = 'clickHereToStart';
        clickMesh.layers.enable(this.layer);
        this.pickableObjects.push(clickMesh);
        this.clickableObjects.push(clickMesh);
    }

    /**
     * handles the button hover
     * @param button
     */
    handleButtonHover(button){
        button.scale.set(1.1, 1.1, 1.1)
    }

    /**
     * resets the button state after hover
     * @param button
     */
    resetButtonState(button){
        button.scale.set(1, 1, 1)
    }
    
}

export { MyMainMenu };

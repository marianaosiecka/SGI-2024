import * as THREE from 'three';

class MyMainMenu extends THREE.Object3D {
    constructor(app, layer, pickableObjects, clickableObjects) {
        super();

        this.app = app;
        this.layer = layer;
        this.pickableObjects = pickableObjects;
        this.clickableObjects = clickableObjects;

        this.initMainMenu();
    }

    initMainMenu() {
        this.addGameLogo();
        this.addFeupLogo();
        this.addClickToStartText();
        this.app.contents.setPosAndRotRelativeToCamera(this, this.app.cameras['MainMenuPerspective']);
    }

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

    handleButtonHover(button){
        button.scale.set(1.1, 1.1, 1.1)
    }

    resetButtonState(button){
        button.scale.set(1, 1, 1)
    }
    
}

export { MyMainMenu };

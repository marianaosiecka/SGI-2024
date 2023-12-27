import * as THREE from "three";

class MyMenu extends THREE.Object3D{
    constructor(app, layer) {
        super();
        this.app = app;
        this.layer = layer;

        this.backgroudButtonGeometry = new THREE.CircleGeometry( 2, 32 );
        this.backgroudButtonMaterial = new THREE.MeshBasicMaterial( { color: 0xB7661A, side: THREE.DoubleSide } );
        this.backButton = null;
        this.leaderboardButton = null;
        this.instructionsButton = null;

        this.mainMenu = new THREE.Object3D();
        this.startMenu = new THREE.Object3D();
    }

    initMainMenu() {
        // game logo
        let logo = new THREE.PlaneGeometry( 20, 13, 32 );
        logo.scale(1.5, 1.5, 1.5);
        let logoTexture = new THREE.TextureLoader().load( 'textures/logo.png' );
        let logoMaterial = new THREE.MeshBasicMaterial( { map: logoTexture, side: THREE.DoubleSide, transparent: true } );
        let logoMesh = new THREE.Mesh(logo, logoMaterial);
        logoMesh.layers.enable(this.layer)
        this.mainMenu.add(logoMesh);

        // feup logo
        let feup = new THREE.PlaneGeometry( 27, 10, 32 );
        feup.scale(0.3, 0.3, 0.3);
        let feupTexture = new THREE.TextureLoader().load( 'textures/feup.png' );
        let feupMaterial = new THREE.MeshBasicMaterial( { map: feupTexture, side: THREE.DoubleSide, transparent: true } );
        let feupMesh = new THREE.Mesh(feup, feupMaterial);
        feupMesh.position.y = 14;
        feupMesh.layers.enable(this.layer)
        this.mainMenu.add(feupMesh);

        // click anywhere to start text
        let click = new THREE.PlaneGeometry( 20, 3, 32 );
        click.scale(0.6, 0.6, 0.6);
        let clickTexture = new THREE.TextureLoader().load( 'textures/click.png' );
        let clickMaterial = new THREE.MeshBasicMaterial( { map: clickTexture, side: THREE.DoubleSide, transparent: true } );
        let clickMesh = new THREE.Mesh(click, clickMaterial);
        clickMesh.position.y = -13;
        clickMesh.layers.enable(this.layer)
        this.mainMenu.add(clickMesh);

        // click flashing animation
        setInterval(() => {
            clickMaterial.opacity = 1 - clickMaterial.opacity;
        }, 700);

        this.setPosAndRotRelativeToCamera(this.mainMenu);
    }

    initStartMenu() {
        /*this.backButton();
        this.leaderboardButton();
        this.instructionsButton();
        */
        // instructions, leaderboard button and back button always visible
        // 1. insert username
        // 2. choose level
        // 3. select player car
        // 4. select opponent car
        // 5. play game button


        this.createBackButton();
        this.createLeaderboardButton();
        this.createInstructionsButton();

        
        

        this.setPosAndRotRelativeToCamera(this.startMenu);
    }

    initInstructionsMenu() {
        // instructions, back button
    }

    initLeaderboardMenu() {
        // leaderboard, back button
    }

    initPauseMenu() {
        //this.app.contents.updateSelectedLayer('menu')
        // resume button, restart button, exit button
    }

    initGameOverMenu() {
        //this.app.contents.updateSelectedLayer('menu')
        // show winner and time, show loser and time, restart same run button, restart game button, exit button
    }

    setPosAndRotRelativeToCamera(obj) {
        const direction = new THREE.Vector3(0, 0, 0).sub(this.app.activeCamera.position).normalize();
        const distance = 30;
        const position = new THREE.Vector3().copy(this.app.activeCamera.position).add(direction.multiplyScalar(distance));

        obj.position.copy(position);

        const lookAtMatrix = new THREE.Matrix4().lookAt(this.app.activeCamera.position, new THREE.Vector3(0, 0, 0), this.app.activeCamera.up);
        const rotation = new THREE.Euler().setFromRotationMatrix(lookAtMatrix);
        obj.rotation.set(rotation.x, rotation.y, rotation.z);
    }

    createBackButton() {
        const backgroundBackButton = new THREE.Mesh(this.backgroudButtonGeometry, this.backgroudButtonMaterial);
        backgroundBackButton.layers.enable(this.layer);

        const backButtonGeometry = new THREE.CircleGeometry( 1.1, 32 );
        const backTexture = new THREE.TextureLoader().load('textures/backButton.png');
        const backButtonMaterial = new THREE.MeshBasicMaterial( { map: backTexture, side: THREE.DoubleSide, transparent: true } );
        const backButtonMesh = new THREE.Mesh(backButtonGeometry, backButtonMaterial);
        backButtonMesh.layers.enable(this.layer);

        this.backButton = new THREE.Object3D();
        this.backButton.add(backgroundBackButton);
        this.backButton.add(backButtonMesh);
        this.backButton.position.x = -10;
        this.backButton.position.y = 9;
        this.backButton.position.z = 0;

        this.startMenu.add(this.backButton);
    }

    createLeaderboardButton() {
        let leaderboardGeometry = new THREE.SphereGeometry(1, 10, 10)
        let leaderboardTexture = new THREE.TextureLoader().load('textures/leaderboardButton.png');
        let leaderboardMaterial = new THREE.MeshBasicMaterial( { color: 0xB7661A, map: leaderboardTexture, side: THREE.DoubleSide, transparent: true } );
        let leaderboardMesh = new THREE.Mesh(leaderboardGeometry, leaderboardMaterial);
        leaderboardMesh.position.x = 10;
        leaderboardMesh.position.y = 9;
        leaderboardMesh.position.z = -1;
        this.startMenu.add(leaderboardMesh);
    }

    createInstructionsButton() {
        let instructionsGeometry = new THREE.SphereGeometry(1.8, 10, 10)
        let instructionsTexture = new THREE.TextureLoader().load('textures/instructionsButton.png');
        let instructionsMaterial = new THREE.MeshBasicMaterial( { color: 0xB7661A, map: instructionsTexture, side: THREE.DoubleSide, transparent: true } );
        let instructionsMesh = new THREE.Mesh(instructionsGeometry, instructionsMaterial);
        instructionsMesh.position.x = 0;
        instructionsMesh.position.y = 9;
        this.startMenu.add(instructionsMesh);
    }

    handleMouseOverButton() {
        console.log("mouse over button");
    }

    handleMouseOutButton() {
        this.backButton.children[0].material.color.setHex(0xB7661A);
    }

}

export { MyMenu }
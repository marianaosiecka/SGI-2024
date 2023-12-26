import * as THREE from "three";


class MyMenu extends THREE.Object3D{
    constructor(app, layer) {
        super();
        this.app = app;
        this.layer = layer;
        this.mainMenuObj = new THREE.Object3D();
        this.startMenuObj = new THREE.Object3D();
    }

    mainMenu() {
        // game logo
        let logo = new THREE.PlaneGeometry( 20, 13, 32 );
        logo.scale(1.5, 1.5, 1.5);
        let logoTexture = new THREE.TextureLoader().load( 'textures/logo.png' );
        let logoMaterial = new THREE.MeshBasicMaterial( { map: logoTexture, side: THREE.DoubleSide, transparent: true } );
        let logoMesh = new THREE.Mesh(logo, logoMaterial);
        this.mainMenuObj.add(logoMesh);

        // feup logo
        let feup = new THREE.PlaneGeometry( 27, 10, 32 );
        feup.scale(0.3, 0.3, 0.3);
        let feupTexture = new THREE.TextureLoader().load( 'textures/feup.png' );
        let feupMaterial = new THREE.MeshBasicMaterial( { map: feupTexture, side: THREE.DoubleSide, transparent: true } );
        let feupMesh = new THREE.Mesh(feup, feupMaterial);
        feupMesh.position.y = 14;
        this.mainMenuObj.add(feupMesh);

        // click anywhere to start text
        let click = new THREE.PlaneGeometry( 20, 3, 32 );
        click.scale(0.6, 0.6, 0.6);
        let clickTexture = new THREE.TextureLoader().load( 'textures/click.png' );
        let clickMaterial = new THREE.MeshBasicMaterial( { map: clickTexture, side: THREE.DoubleSide, transparent: true } );
        let clickMesh = new THREE.Mesh(click, clickMaterial);
        clickMesh.position.y = -13;
        this.mainMenuObj.add(clickMesh);

        // click flashing animation
        setInterval(() => {
            clickMaterial.opacity = 1 - clickMaterial.opacity;
        }, 700);

        this.setPosAndRotRelativeToCamera(this.mainMenuObj);
    }

    startMenu() {
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

        // add a black plane to the scene
        let plane = new THREE.PlaneGeometry( 20, 20, 32 );
        plane.scale(1, 1, 1);
        let planeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide } );
        let planeMesh = new THREE.Mesh(plane, planeMaterial);
        this.startMenuObj.add(planeMesh);

        this.setPosAndRotRelativeToCamera(this.startMenuObj);
    }

    instructionsMenu() {
        // instructions, back button
    }

    leaderboardMenu() {
        // leaderboard, back button
    }

    pauseMenu() {
        //this.app.contents.updateSelectedLayer('menu')
        // resume button, restart button, exit button
    }

    gameOverMenu() {
        //this.app.contents.updateSelectedLayer('menu')
        // show winner and time, show loser and time, restart same run button, restart game button, exit button
    }

    backButton() {
        // create a button (round and green) that when clicked goes back to the previous menu
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

}

export { MyMenu }
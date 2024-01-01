import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyReader } from "./MyReader.js";
import { MyScenario } from "./scenario/MyScenario.js";
import { MyVehicle } from "./elements/MyVehicle.js";
import { MyObstacle } from "./elements/MyObstacle.js";
import { MyCarModelRed } from "./carModels/MyCarModelRed.js";
import { MyCarModelOrange } from "./carModels/MyCarModelOrange.js";
import { MyCarModelPurple } from "./carModels/MyCarModelPurple.js";
import { MyCarModelGreen } from "./carModels/MyCarModelGreen.js";
import { MyMenuManager } from "./menus/MyMenuManager.js";
import { MySpritesheet } from "./MySpritesheet.js";
import { MyHUD } from "./menus/MyHUD.js";
import { MyFirework } from "./scenario/MyFireworks.js";

/**
 *  This class contains the contents of out application
 */
class MyContents {
  /**
       constructs the object
       @param {MyApp} app The application object
    */
  constructor(app) {
    this.app = app;
    this.app.setContents(this);
    this.axis = null;

    // clock
    this.clock = new THREE.Clock()

    // camera related attributes
    this.followPlayerVehicle = false;
    this.followAutonomousVehicle = false;

    // starting point of the run
    this.startingPoint = new THREE.Vector3(32, 1.7, -117);

    // track related attributes
    this.showTrackWireframe = false;
    this.showTrackLine = true;
    this.trackClosedCurve = false;

    // game levels
    this.levels = [1, 2, 3];

    // menu related attributes
    this.username = null;
    this.selectedLevel = null;
    this.availablePlayerVehicles = [];
    this.selectedPlayerVehicle = null;
    this.availableOpponentVehicles = [];
    this.selectedOpponentVehicle = null;

    // load the spritesheets
    this.spritesheetTitle1 = new MySpritesheet('spritesheets/spritesheet_title_1.png', 10, 10);
    this.spritesheetTitle2 = new MySpritesheet('spritesheets/spritesheet_title_2.png', 10, 10);
    this.spritesheetTitle3 = new MySpritesheet('spritesheets/spritesheet_title_3.png', 10, 10);
    this.spritesheetRegularBlack = new MySpritesheet('spritesheets/spritesheet_regular_black.png', 10, 10);
    this.spritesheetRegularWhite = new MySpritesheet('spritesheets/spritesheet_regular_white.png', 10, 10);

    // curve segments
    this.segments = 200;

    // picking related attributes
    this.raycaster = new THREE.Raycaster();
    this.raycaster.near = 0.1;
    this.raycaster.far = 100;

    this.pointer = new THREE.Vector2();
    this.lastIntersectedObj = null;

    this.availableLayers = ['none', 1, 2, 3, 4]
    // 1 -> menu
    // 2 -> powerups and obstacles
    // 3 -> track
    // 4 -> scenario
    this.selectedLayer = this.availableLayers[0]
    this.pickableObjects = []
    this.clickableObjects = []

    document.addEventListener("pointermove", this.onPointerMove.bind(this));
    document.addEventListener("pointerdown", this.onPointerDown.bind(this));
  }

  /**
   * initializes the contents
   */
  init() {
    // set up initial properties
    this.reader = new MyReader(this, this.app, this.startingPoint, this.segments)
    this.previousTime = 0;
    this.speedFactor = 0.5;
    this.keys = {};
    this.rKeyPressed = false;
    this.keyListeners();
    this.parkingLotCars = [];

    this.states = {
      MENU: 'menu',
      COUNTDOWN: 'countdown',
      PLAYING: 'playing',
      FINISHED: 'finished'
    };

    // add an ambient light
    const ambientLight = new THREE.AmbientLight(0x555555, 3);
    this.app.scene.add(ambientLight);

    // add a hemisphere light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    this.app.scene.add(hemiLight);

    // scenario
    this.scenario = new MyScenario(this.app, this.availableLayers[4]);

    // track
    this.reader.readTrack(this.availableLayers[3]);

    // default route
    this.chosenRoute = 1;

    // start menu
    this.selectedLayer = this.availableLayers[1];
    this.menuManager = new MyMenuManager(this.app, this.availableLayers[1], this.pickableObjects, this.clickableObjects);
    this.changeState(this.states.MENU);
    
    // set timeout before getting the billboard image
    setTimeout(() => {
      this.scenario.billboard.getImage();
      this.billboardTime = Date.now();
    }, 100);
  }

  changeState(newState) {
    this.currentState = newState;

    switch (newState) {
      case this.states.MENU:
        this.menuManager.initMainMenu();
        break;
      case this.states.COUNTDOWN:
        this.countdown();
        break;
      case this.states.PLAYING:
        this.startGame();
        break;
      case this.states.FINISHED:
        this.finishGame();
        break;
      default:
        break;
    }
  }

  countdown() {
    // autonomous vehicle
    this.autonomousVehicle = this.reader.autonomousVehicle;

    // player vehicle
    this.playerVehicle = this.reader.playerVehicle;

    // load car models
    /// UNCOMMENT HERE
    /*this.selectedPlayerVehicle.loadModel().then((properties) => {
      this.updatePlayerVehicleModel(properties);
    });*/

    const myCarModelGreen1 = new MyCarModelRed();
    myCarModelGreen1.loadModel().then((properties) => {
      this.updatePlayerVehicleModel(properties);
    });

    /// UNCOMMENT HERE
    /*
    this.selectedOpponentVehicle.loadModel().then((properties) => {
      this.updateAutonomousVehicleModel(properties);
    });*/
    
    const myCarModelGreen2 = new MyCarModelGreen();
    myCarModelGreen2.loadModel().then((properties) => {
      this.updateAutonomousVehicleModel(properties);
    });

    // create finishing line
    this.reader.setFinishLine();

    // create obstacles
    this.reader.readObstacles(this.availableLayers[2]);

    // create power ups
    this.reader.readPowerUps(this.availableLayers[2]);

    // setup player follow camera
    this.app.setActiveCamera('PlayerCarPerspective');
    this.app.updateCameraIfRequired();
    this.app.activeCamera.position.set(this.playerVehicle.position.x + 15 * Math.cos(-this.playerVehicle.carOrientation), this.playerVehicle.position.y + 10, this.playerVehicle.position.z + 10 * Math.sin(-this.playerVehicle.carOrientation));
    this.app.controls.target = new THREE.Vector3(this.playerVehicle.position.x - 15 * Math.cos(-this.playerVehicle.carOrientation), this.playerVehicle.position.y, this.playerVehicle.position.z - 10 * Math.sin(-this.playerVehicle.carOrientation));

    // countdown
    const countdownNumbers = ['3', '2', '1', 'GO!'];
    let i = 0;

    // countdown position relative to the player vehicle
    let countdownPosition = new THREE.Vector3(this.playerVehicle.position.x, this.playerVehicle.position.y + 8, this.playerVehicle.position.z + 0.5);

    const countdownLoop = () => {
      const countdownNumber = countdownNumbers[i];
      let countdownMesh = null;
      if(countdownNumber === 'GO!') {
        const countdownMesh1 = this.spritesheetTitle2.getText('G'); // get the mesh for the current letter
        const countdownMesh2 = this.spritesheetTitle2.getText('O!'); // get the mesh for the current letter
        countdownMesh1.position.z += 0.15;
        countdownMesh1.position.x -= 0.35;
        countdownMesh2.position.x += 0.45;
        countdownMesh = new THREE.Group();
        countdownMesh.add(countdownMesh1);
        countdownMesh.add(countdownMesh2);
      }
      else{
        countdownMesh = this.spritesheetTitle2.getText(countdownNumber); // get the mesh for the current number
      }
      this.setPosAndRotRelativeToCamera(countdownMesh, this.app.activeCamera, countdownPosition, 15);
      countdownMesh.scale.set(5, 5, 1);
      this.app.scene.add(countdownMesh);

      // countdown animation
      setTimeout(() => {
        this.app.scene.remove(countdownMesh);
        i++;
        if (i < countdownNumbers.length) {
          countdownLoop();
        }
        else {
          // start game, once the countdown is finished
          this.changeState(this.states.PLAYING);
        }
      }, 1000);
    }

    countdownLoop();
  }

  /**
   * starts the game
   */
  startGame() {
    // UNCOMMENT HERE
    // this.reader.level = this.selectedLevel;
    this.reader.level = 1;
    this.numLaps = 3;
    this.timeLimit = 150000; // milliseconds
    this.timeStart = Date.now();
    this.playerLaps = 0;
    this.playerTime = 0;
    this.playerCheckPoints = [];
    this.autoLaps = 0;
    this.autoTime = 0;
    this.autoCheckPoints = [];
    this.reader.level = 1//this.selectedLevel; //this.reader.level = 1;
    this.previousTime = 0;
    this.timeBeforePause = 0;
    this.speedFactor = 0.8;
    this.keys = {};
    this.rKeyPressed = false;
    this.spaceKeyPressed = false;
    this.paused = false;
    this.keyListeners();

    // create and add the HUD
    this.HUD = new MyHUD(this.app, this.spritesheetTitle3);
    this.app.scene.add(this.HUD);

    // set up the route and timer for the autonomous car to start
    this.reader.readRoutes();
    this.mixer = this.reader.mixer;

    // set cloud under car (for when it is out of track)
    this.scenario.setCloudUnderCar(this.playerVehicle.position);

    // set obstacles parking lot
    this.scenario.setObstaclesParkingLot(new MyObstacle(this.app, "slip", new THREE.TextureLoader().load("textures/obstacle_slip.png"), Math.PI / 2, this.availableLayers[2]), 0, 36.5);
    this.scenario.setObstaclesParkingLot(new MyObstacle(this.app, "switch", new THREE.TextureLoader().load("textures/obstacle_switchdirections.png"), 0, this.availableLayers[2]), Math.PI / 2, 35.5);
    this.scenario.addObstacleSkyscraperText();
  }

  /**
   * finishes the game
   */
  finishGame() {
    this.app.setActiveCamera('PodiumPerspective');
    this.fireworks = [];
    // set podium
    this.scenario.setPodium();

    // reset lap and time counters
    this.playerLaps = 0;
    this.playerTime = 0;
    this.autoLaps = 0;
    this.autoTime = 0;

    console.log("FINISHED GAME");
  }

  /**
   * updates the player vehicle model
   * @param {array} properties - array containing the properties of the model
   */
  updatePlayerVehicleModel(properties) {
    // read the properties
    this.reader.readPlayerVehicle(properties[3], properties[4], properties[5], properties[6])

    // update the player vehicle
    this.playerVehicle = this.reader.playerVehicle;
    this.playerVehicle.setModel(properties[1]);

    // add the player vehicle to the scene
    this.app.scene.add(this.playerVehicle);
  }

  updateAutonomousVehicleModel(properties) {
    this.reader.readAutonomousVehicle(properties[3], properties[4], properties[5], properties[6])
    this.autonomousVehicle = this.reader.autonomousVehicle;
    this.autonomousVehicle.setModel(properties[1]);
    this.app.scene.add(this.autonomousVehicle);
  }

  keyListeners() {
    document.addEventListener('keydown', this.keyDown.bind(this), false);
    document.addEventListener('keyup', this.keyUp.bind(this), false);
  }

  keyDown(event) {
    this.keys[event.code] = true;
  }

  keyUp(event) {
    this.keys[event.code] = false;

    if (event.code === 'KeyR') {
      this.rKeyPressed = false;
    }

    if (event.code === 'Space') {
      this.spaceKeyPressed = false;
    }
  }


  checkKeys() {
    let speed = this.speedFactor;
    let turnSpeed = speed / 30;

    let isSwitch = this.reader.isAppliedModifier("switch");

    if (this.keys['KeyW'])
      this.playerVehicle.accelerate(speed);

    if (this.keys['KeyX'])
      this.playerVehicle.decelerate(speed);

    if (this.keys['KeyA'])
      this.playerVehicle.shouldStop = true;

    if (this.keys['KeyS']) {
      if (!isSwitch) this.playerVehicle.turn(turnSpeed); //the higher the number that divides speed factor -> the smaller is the turning angle
      else this.playerVehicle.turn(-turnSpeed);
    }

    if (this.keys['KeyD']) {
      if (!isSwitch) this.playerVehicle.turn(-turnSpeed);
      else this.playerVehicle.turn(turnSpeed);
    }

    if (this.keys['KeyR'] && !this.rKeyPressed) {
      this.rKeyPressed = true;
      this.playerVehicle.reverse();
    }

    if (this.keys['KeyP'])
      this.playerVehicle.reset();

    if (this.keys['Space'] && !this.spaceKeyPressed) {
      this.spaceKeyPressed = true;
      this.paused = !this.paused;
      if(this.paused) {
        this.timeBeforePause = Date.now();
        console.log("paused");
      }
      else {
        this.timeStart += Math.floor((Date.now() - this.timeBeforePause));
      }
    }

    return speed;
  }

  /**
   * Creates the axis
   */
  createAxis() {
    if (this.axis === null) {
      // create and attach the axis to the scene
      this.axis = new MyAxis(this)
      this.app.scene.add(this.axis)
    }
  }

  /**
   * Called when user changes number of segments in UI. Recreates the track's objects accordingly.
   */
  updateTrack() {
    if (this.track !== undefined && this.track !== null) {
      this.app.scene.remove(this.track);
    }
    this.buildTrack();
  }

  /**
   * Called when user track's closed parameter in the UI. Recreates the track's objects accordingly.
   */
  updateTrackClosing() {
    if (this.track !== undefined && this.track !== null) {
      this.app.scene.remove(this.track);
    }
    this.buildTrack();
  }

  /**
   * Called when user changes number of texture repeats in UI. Updates the repeat vector for the curve's texture.
   * @param {number} value - repeat value in S (or U) provided by user
   */
  updateTextureRepeat(value) {
    this.material.map.repeat.set(value, 3);
  }

  /**
   * Called when user changes track line visibility. Shows/hides line object.
   */
  updateTrackLineVisibility() {
    this.track.line.visible = this.showTrackLine;
  }

  /**
   * Called when user changes track wireframe visibility. Shows/hides wireframe object.
   */
  updateTrackWireframeVisibility() {
    this.track.wireframe.visible = this.showTrackWireframe;
  }

  /**
   * Called when user changes mesh visibility. Shows/hides mesh object.
   */
  updateMeshVisibility() {
    this.mesh.visible = this.showMesh;
  }

  /**
   * updates the contents
   * this method is called from the render method of the app
   */
  update() {
    switch (this.currentState) {
      case this.states.PLAYING:
        this.updatePlayingState();
        break;
      case this.states.FINISHED:
        this.updateFinishedState();
        break;
      default:
        break;
    }
    // update the scenario (in all states)
    const delta = this.clock.getDelta()
    const time = Date.now();
    this.scenario.update(this.playerVehicle, delta, time);
  }

  checkFinalConditions (timePassed) {
    if (timePassed >= this.timeLimit) {
      this.autoTime = this.timeLimit / 1000;
      this.playerTime = this.timeLimit / 1000;
      this.changeState(this.states.FINISHED);
    }
    else {
      if (this.autoLaps === this.numLaps){
        this.autoTime = timePassed / 1000;
        this.autonomousVehicle.shouldStop = true;
      }
      if (this.playerLaps === this.numLaps)
        this.playerTime = timePassed / 1000;
      if (this.autoLaps === this.numLaps && this.playerLaps === this.numLaps) {
        this.changeState(this.states.FINISHED);
      }
    }
  }

  updateCameraPlayer() {
    //console.log(this.playerVehicle.carOrientation)
    this.app.activeCamera.position.set(this.playerVehicle.position.x + 15 * Math.cos(-this.playerVehicle.carOrientation), this.playerVehicle.position.y + 10, this.playerVehicle.position.z + 10 * Math.sin(-this.playerVehicle.carOrientation));
    this.app.controls.target = new THREE.Vector3(this.playerVehicle.position.x - 15 * Math.cos(-this.playerVehicle.carOrientation), this.playerVehicle.position.y, this.playerVehicle.position.z - 10 * Math.sin(-this.playerVehicle.carOrientation));
    this.scenario.clouds.update()

    const distanceFromCamera = 15;
    const hudPosition = new THREE.Vector3().copy(this.app.activeCamera.position)
        .add(this.app.activeCamera.getWorldDirection(new THREE.Vector3()).multiplyScalar(distanceFromCamera));

    hudPosition.y += 8.5;
    this.HUD.position.copy(hudPosition);

    const cameraRotation = this.app.activeCamera.rotation.clone();
    this.HUD.rotation.set(cameraRotation.x, cameraRotation.y, cameraRotation.z);
  }

  updateCameraAutonomous() {
    this.app.activeCamera.position.set(this.autonomousVehicle.position.x + 10 * Math.cos(-this.autonomousVehicle.carOrientation), this.autonomousVehicle.position.y + 8, this.autonomousVehicle.position.z + 10 * Math.sin(-this.autonomousVehicle.carOrientation));
    this.app.controls.target = this.autonomousVehicle.position;
  }

  updateShortcut() {
    const delta = this.clock.getDelta()

    this.reader.shortcutMixer.update(delta);
    this.reader.cloud.cloud.position.copy(this.playerVehicle.position.clone().add(new THREE.Vector3(0, -2, 0)));

    const elapsedTime = this.reader.shortcutAction.time; // Get elapsed time of the animation
    const duration = this.reader.shortcutAction._clip.duration; // Get actual duration
    const tolerance = 0.08;

    if (elapsedTime + tolerance >= duration) {
      this.reader.stopShortcutAnimation();
      this.reader.removeShortcut();
    }
  }

  updateModifiers() {
    const time = Date.now();

    // check if any modifier is applied for more than 15 seconds
    for (let i = 0; i < this.reader.appliedModifiers.length; i++) {
      if (this.reader.appliedModifiers[i] instanceof MyVehicle) {
        if (time - this.reader.appliedModifiersStartTime[i] > 3000)
          this.reader.stopModifier(this.reader.appliedModifiers[i]);
      }
      else if (this.reader.appliedModifiers[i].type !== "shortcut") {
        if (time - this.reader.appliedModifiersStartTime[i] > 6000) {
          this.reader.stopModifier(this.reader.appliedModifiers[i]);
        }
      }
    }
  }

  updatePlayingState() {
    this.raycaster.layers.enableAll()
    if (this.selectedLayer !== 'none') {
      const selectedIndex = this.availableLayers[parseInt(this.selectedLayer)]
      this.raycaster.layers.set(selectedIndex)
    }
    const delta = this.clock.getDelta()
    const time = Date.now();

    let speed = this.checkKeys();

    if (this.paused)
      this.HUD.setPause();

    if (!this.paused) {
      const timePassed = time - this.timeStart;
      this.checkFinalConditions(timePassed);

      // update the autonomous car position and rotation
      if(!this.autonomousVehicle.shouldStop) {
        this.mixer.update(delta);
        // this updates the position of the actual object of MyVehicle class
        if (this.reader.chosenRoute) this.reader.chosenRoute.updateBoundingBox(this.reader.autonomousVehicle);

        if (this.reader.autonomousCheckLineIdx === this.reader.checkKeyLines.length 
          && this.autonomousVehicle.detectCollisionsObject(this.reader.finishingLine, false)) {
          this.autoLaps++;
          this.reader.autonomousCheckLineIdx = 0;
          console.log("auto laps", this.autoLaps)
        }
      }

      this.reader.updateModifiers(this.clock.getElapsedTime());

      if (this.previousTime == 0)
        this.previousTime = time;
      else {
        //update player vehicle
        this.playerVehicle.update(time, speed);

        // check if player vehicle passed the finish line and update laps
        if ((this.reader.caughtShortcut && (this.reader.playerCheckLineIdx >= this.reader.checkKeyLines.length / 2) && this.playerVehicle.detectCollisionsObject(this.reader.finishingLine, false)) || (this.reader.playerCheckLineIdx === this.reader.checkKeyLines.length && this.playerVehicle.detectCollisionsObject(this.reader.finishingLine, false))) {
          this.playerLaps++;
          this.reader.caughtShortcut = false;
          this.reader.playerCheckLineIdx = 0;
          console.log("player laps", this.playerLaps)
        }

        this.previousTime = time;

        this.reader.checkForCollisions(this.scenario.obstacles);

        if (this.followPlayerVehicle) {
          this.updateCameraPlayer();
        }
  
        if (this.followAutonomousVehicle) {
          this.updateCameraAutonomous();
        }

        this.HUD.update(!this.paused, this.numLaps, this.playerLaps, this.timeLimit, time-this.timeStart, this.playerVehicle.maxVelocity, this.playerVehicle.velocity, this.reader.appliedModifiers, this.reader.appliedModifiersStartTime);  

        if (this.reader.shortcut) {
          this.updateShortcut();
        }

        this.updateModifiers();
      }
    }
  }

  updateFinishedState() {
    this.raycaster.layers.enableAll()
    if (this.selectedLayer !== 'none') {
      const selectedIndex = this.availableLayers[parseInt(this.selectedLayer)]
      this.raycaster.layers.set(selectedIndex)
    }
    const delta = this.clock.getDelta()
    const time = Date.now();

    // update the clouds lookAt
    this.scenario.update(this.playerVehicle, delta, time);

    // add new fireworks every 5% of the calls
    if (Math.random() < 0.05) {
      this.fireworks.push(new MyFirework(this.app, this.scenario.fireworksMesh.position))
    }

    // for each fireworks 
    for (let i = 0; i < this.fireworks.length; i++) {
      // is firework finished?
      //if (this.fireworks[i].done) {
      // remove firework 
      //  this.fireworks.splice(i,1) 
      //continue 
      //}
      // otherwise update  firework
      this.fireworks[i].update(delta)
    }
  }

  // picking
  onPointerMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);
    var intersects = this.raycaster.intersectObjects(this.pickableObjects);

    if (intersects.length > 0) {
      document.body.style.cursor = "pointer";
      if (intersects[0].object != this.lastIntersectedObj) {
        this.lastIntersectedObj = intersects[0].object;
        this.menuManager.handleButtonHover(this.lastIntersectedObj)
      }
    }

    else {
      document.body.style.cursor = "default";

      if (this.lastIntersectedObj != null) {
        this.menuManager.resetButtonState(this.lastIntersectedObj);
        this.lastIntersectedObj = null;
      }
    }
  }


  // clicking
  onPointerDown(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);
    var intersects = this.raycaster.intersectObjects(this.clickableObjects);

    if (intersects.length > 0) {
      if (intersects[0].object.name == "clickHereToStart") {
        this.menuManager.initEnterUsernameMenu();
      }
      else if (intersects[0].object.name.startsWith("backButton")) {
        if (document.getElementById("username")) {
          document.body.removeChild(document.getElementById("username"));
        }
        const menuName = intersects[0].object.name.substring(12);
        this.menuManager.initMenu(menuName);
      }
      else if (intersects[0].object.name == "submitUsernameButton") {
        this.username = document.getElementById("username").value;
        if (this.username == "") this.username = "player"
        console.log("username: ", this.username);
        document.body.removeChild(document.getElementById("username"));
        this.menuManager.initChooseLevelMenu();
      }
      else if (intersects[0].object.name.startsWith("level")) {
        this.selectedLevel = parseInt(intersects[0].object.name.substring(5));
        console.log("level: ", this.selectedLevel);
        this.loadPlayerParkingLot();
        this.menuManager.initChoosePlayerVehicleMenu();
      }
      else if (intersects[0].object.name == "rightCarButton") {
        this.menuManager.updateChooseVehicleMenu(1);
      }
      else if (intersects[0].object.name == "leftCarButton") {
        this.menuManager.updateChooseVehicleMenu(-1);
      }
      else if (intersects[0].object.name == "selectPlayerVehicleButton") {
        this.selectedPlayerVehicle = this.availablePlayerVehicles[this.app.activeCameraName];
        console.log("selected player vehicle: ", this.selectedPlayerVehicle);
        this.loadAutonomousParkingLot();
        this.menuManager.initChooseOpponentVehicleMenu();
      }
      else if (intersects[0].object.name == "selectOpponentVehicleButton") {
        this.selectedOpponentVehicle = this.availableOpponentVehicles[this.app.activeCameraName];
        console.log("selected opponent vehicle: ", this.selectedOpponentVehicle);
        this.menuManager.clearCurrentMenu();
        this.app.smoothCameraTransition('PlayerCarPerspective', 1000);
        this.changeState(this.states.COUNTDOWN);
      }
      else if (intersects[0].object.name == "obstacle") {
        const newObstacle = new MyObstacle(this.app, intersects[0].type, intersects[0].texture, intersects.rotate, this.availableLayers[2]);
        console.log(newObstacle)
        newObstacle.setBoundingBox();
        this.app.contents.selectedLayer = this.availableLayers[3];
        this.app.smoothCameraTransition("TrackPerspective", 2000);
      }
      else if (intersects[0].object.name == "track") {
        newObstacle.position.set(intersects[0].point.x, 2, intersects[0].point.z);
      }
    }
  }

  loadPlayerParkingLot() {
    const myCarModelGreen = new MyCarModelGreen();
    myCarModelGreen.loadModel().then((properties) => {
      this.scenario.setPlayerVehicleParkingLot(properties[0], properties[2], 16);
    });
    this.availablePlayerVehicles['PlayerParkingLot4'] = myCarModelGreen;

    const myCarModelOrange = new MyCarModelOrange();
    myCarModelOrange.loadModel().then((properties) => {
      this.scenario.setPlayerVehicleParkingLot(properties[0], properties[2], 16);
    });
    this.availablePlayerVehicles['PlayerParkingLot3'] = myCarModelOrange;

    const myCarModelPurple = new MyCarModelPurple();
    myCarModelPurple.loadModel().then((properties) => {
      this.scenario.setPlayerVehicleParkingLot(properties[0], properties[2], 14.2);
    });
    this.availablePlayerVehicles['PlayerParkingLot2'] = myCarModelPurple;

    const myCarModelRed = new MyCarModelRed();
    myCarModelRed.loadModel().then((properties) => {
      this.scenario.setPlayerVehicleParkingLot(properties[0], properties[2], 14.2);
    });
    this.availablePlayerVehicles['PlayerParkingLot1'] = myCarModelRed;
  }

  loadAutonomousParkingLot() {
    const myCarModelGreen = new MyCarModelGreen();
    myCarModelGreen.loadModel().then((properties) => {
      this.scenario.setAutonomousVehicleParkingLot(properties[0], properties[2], -4);
    });
    this.availableOpponentVehicles['OpponentParkingLot1'] = myCarModelGreen;

    const myCarModelOrange = new MyCarModelOrange();
    myCarModelOrange.loadModel().then((properties) => {
      this.scenario.setAutonomousVehicleParkingLot(properties[0], properties[2], -4);
    });
    this.availableOpponentVehicles['OpponentParkingLot2'] = myCarModelOrange;

    const myCarModelPurple = new MyCarModelPurple();
    myCarModelPurple.loadModel().then((properties) => {
      this.scenario.setAutonomousVehicleParkingLot(properties[0], properties[2], -5.8);
    });
    this.availableOpponentVehicles['OpponentParkingLot3'] = myCarModelPurple;

    const myCarModelRed = new MyCarModelRed();
    myCarModelRed.loadModel().then((properties) => {
      this.scenario.setAutonomousVehicleParkingLot(properties[0], properties[2], -5.8);
    });
    this.availableOpponentVehicles['OpponentParkingLot4'] = myCarModelRed;
  }

  setPosAndRotRelativeToCamera(obj, camera = this.app.activeCamera, target = new THREE.Vector3(0, 0, 0), distance = 30) {
    const direction = new THREE.Vector3().subVectors(target, camera.position).normalize();
    const position = new THREE.Vector3().copy(camera.position).addScaledVector(direction, distance);

    obj.position.copy(position);

    const lookAtMatrix = new THREE.Matrix4().lookAt(camera.position, target, camera.up);
    const rotation = new THREE.Euler().setFromRotationMatrix(lookAtMatrix);
    obj.rotation.set(rotation.x, rotation.y, rotation.z);
  }
}

export { MyContents };

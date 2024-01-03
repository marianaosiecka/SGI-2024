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
import { MyWheelModel } from "./carModels/MyWheelModel.js";
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

    // GUI controls - track related attributes
    this.showTrackWireframe = false;
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

    // game related attributes
    this.keys = {};
    this.rKeyPressed = false;
    this.keyListeners();
    this.winner = null;
    this.loser = null;
    this.reader = new MyReader(this, this.app, this.startingPoint)
    this.previousTime = 0;
    this.speedFactor = 0.5;

    this.parkingLotCars = [];

    // load the spritesheets
    this.spritesheetTitle1 = new MySpritesheet('spritesheets/spritesheet_title_1.png', 10, 10);
    this.spritesheetTitle2 = new MySpritesheet('spritesheets/spritesheet_title_2.png', 10, 10);
    this.spritesheetTitle3 = new MySpritesheet('spritesheets/spritesheet_title_3.png', 10, 10);
    this.spritesheetRegularBlack = new MySpritesheet('spritesheets/spritesheet_regular_black.png', 10, 10);
    this.spritesheetRegularWhite = new MySpritesheet('spritesheets/spritesheet_regular_white.png', 10, 10);

    // curve segments
    this.trackSegments = 200;

    // picking related attributes
    this.raycaster = new THREE.Raycaster();
    this.raycaster.near = 0.1;
    this.raycaster.far = 300;

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

    // event listeners
    document.addEventListener("pointermove", this.onPointerMove.bind(this));
    document.addEventListener("pointerdown", this.onPointerDown.bind(this));

    // states
    this.states = {
      MENU: 'menu',
      COUNTDOWN: 'countdown',
      PLAYING: 'playing',
      FINISHED: 'finished'
    };
  }

  /**
   * initializes the contents
   */
  init() {
    // add an ambient light
    const ambientLight = new THREE.AmbientLight(0x555555, 3);
    this.app.scene.add(ambientLight);

    // add a hemisphere light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    this.app.scene.add(hemiLight);

    // scenario
    this.scenario = new MyScenario(this.app, this.availableLayers[4]);

    // track
    this.reader.readTrack(this.availableLayers[3], this.trackSegments);

    // start menu
    this.selectedLayer = this.availableLayers[1];
    this.menuManager = new MyMenuManager(this.app, this.availableLayers[1], this.pickableObjects, this.clickableObjects);
    this.changeState(this.states.MENU);

    // set timeout before getting the first billboard image (for the shaders to be loaded)
    setTimeout(() => {
      this.scenario.billboard.getImage();
      this.billboardTime = Date.now();
    }, 200);
  }

  /**
   * changes the state of the game
   * @param {string} newState - the new state of the game
   */
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

  /**
   * starts the countdown
   */
  countdown() {
    // update selected layer to 1 (menu layer)
    this.selectedLayer = this.availableLayers[0];
    this.updateSelectedLayer();

    // SET REST OF THE SCENE
    // autonomous vehicle
    this.autonomousVehicle = this.reader.autonomousVehicle;
    // player vehicle
    this.playerVehicle = this.reader.playerVehicle;
    
    // set car models
    this.updatePlayerVehicleModel(this.selectedPlayerVehicle.properties);
    this.app.scene.remove(this.selectedPlayerVehicle.properties[0]) // remove the car from the parking lot
    this.updateAutonomousVehicleModel(this.selectedOpponentVehicle.properties);
    this.app.scene.remove(this.selectedOpponentVehicle.properties[0]) // remove the car from the parking lot
    
    // load and set wheel model
    const wheel = new MyWheelModel();
    wheel.loadModel().then((properties) => {
      this.playerVehicle.setWheelModel(properties);
      this.autonomousVehicle.setWheelModel(properties);
    });

    // finishing line
    this.reader.setFinishLine();
    // obstacles
    this.reader.readObstacles(this.availableLayers[2]);
    // power ups
    this.reader.readPowerUps(this.availableLayers[2]);

    // CAMERA
    // set active camera as the player car perspective
    this.app.setActiveCamera('PlayerCarPerspective');

    // START COUNTDOWN
    const countdownNumbers = ['3', '2', '1'];
    let i = 0;

    const countdownLoop = () => {
      const countdownNumber = countdownNumbers[i];
      let countdownMesh = this.spritesheetTitle2.getText(countdownNumber); // get the mesh for the current number
      this.setPosAndRotRelativeToCamera(countdownMesh, this.app.activeCamera, this.app.controls.target, 15); // set the position and rotation of the mesh relative to the camera
      countdownMesh.scale.set(5.5, 5.5, 5.5);
      this.app.scene.add(countdownMesh);

      // countdown animation
      setTimeout(() => {
        this.app.scene.remove(countdownMesh);
        i++;
        if (i < countdownNumbers.length) {
          countdownLoop();
        }
        // once the countdown is finished
        else {
          // add the "GO!" mesh
          let countdownMesh = this.spritesheetTitle2.getText("GO!");
          this.setPosAndRotRelativeToCamera(countdownMesh, this.app.activeCamera, this.app.controls.target, 15);
          countdownMesh.scale.set(5.5, 5.5, 5.5);
          this.app.scene.add(countdownMesh);
          // remove the "GO!" mesh after 1 second
          setTimeout(() => {
            this.app.scene.remove(countdownMesh);
          }, 1000);

          // start game
          this.changeState(this.states.PLAYING);
        }
      }, 1000); // 1 second between each number
    }

    countdownLoop();
  }

  /**
   * starts the game
   */
  startGame() {
    // UNCOMMENT HERE
    this.reader.level = this.selectedLevel;
    this.numLaps = 1;
    this.timeLimit = 150000; // milliseconds
    this.timeStart = Date.now();
    this.playerLaps = 0;
    this.playerTime = 0;
    this.playerCheckPoints = [];
    this.autoLaps = 0;
    this.autoTime = 0;
    this.autoCheckPoints = [];
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
    this.reader.readRoutes(this.autonomousVehicle.depth);
    this.autonomousMixer = this.reader.mixer;

    // set cloud under car (for when it is out of track)
    this.scenario.setCloudUnderCar(this.playerVehicle.position);

    // set obstacles parking lot
    this.scenario.setObstaclesParkingLot(new MyObstacle(this.app, "slip", new THREE.TextureLoader().load("textures/obstacle_slip.png"), Math.PI / 2, this.availableLayers[2]), 0, 21.5);
    this.scenario.setObstaclesParkingLot(new MyObstacle(this.app, "switch", new THREE.TextureLoader().load("textures/obstacle_switchdirections.png"), 0, this.availableLayers[2]), Math.PI / 2, 20.5);
    this.scenario.addObstacleSkyscraperText();
  }

  /**
   * finishes the game
   */
  finishGame() {
    this.selectedLayer = this.availableLayers[1];
    this.updateSelectedLayer();

    // UNCOMMENT HERE
    /*
    this.playerTime = 0
    this.autoTime = 0
    this.reader.level = 0
    this.username = "player"*/

    this.app.scene.remove(this.HUD)
    this.app.smoothCameraTransition('PodiumPerspective', 16000);
    // UNCOMMENT HERE
    /*this.app.setActiveCamera('PodiumPerspective');
    this.app.updateCameraIfRequired();
 
    const myCarModelGreen1 = new MyCarModelRed();
    myCarModelGreen1.loadModel().then((properties) => {
      this.updatePlayerVehicleModel(properties);
      this.winner = this.playerVehicle;
    });

    const myCarModelGreen2 = new MyCarModelGreen();
    myCarModelGreen2.loadModel().then((properties) => {
      this.updateAutonomousVehicleModel(properties);
      this.loser = this.autonomousVehicle;
    });*/

    this.fireworks = [];
    //setTimeout(() => {
    // set podium
    this.scenario.setPodium(this.winner, this.loser);

    this.menuManager.initFinishMenu(this.playerTime, this.autoTime, this.reader.level, this.username);
    //}, 300);

    // reset lap and time counters
    this.playerLaps = 0;
    this.playerTime = 0;
    this.autoLaps = 0;
    this.autoTime = 0;
    this.winner = null;
    this.loser = null;

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

    if (this.keys['Space'] && !this.spaceKeyPressed) {
      this.spaceKeyPressed = true;
      this.paused = !this.paused;
      if (this.paused) {
        this.timeBeforePause = Date.now();
        console.log("paused");
        this.HUD.visible = false;
      }
      else {
        this.timeStart += Math.floor((Date.now() - this.timeBeforePause));
        this.HUD.visible = true;
      }
    }

    if (this.paused) return;

    let isSwitch = this.reader.isAppliedModifier("switch");

    if (this.keys['KeyW'])
      this.playerVehicle.accelerate(speed);

    if (this.keys['KeyS'])
      this.playerVehicle.decelerate(speed);

    if (this.keys['KeyA']) {
      if (!isSwitch) this.playerVehicle.turn(turnSpeed); //the higher the number that divides speed factor -> the smaller is the turning angle
      else this.playerVehicle.turn(-turnSpeed);
    }

    if (this.keys['KeyX']) 
      this.playerVehicle.shouldStop = true; 
    

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
  }

  /**
   * updates the contents
   * this method is called from the render method of the app
   */
  update() {
    // update the scenario (in all states)
    const delta = this.clock.getDelta()
    const time = Date.now();
    this.scenario.update(this.playerVehicle, delta, time);

    switch (this.currentState) {
      case this.states.PLAYING:
        this.updatePlayingState(delta);
        break;
      case this.states.FINISHED:
        this.updateFinishedState();
        break;
      default:
        break;
    }
  }

  checkFinalConditions(timePassed) {
    if (timePassed >= this.timeLimit) {
      this.autoTime = this.timeLimit / 1000;
      this.playerTime = this.timeLimit / 1000;
      this.winner = this.playerVehicle;
      this.loser = this.autonomousVehicle;
      this.changeState(this.states.FINISHED);
      return;
    }
    else {
      if (this.autoLaps === this.numLaps) {
        this.autoTime = timePassed / 1000;
        this.autonomousVehicle.shouldStop = true;
        if (this.playerLaps !== this.numLaps) {
          this.winner = this.autonomousVehicle;
          this.loser = this.playerVehicle;
        }
      }
      if (this.playerLaps === this.numLaps) {
        this.playerTime = timePassed / 1000;
        if (this.autoLaps !== this.numLaps) {
          this.winner = this.playerVehicle;
          this.loser = this.autonomousVehicle;
          this.autonomousVehicle.shouldStop = true;
          this.autoTime = this.reader.chosenRoute.animationMaxDuration;
          this.changeState(this.states.FINISHED);
          return;
        }
      }
      if (this.autoLaps === this.numLaps && this.playerLaps === this.numLaps) {
        this.changeState(this.states.FINISHED);
        return;
      }
    }
  }
  
  getCarCameraPosition(car) {
    let cameraOffset = new THREE.Vector3(16, 10, 0);
    let carPosition = new THREE.Vector3();
    car.getWorldPosition(carPosition);
    const carQuartenion = new THREE.Quaternion();
    car.getWorldQuaternion(carQuartenion);
    cameraOffset = cameraOffset.applyQuaternion(carQuartenion);
    carPosition = carPosition.add(cameraOffset);
    return carPosition;
  }

  getCarCameraTarget(car) {
    return new THREE.Vector3(car.position.x, car.position.y + 5, car.position.z);
  }

  updateCameraPlayer() {
    if (this.paused) return;
    // update position
    this.app.activeCamera.position.copy(this.getCarCameraPosition(this.playerVehicle));

    // update target
    this.app.controls.target = this.getCarCameraTarget(this.playerVehicle);

    this.scenario.clouds.updateAllClouds()

    // pode ser chamado no countdown
    if (this.HUD) {
      this.setPosAndRotRelativeToCamera(this.HUD, this.app.activeCamera, this.app.controls.target, 15);
      this.HUD.position.y += 8.5;
    }
  }

  updateCameraAutonomous() {
    if(this.paused) return;

    // update position
    this.app.activeCamera.position.copy(this.getCarCameraPosition(this.autonomousVehicle));

    // update target
    this.app.controls.target = this.getCarCameraTarget(this.autonomousVehicle);

    this.scenario.clouds.updateAllClouds()
  }

  updateShortcut(delta) {
    this.reader.shortcutMixer.update(delta);
    this.reader.cloud.position.copy(this.playerVehicle.position.clone().add(new THREE.Vector3(0, -2, 0)));

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
        if (this.reader.appliedModifiers[i].type === "pick") {
          this.reader.stopModifier(this.reader.appliedModifiers[i]);
        }
        else if (time - this.reader.appliedModifiersStartTime[i] > 6000) {
          this.reader.stopModifier(this.reader.appliedModifiers[i]);
        }
      }
    }
  }

  updatePlayingState(delta) {
    this.raycaster.layers.enableAll()

    const time = Date.now();

    this.checkKeys();

    if (this.paused)
      this.HUD.setPause();

    else {
      const timePassed = time - this.timeStart;
      this.checkFinalConditions(timePassed);

      // update the autonomous car position and rotation
      if (!this.autonomousVehicle.shouldStop) {
        this.autonomousMixer.update(delta);
        // this updates the position of the actual object of MyVehicle class
        if (this.reader.chosenRoute) this.reader.chosenRoute.updateBoundingBox(this.reader.autonomousVehicle, this.reader.track);

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
        this.playerVehicle.update(time, this.speedFactor);

        // check if player vehicle passed the finish line and update laps
        if ((this.reader.caughtShortcut && (this.reader.playerCheckLineIdx >= this.reader.checkKeyLines.length / 2) && this.playerVehicle.detectCollisionsObject(this.reader.finishingLine, false)) || (this.reader.playerCheckLineIdx === this.reader.checkKeyLines.length && this.playerVehicle.detectCollisionsObject(this.reader.finishingLine, false))) {
          this.playerLaps++;
          this.reader.caughtShortcut = false;
          this.reader.playerCheckLineIdx = 0;
          console.log("player laps", this.playerLaps)
        }

        this.reader.checkForCollisions(this.scenario.obstacles);

        this.HUD.update(!this.paused, this.numLaps, this.playerLaps, this.timeLimit, time - this.timeStart, this.playerVehicle.maxVelocity, this.playerVehicle.velocity, this.reader.appliedModifiers, this.reader.appliedModifiersStartTime);

        if (this.reader.shortcut) {
          this.updateShortcut(delta);
        }

        this.updateModifiers();
      }
    }

    this.previousTime = time;

    if (this.followPlayerVehicle) {
      this.updateCameraPlayer();
      this.HUD.visible = true;
    }

    else this.HUD.visible = false;

    if (this.followAutonomousVehicle) {
      this.updateCameraAutonomous();
    }

  }

  updateFinishedState() {
    const delta = this.clock.getDelta()
    // add new fireworks every 5% of the calls
    if (Math.random() < 0.05) {
      const newFirework = new MyFirework(this.app, this.scenario.fireworksMesh.position)
      this.fireworks.push(newFirework)
      this.scenario.podium.add(newFirework.points)
    }

    // for each fireworks 
    for (let i = 0; i < this.fireworks.length; i++) {
      // otherwise update  firework
      this.fireworks[i].update(delta)
    }
  }

  /**
   * deals with the pointer move event
   * @param {event} event - the event
   */
  onPointerMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);
    // get the objects that intersect with the raycaster in the pickable objects array
    let intersects = this.raycaster.intersectObjects(this.pickableObjects);

    if (intersects.length > 0) {
      document.body.style.cursor = "pointer"; // change the cursor to pointer

      // if the object intersected is different from the last intersected object, change its state
      if (intersects[0].object != this.lastIntersectedObj) {
        this.lastIntersectedObj = intersects[0].object;
        // if the selected layer is the menu, change the button state in the menu manager
        if (this.selectedLayer == this.availableLayers[1]) this.menuManager.handleButtonHover(this.lastIntersectedObj)

        // if the selected layer is the obstacles layer, change the obstacle state in the scenario
        else if (this.selectedLayer == this.availableLayers[2]) this.scenario.handleObstacleHover(this.lastIntersectedObj);
      }
    }

    else {
      document.body.style.cursor = "default"; // change the cursor to default

      if (this.lastIntersectedObj != null) {
        // if the selected layer is the menu, reset the button state in the menu manager
        if (this.selectedLayer == this.availableLayers[1]) this.menuManager.resetButtonState(this.lastIntersectedObj);

        // if the selected layer is the obstacles layer, reset the obstacle state in the scenario
        else if (this.selectedLayer == this.availableLayers[2]) this.scenario.resetObstacleState(this.lastIntersectedObj);
        this.lastIntersectedObj = null;
      }
    }
  }

  /**
   * deals with the pointer down event
   * @param {event} event - the event
   */
  onPointerDown(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1; // get the x coordinate of the pointer
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1; // get the y coordinate of the pointer
    this.raycaster.setFromCamera(this.pointer, this.app.activeCamera); // set the raycaster from the camera and the pointer

    // get the objects that intersect with the raycaster in the clickable objects array
    let intersects = this.raycaster.intersectObjects(this.clickableObjects);

    if (intersects.length > 0) {
      // MENU EVENTS
      // "click here to start" button - go to the enter username menu
      if (intersects[0].object.name == "clickHereToStart") {
        if(this.app.activeCameraName == "MainMenuPerspective") this.menuManager.initEnterUsernameMenu();
      }

      else if (intersects[0].object.name.startsWith("backButton")) {
        // if the document contains the username input field, remove it
        if (document.getElementById("username")) {
          document.body.removeChild(document.getElementById("username"));
        }
        const menuName = intersects[0].object.name.substring(12);
        this.menuManager.initMenu(menuName);
      }

      // "submit username" button - go to the choose level menu
      else if (intersects[0].object.name == "submitUsernameButton") {
        this.username = document.getElementById("username").value;
        if(this.username == "") this.username = "player" // default username
        console.log("username: ", this.username);
        document.body.removeChild(document.getElementById("username")); // remove the input field
        this.menuManager.initChooseLevelMenu();
      }

      // "select level" button - go to the choose player vehicle menu
      else if (intersects[0].object.name.startsWith("level")) {
        this.selectedLevel = parseInt(intersects[0].object.name.substring(5)); // set the selected level
        console.log("level: ", this.selectedLevel);
        this.loadPlayerParkingLot();
        this.menuManager.initChoosePlayerVehicleMenu();
      }

      // "right arrow car" button - go to the next car
      else if (intersects[0].object.name == "rightCarButton") {
        this.menuManager.updateChooseVehicleMenu(1);
      }

      // "left arrow car" button - go to the previous car
      else if (intersects[0].object.name == "leftCarButton") {
        this.menuManager.updateChooseVehicleMenu(-1);
      }

      // "select car player" button - go to the choose autonomous vehicle menu
      else if (intersects[0].object.name == "selectPlayerVehicleButton") {
        this.selectedPlayerVehicle = this.availablePlayerVehicles[this.app.activeCameraName];
        console.log("selected player vehicle: ", this.selectedPlayerVehicle);
        if(this.selectedPlayerVehicle){
          this.loadAutonomousParkingLot();
          this.menuManager.initChooseOpponentVehicleMenu();
        }
      }

      // "select car autonomous" button - go to the countdown
      else if (intersects[0].object.name == "selectOpponentVehicleButton") {
        this.selectedOpponentVehicle = this.availableOpponentVehicles[this.app.activeCameraName];
        console.log("selected opponent vehicle: ", this.selectedOpponentVehicle);
        if(this.selectedOpponentVehicle){
          this.menuManager.clearCurrentMenu();
          this.changeState(this.states.COUNTDOWN);
        }
      }

      // "redo run" button - go to the countdown
      else if (intersects[0].object.name == "redoRunButton") {
        this.menuManager.clearCurrentMenu();
        this.app.scene.remove(this.scenario.podium)
        this.fireworks.forEach(firework => {
          firework.reset()
        });
        this.changeState(this.states.COUNTDOWN);
      }

      // "main menu" button - go to the main menu
      else if (intersects[0].object.name == "mainMenuButton") {
        this.menuManager.clearCurrentMenu();
        this.app.scene.remove(this.scenario.podium)
        this.fireworks.forEach(firework => {
          firework.reset()
        });
        this.changeState(this.states.MENU);
      }

      // ADD NEW OBSTACLE POWERUP EVENTS
      // new obstacle selected - create obstacle object and go to the track perspective
      else if (intersects[0].object.name.startsWith("newObstacle")) {
        const type = intersects[0].object.name.substring(11); // get the type of the obstacle
        const rotate = type == "slip" ? Math.PI / 2 : 0; // get the rotation of the obstacle
        const texture = type == "slip" ? new THREE.TextureLoader().load("textures/obstacle_slip.png") : new THREE.TextureLoader().load("textures/obstacle_switchdirections.png"); // get the texture of the obstacle
        // create new obstacle
        this.newObstacle = new MyObstacle(this.app, type, texture, rotate, this.availableLayers[2]);
        console.log("new obstacle ", this.newObstacle)

        // reset picking and clickable objects
        this.pickableObjects.length = 0;
        this.clickableObjects.length = 0;

        // transition to track perspective
        this.app.smoothCameraTransition("TrackPerspective", 2000);

        // update selected layer, picking and clickable objects
        this.selectedLayer = this.availableLayers[3];
        this.updateSelectedLayer();
        this.pickableObjects.push(this.reader.track);
        this.clickableObjects.push(this.reader.track);
      }

      // track selected - place obstacle in the track
      else if (intersects[0].object.name == "track") {
        // get the position of the intersection
        const newObstaclePosition = new THREE.Vector3(intersects[0].point.x, 1, intersects[0].point.z);
        this.newObstacle.mesh.position.copy(newObstaclePosition);
        if (this.newObstacle.type == "switch") this.newObstacle.mesh.position.y += 3;
        this.newObstacle.mesh.name = ""; // remove the name of the mesh
        this.newObstacle.setBoundingBox(); // set the bounding box of the obstacle
        this.reader.obstacles.push(this.newObstacle); // add the obstacle to the obstacles array

        // add the obstacle to the scene
        this.app.scene.add(this.newObstacle.mesh);

        // reset picking and clickable objects and put put selected layer to none
        this.pickableObjects.length = 0;
        this.clickableObjects.length = 0;
        this.selectedLayer = this.availableLayers[0];

        // transition to player car perspective
        this.app.setActiveCamera("PlayerCarPerspective");
        this.updateCameraPlayer(); // update camera position and target

        // put paused to false
        this.app.contents.paused = false;
      }
    }
  }

  /**
   * updates the selected layer
   */
  updateSelectedLayer() {
    this.raycaster.layers.enableAll()
    if (this.selectedLayer !== 'none') {
      const selectedIndex = this.availableLayers[parseInt(this.selectedLayer)]
      this.raycaster.layers.set(selectedIndex)
    }
  }


  /**
   * loads the player parking lot
   */
  loadPlayerParkingLot() {
    const myCarModelGreen = new MyCarModelGreen();
    myCarModelGreen.loadModel().then((properties) => {
      myCarModelGreen.properties = properties;
      this.scenario.setPlayerVehicleParkingLot(properties[0], properties[2], 16);
    });
    this.availablePlayerVehicles['PlayerParkingLot4'] = myCarModelGreen;

    const myCarModelOrange = new MyCarModelOrange();
    myCarModelOrange.loadModel().then((properties) => {
      myCarModelOrange.properties = properties;
      this.scenario.setPlayerVehicleParkingLot(properties[0], properties[2], 16);
    });
    this.availablePlayerVehicles['PlayerParkingLot3'] = myCarModelOrange;

    const myCarModelPurple = new MyCarModelPurple();
    myCarModelPurple.loadModel().then((properties) => {
      myCarModelPurple.properties = properties;
      this.scenario.setPlayerVehicleParkingLot(properties[0], properties[2], 14.2);
    });
    this.availablePlayerVehicles['PlayerParkingLot2'] = myCarModelPurple;

    const myCarModelRed = new MyCarModelRed();
    myCarModelRed.loadModel().then((properties) => {
      myCarModelRed.properties = properties;
      this.scenario.setPlayerVehicleParkingLot(properties[0], properties[2], 14.2);
    });
    this.availablePlayerVehicles['PlayerParkingLot1'] = myCarModelRed;
  }

  /**
   * loads the autonomous parking lot
   */
  loadAutonomousParkingLot() {
    const myCarModelGreen = new MyCarModelGreen();
    myCarModelGreen.loadModel().then((properties) => {
      myCarModelGreen.properties = properties;
      this.scenario.setAutonomousVehicleParkingLot(properties[0], properties[2], -4);
    });
    this.availableOpponentVehicles['OpponentParkingLot1'] = myCarModelGreen;

    const myCarModelOrange = new MyCarModelOrange();
    myCarModelOrange.loadModel().then((properties) => {
      myCarModelOrange.properties = properties;
      this.scenario.setAutonomousVehicleParkingLot(properties[0], properties[2], -4);
    });
    this.availableOpponentVehicles['OpponentParkingLot2'] = myCarModelOrange;

    const myCarModelPurple = new MyCarModelPurple();
    myCarModelPurple.loadModel().then((properties) => {
      myCarModelPurple.properties = properties;
      this.scenario.setAutonomousVehicleParkingLot(properties[0], properties[2], -5.8);
    });
    this.availableOpponentVehicles['OpponentParkingLot3'] = myCarModelPurple;

    const myCarModelRed = new MyCarModelRed();
    myCarModelRed.loadModel().then((properties) => {
      myCarModelRed.properties = properties;
      this.scenario.setAutonomousVehicleParkingLot(properties[0], properties[2], -5.8);
    });
    this.availableOpponentVehicles['OpponentParkingLot4'] = myCarModelRed;
  }

  /**
   * sets the position and rotation of an object relative to the camera
   * @param {THREE.Object3D} obj - the object to be positioned and rotated
   * @param {THREE.Camera} camera - the camera to be used as reference
   * @param {THREE.Vector3} target - the target to be used as reference
   * @param {number} distance - the distance from the object to the camera
   */
  setPosAndRotRelativeToCamera(obj, camera = this.app.activeCamera, target = new THREE.Vector3(0, 0, 0), distance = 30) {
    const direction = new THREE.Vector3().subVectors(target, camera.position).normalize();
    const position = new THREE.Vector3().copy(camera.position).addScaledVector(direction, distance);

    obj.position.copy(position);

    const lookAtMatrix = new THREE.Matrix4().lookAt(camera.position, target, camera.up);
    const rotation = new THREE.Euler().setFromRotationMatrix(lookAtMatrix);
    obj.rotation.set(rotation.x, rotation.y, rotation.z);
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
    if (this.reader.track !== undefined && this.reader.track !== null) {
      this.app.scene.remove(this.reader.track);
    }
    this.reader.readTrack(this.availableLayers[3], this.trackSegments);
  }

  /**
   * Called when user track's closed parameter in the UI. Recreates the track's objects accordingly.
   */
  updateTrackClosing() {
    if (this.reader.track !== undefined && this.reader.track !== null) {
      this.app.scene.remove(this.reader.track);
    }
    this.reader.readTrack(this.availableLayers[3], this.trackSegments);
  }

  /**
   * Called when user changes track wireframe visibility. Shows/hides wireframe object.
   */
  updateTrackWireframeVisibility() {
    this.reader.track.wireframe.visible = this.showTrackWireframe;
  }

  /**
   * Called when user changes mesh visibility. Shows/hides mesh object.
   */
  updateMeshVisibility() {
    this.mesh.visible = this.showMesh;
  }
}

export { MyContents };

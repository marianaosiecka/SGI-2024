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

    this.clock = new THREE.Clock()
    this.followPlayerVehicle = false;
    this.followAutonomousVehicle = false;

    this.startingPoint = new THREE.Vector3(32, 1.7, -117);

    this.showTrackWireframe = false;
    this.showTrackLine = true;
    this.trackClosedCurve = false;

    this.levels = [1, 2, 3];
    // menu related attributes
    this.username = null;
    this.selectedLevel = null;
    this.availablePlayerVehicles = [];
    this.selectedPlayerVehicle = null;
    this.availableOpponentVehicles = [];
    this.selectedOpponentVehicle = null;

    this.playing = false;

    //Curve related attributes
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
    // CREATE THE SCENE
    this.reader = new MyReader(this, this.app, this.startingPoint, this.segments)
    this.previousTime = 0;
    this.speedFactor = 0.5;
    this.keys = {};
    this.rKeyPressed = false;
    this.keyListeners();
    this.createAxis();
    this.parkingLotCars = [];

    // LIGHTS
    // add a point light on top of the model
    const pointLight = new THREE.PointLight(0xffffff, 3000);
    pointLight.position.set(0, 50, -10);
    //this.app.scene.add(pointLight);

    // add an ambient light
    const ambientLight = new THREE.AmbientLight(0x555555, 3);
    this.app.scene.add(ambientLight);

    // add a hemisphere light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    this.app.scene.add(hemiLight);

    // SCENARIO
    this.scenario = new MyScenario(this.app, this.availableLayers[4]);

    // TRACK
    this.reader.readTrack(this.availableLayers[3]);

    // AXIS
    // this.createAxis();

    // MENU
    this.selectedLayer = this.availableLayers[1];
    this.menuManager = new MyMenuManager(this.app, this.availableLayers[1], this.pickableObjects, this.clickableObjects);
    this.menuManager.initMainMenu();
  }

  startGame() {
    this.playing = true;
    // START THE GAME
    this.reader.level = this.selectedLevel;
    this.previousTime = 0;
    this.speedFactor = 0.8;
    this.keys = {};
    this.rKeyPressed = false;
    this.keyListeners();

    // route
    this.reader.readRoutes();
    this.mixer = this.reader.mixer;
    this.reader.setFinishLine();

    // create obstacles
    this.reader.readObstacles(this.availableLayers[2]);

    // create power ups
    this.reader.readPowerUps(this.availableLayers[2]);

    // autonomous vehicle
    this.autonomousVehicle = this.reader.autonomousVehicle;

    // player vehicle
    this.playerVehicle = this.reader.playerVehicle;

    // load car models
    this.loadPlayerVehicle();
    this.loadAutonomousVehicle();

    this.scenario.setCloudUnderCar(this.playerVehicle.position);
  }


  loadPlayerVehicle() {
    const myCarModelGreen = new MyCarModelPurple();
    myCarModelGreen.loadModel().then((properties) => {
      this.updatePlayerVehicleModel(properties);
    });
  }

  loadAutonomousVehicle() {
    const myCarModelRed = new MyCarModelRed();
    myCarModelRed.loadModel().then((properties) => {
      this.updateAutonomousVehicleModel(properties);
    });
  }

  updatePlayerVehicleModel(properties) {
    this.reader.readPlayerVehicle(properties[2], properties[3], properties[4], properties[5])
    this.playerVehicle = this.reader.playerVehicle;
    this.playerVehicle.setModel(properties[0], properties[1]);
    this.app.scene.add(this.playerVehicle);
  }

  updateAutonomousVehicleModel(properties) {
    this.reader.readAutonomousVehicle(properties[2], properties[3], properties[4], properties[5])
    this.autonomousVehicle = this.reader.autonomousVehicle;
    this.autonomousVehicle.setModel(properties[0], properties[1]);
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
  }


  checkKeys() {
    let speed = this.speedFactor;
    let turnSpeed = speed / 30;

    let isSwitch = this.reader.isAppliedModifier("switch");

    if (this.keys['KeyW'] && !this.playerVehicle.outOfTrack)
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
    this.raycaster.layers.enableAll()
    if (this.selectedLayer !== 'none') {
      const selectedIndex = this.availableLayers[parseInt(this.selectedLayer)]
      this.raycaster.layers.set(selectedIndex)
    }
    const delta = this.clock.getDelta()
    const time = Date.now();

    // update the clouds lookAt
    this.scenario.update(this.playerVehicle, delta);

    if (this.playing) {
      // update the autonomous car position and rotation
      this.mixer.update(delta)

      // this updates the position of the actual object of MyVehicle class
      this.reader.chosenRoute.updateBoundingBox(this.reader.autonomousVehicle);

      if (this.previousTime == 0)
        this.previousTime = time;
      else {
        let speed = this.checkKeys();
        this.playerVehicle.update(time, speed);
        this.previousTime = time;
        this.reader.checkForCollisions();

        if (this.reader.shortcut) {
          this.reader.shortcutMixer.update(delta);
          this.reader.cloud.cloud.position.copy(this.playerVehicle.position.clone().add(new THREE.Vector3(0, -2, 0)));

          const elapsedTime = this.reader.shortcutAction.time; // Get elapsed time of the animation
          const duration = this.reader.shortcutAction._clip.duration; // Get actual duration
          const tolerance = 0.08;

          if (elapsedTime + tolerance >= duration) {
            this.reader.stopShortcutAnimation();
          }
        }

        // check if any modifier is applied for more than 15 seconds
        for (let i = 0; i < this.reader.appliedModifiers.length; i++) {
          if (this.reader.appliedModifiers[i] instanceof MyVehicle) {
            if (time - this.reader.appliedModifiersStartTime[i] > 3000)
              this.reader.stopModifier(this.reader.appliedModifiers[i]);
          }
          else
            if (time - this.reader.appliedModifiersStartTime[i] > 6000) {
              this.reader.stopModifier(this.reader.appliedModifiers[i]);
            }
        }

      }
      if (this.followPlayerVehicle) {
        this.app.activeCamera.position.set(this.playerVehicle.position.x + 15 * Math.cos(-this.playerVehicle.carOrientation), this.playerVehicle.position.y + 10, this.playerVehicle.position.z + 10 * Math.sin(-this.playerVehicle.carOrientation));
        this.app.controls.target = this.playerVehicle.position;
        this.scenario.clouds.update()
      }
      if (this.followPlayerVehicle) {
        console.log(this.playerVehicle.carOrientation)
        this.app.activeCamera.position.set(this.playerVehicle.position.x + 15 * Math.cos(-this.playerVehicle.carOrientation), this.playerVehicle.position.y + 10, this.playerVehicle.position.z + 10 * Math.sin(-this.playerVehicle.carOrientation));
        this.app.controls.target = new THREE.Vector3(this.playerVehicle.position.x - 15 * Math.cos(-this.playerVehicle.carOrientation), this.playerVehicle.position.y, this.playerVehicle.position.z - 10 * Math.sin(-this.playerVehicle.carOrientation));
        this.scenario.clouds.update()
      }

      if (this.followAutonomousVehicle) {
        this.app.activeCamera.position.set(this.autonomousVehicle.position.x + 10 * Math.cos(-this.autonomousVehicle.carOrientation), this.autonomousVehicle.position.y + 8, this.autonomousVehicle.position.z + 10 * Math.sin(-this.autonomousVehicle.carOrientation));
        this.app.controls.target = this.autonomousVehicle.position;
      }
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
        // put the car in the starting point
        this.loadAutonomousParkingLot();
        this.menuManager.initChooseOpponentVehicleMenu();
      }
      else if (intersects[0].object.name == "selectOpponentVehicleButton") {
        this.selectedOpponentVehicle = this.availableOpponentVehicles[this.app.activeCameraName];
        console.log("selected opponent vehicle: ", this.selectedOpponentVehicle);
        // put the car in the starting point
        //this.app.smoothCameraTransition('PlayerCarPerspective', 1000);
        //this.startGame();
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
    this.availableOpponentVehicles['OpponentParkingLot4'] = myCarModelGreen;

    const myCarModelOrange = new MyCarModelOrange();
    myCarModelOrange.loadModel().then((properties) => {
      this.scenario.setAutonomousVehicleParkingLot(properties[0], properties[2], -4);
    });
    this.availableOpponentVehicles['OpponentParkingLot3'] = myCarModelOrange;

    const myCarModelPurple = new MyCarModelPurple();
    myCarModelPurple.loadModel().then((properties) => {
      this.scenario.setAutonomousVehicleParkingLot(properties[0], properties[2], -5.8);
    });
    this.availableOpponentVehicles['OpponentParkingLot2'] = myCarModelPurple;

    const myCarModelRed = new MyCarModelRed();
    myCarModelRed.loadModel().then((properties) => {
      this.scenario.setAutonomousVehicleParkingLot(properties[0], properties[2], -5.8);
    });
    this.availableOpponentVehicles['OpponentParkingLot1'] = myCarModelRed;
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

import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyReader } from "./MyReader.js";
import { MyScenario } from "./scenario/MyScenario.js";
import { MyVehicle } from "./elements/MyVehicle.js";
import { MyCarModelRed } from "./carModels/MyCarModelRed.js";
import { MyCarModelOrange } from "./carModels/MyCarModelOrange.js";
import { MyCarModelPurple } from "./carModels/MyCarModelPurple.js";
import { MyCarModelGreen } from "./carModels/MyCarModelGreen.js";
import { MyMenu } from "./MyMenu.js";

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
    this.axis = null;

    this.clock = new THREE.Clock()
    this.followPlayerVehicle = false;
    this.followAutonomousVehicle = false;

    this.startingPoint = new THREE.Vector3(32, 1.7, -117);

    this.showTrackWireframe = false;
    this.showTrackLine = true;
    this.trackClosedCurve = false;

    //Curve related attributes
    this.segments = 200;

    // picking related attributes
    this.raycaster = new THREE.Raycaster();
    this.raycaster.near = 0.1;
    this.raycaster.far = 100;

    this.pointer = new THREE.Vector2();
    this.intersectedObj = null
    this.pickingColor = "0x00ff00"

    this.availableLayers = ['none', 1, 2, 3, 4]
    // 1 -> menu
    // 2 -> powerups and obstacles
    // 3 -> track
    // 4 -> scenario
    this.selectedLayer = this.availableLayers[0]
    this.notPickableObjIds = []

    document.addEventListener(
        "pointermove",
        // "mousemove",
        // "pointerdown",
        this.onPointerMove.bind(this)
    );
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

    // LIGHTS
    // add a point light on top of the model
    const pointLight = new THREE.PointLight(0xffffff, 3000, 0);
    pointLight.position.set(0, 40, -10);
    //this.app.scene.add(pointLight);

    // add an ambient light
    const ambientLight = new THREE.AmbientLight(0x555555);
    this.app.scene.add(ambientLight);

    // add a hemisphere light
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 ); 
    this.app.scene.add(hemiLight);

    // SCENARIO
    this.scenario = new MyScenario(this.app, this.availableLayers[4]);

    // TRACK
    this.reader.readTrack(this.availableLayers[3]);

    // AXIS
    // this.createAxis();

    // MENU
    this.selectedLayer = this.availableLayers[1];
    // main menu
    this.menu = new MyMenu(this.app, this.availableLayers[1]);
    this.app.setActiveCamera('MainMenuPerspective');
    this.menu.initMainMenu();
    this.app.scene.add(this.menu.mainMenu);

    // start menu
    // by clicking anywhere on the screen remove mainMenu and add startMenu
    this.app.renderer.domElement.addEventListener('click', () => {
      this.app.scene.remove(this.menu.mainMenu);
      this.app.setActiveCamera('StartMenuPerspective');
      this.menu.initStartMenu();
      this.app.scene.add(this.menu.startMenu);
    }); 


    // START THE GAME
    this.level = 1;
    this.reader.level = this.level;
    this.previousTime = 0;
    this.speedFactor = 0.8;
    this.keys = {};
    this.rKeyPressed = false;
    this.keyListeners();
    
    // route
    this.reader.readRoutes();
    this.mixer = this.reader.mixer;

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
    let turnSpeed = speed/30;
    
    let isSwitch = this.reader.isAppliedModifier("switch");

    if (this.keys['KeyW'] && !this.playerVehicle.outOfTrack) 
      this.playerVehicle.accelerate(speed);

    if (this.keys['KeyX']) 
      this.playerVehicle.decelerate(speed);

    if (this.keys['KeyA'])
      this.playerVehicle.shouldStop = true;

    if (this.keys['KeyS']){
      if(!isSwitch) this.playerVehicle.turn(turnSpeed); //the higher the number that divides speed factor -> the smaller is the turning angle
      else this.playerVehicle.turn(-turnSpeed);
    }
    if (this.keys['KeyD']){
      if(!isSwitch) this.playerVehicle.turn(-turnSpeed);
      else this.playerVehicle.turn(turnSpeed);
    }

    if (this.keys['KeyR'] && !this.rKeyPressed){
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
    const delta = this.clock.getDelta()
    const time = Date.now();

    // update the clouds lookAt
    this.scenario.update(this.playerVehicle, delta);
    
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

      if(this.reader.shortcut){
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
        if(this.reader.appliedModifiers[i] instanceof MyVehicle){
          if(time - this.reader.appliedModifiersStartTime[i] > 3000)
            this.reader.stopModifier(this.reader.appliedModifiers[i]);
        } 
        else
          if(time - this.reader.appliedModifiersStartTime[i] > 6000) {
            this.reader.stopModifier(this.reader.appliedModifiers[i]);
          }
      }
      
    }

    if(this.followPlayerVehicle) {
      //console.log(this.playerVehicle.carOrientation)
      this.app.activeCamera.position.set(this.playerVehicle.position.x + 15 * Math.cos(-this.playerVehicle.carOrientation), this.playerVehicle.position.y + 10, this.playerVehicle.position.z + 10 * Math.sin(-this.playerVehicle.carOrientation));
      this.app.controls.target = this.playerVehicle.position;
      this.scenario.clouds.update()
    }

    if(this.followAutonomousVehicle) {
      console.log(this.autonomousVehicle.carOrientation)
      this.app.activeCamera.position.set(this.autonomousVehicle.position.x + 10 * Math.cos(-this.autonomousVehicle.carOrientation), this.autonomousVehicle.position.y + 8, this.autonomousVehicle.position.z + 10 * Math.sin(-this.autonomousVehicle.carOrientation));
      this.app.controls.target = this.autonomousVehicle.position;
    }
  }

  onPointerMove(event) {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    //of the screen is the origin
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);

    //2. set the picking ray from the camera position and mouse coordinates
    this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);

    //3. compute intersections
    var intersects = this.raycaster.intersectObjects(this.app.scene.children);

    this.pickingHelper(intersects)

    this.transverseRaycastProperties(intersects)
  }

  /*
  * Change the color of the first intersected object
  *
  */
  changeColorOfFirstPickedObj(obj) {
    if (this.lastPickedObj != obj) {
        if (this.lastPickedObj)
            this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
        this.lastPickedObj = obj;
        console.log(this.lastPickedObj)
        this.lastPickedObj.currentHex = this.lastPickedObj.material.color.getHex();
        this.lastPickedObj.material.color.setHex(this.pickingColor);
    }
  }

  /*
  * Restore the original color of the intersected object
  *
  */
  restoreColorOfFirstPickedObj() {
      if (this.lastPickedObj)
          this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
      this.lastPickedObj = null;
  }

  /*
  * Helper to visualize the intersected object
  *
  */
  pickingHelper(intersects) {
      if (intersects.length > 0) {
          const obj = intersects[0].object
          if (this.notPickableObjIds.includes(obj.name)) {
              this.restoreColorOfFirstPickedObj()
              console.log("Object cannot be picked !")
          }
          else
              this.changeColorOfFirstPickedObj(obj)
      } else {
          this.restoreColorOfFirstPickedObj()
      }
  }


  /**
   * Print to console information about the intersected objects
   */
  transverseRaycastProperties(intersects) {
      for (var i = 0; i < intersects.length; i++) {

          console.log(intersects[i]);

          /*
          An intersection has the following properties :
              - object : intersected object (THREE.Mesh)
              - distance : distance from camera to intersection (number)
              - face : intersected face (THREE.Face3)
              - faceIndex : intersected face index (number)
              - point : intersection point (THREE.Vector3)
              - uv : intersection point in the object's UV coordinates (THREE.Vector2)
          */
      }
  }

}

export { MyContents };

import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyReader } from "./MyReader.js";
import { MyScenario } from "./scenario/MyScenario.js";
import { MyVehicle } from "./elements/MyVehicle.js";

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

    this.startingPoint = new THREE.Vector3(32, 1, -117);
    this.level = 1;

    this.showTrackWireframe = false;
    this.showTrackLine = true;
    this.trackClosedCurve = false;

    //Curve related attributes
    this.segments = 200;

    this.raycaster = new THREE.Raycaster()
    this.raycaster.near = 1
    this.raycaster.far = 20

    this.pointer = new THREE.Vector2()
    this.intersectedObj = null
    this.pickingColor = "#00ff00"

    // structure of layers: each layer will contain its objects
    // this can be used to select objects that are pickeable     
    this.availableLayers = ['none', 1, 2, 3, 4]
    this.selectedLayer = this.availableLayers[0]    // change this in interface

    // define the objects ids that are not to be pickeable
    // NOTICE: not a ThreeJS facility
    this.notPickableObjIds = []
    // this.notPickableObjIds = ["col_0_0", "col_2_0", "col_1_1"]
    // this.notPickableObjIds = ["myplane", "col_0_0", "col_2_0", "col_1_1"]
  
    //register events
    /*
    document.addEventListener(
        "pointermove",
        // "mousemove",
        // "pointerdown",
        this.onPointerMove.bind(this)
    );*/

    this.reader = new MyReader(this, this.app, this.level, this.startingPoint, this.segments)
    // create the autonomous vehicle
    this.autonomousVehicle = this.reader.autonomousVehicle; 
    
    //player vehicle
    this.playerVehicle = this.reader.playerVehicle;
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

  /**
   * initializes the contents
   */
  init() {
    this.menu();
    this.previousTime = 0;
    this.speedFactor = 0.8;
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

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 ); 
    this.app.scene.add(hemiLight);

    // SCENARIO
    this.scenario = new MyScenario(this.app);
    this.scenario.setCloudUnderCar(this.playerVehicle.position);

    // track
    this.reader.readTrack();

    // routes
    this.reader.readRoutes();
    this.mixer = this.reader.mixer;

    // create obstacles
    this.reader.readObstacles();

    // create power ups
    this.reader.readPowerUps();
  }

  menu() {
    this.app.setActiveCamera("MenuPerspective");
    this.app.updateCameraIfRequired();

    const logoGeometry = new THREE.PlaneGeometry(10, 10);
    const logoTexture = new THREE.TextureLoader().load("textures/logo.png");
    const logoMaterial = new THREE.MeshBasicMaterial({ map: logoTexture });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);

    /*
    const middlePoint = new THREE.Vector3();
    if (!this.app.controls) {
      this.app.controls.target = new THREE.Vector3(0, 0, 0);
    }
    middlePoint.addVectors(this.app.activeCamera.position, this.app.controls.target);
    middlePoint.divideScalar(2);
    logo.position.copy(middlePoint);*/

    logo.position.set(-160, -112, 15);
    this.app.scene.add(logo)


  }

  checkKeys() {
    let speed = this.speedFactor;
    let turnSpeed = speed/25;
    
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


  /*
    *
    * Only object from selected layer will be eligible for selection
    * when 'none' is selected no layer is active, so all objects can be selected
    */
  updateSelectedLayer() {
    this.raycaster.layers.enableAll()
    if (this.selectedLayer !== 'none') {
        const selectedIndex = this.availableLayers[parseInt(this.selectedLayer)];
        this.raycaster.layers.set(selectedIndex);
    }
  }

  /*
    * Update the color of selected object
    */
  updatePickingColor(value) {
    this.pickingColor = value;
  }

  /**
   * Creates the axis
   */
  createAxis() {
    // create once 
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
      this.app.activeCamera.position.set(this.playerVehicle.position.x + 10 * Math.cos(-this.playerVehicle.carOrientation), this.playerVehicle.position.y + 8, this.playerVehicle.position.z + 10 * Math.sin(-this.playerVehicle.carOrientation));
      this.app.controls.target = this.playerVehicle.position;
      this.scenario.clouds.update()
    }

    if(this.followAutonomousVehicle) {
      console.log(this.autonomousVehicle.carOrientation)
      this.app.activeCamera.position.set(this.autonomousVehicle.position.x + 10 * Math.cos(-this.autonomousVehicle.carOrientation), this.autonomousVehicle.position.y + 8, this.autonomousVehicle.position.z + 10 * Math.sin(-this.autonomousVehicle.carOrientation));
      this.app.controls.target = this.autonomousVehicle.position;
    }
  }
}

export { MyContents };

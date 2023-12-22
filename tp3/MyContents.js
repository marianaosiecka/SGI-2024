import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyReader } from "./MyReader.js";
import { MyScenario } from "./MyScenario.js";

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
  }

  /**
   * initializes the contents
   */
  init() {
    this.previousTime = 0;
    this.speedFactor = 0.5;
    this.keys = {};
    this.keyListeners();

    // create once
    if (this.axis === null) {
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }

    // LIGHTS
    // add a point light on top of the model
    const pointLight = new THREE.PointLight(0xffffff, 3000, 0);
    pointLight.position.set(0, 40, -10);
    this.app.scene.add(pointLight);

    // add a point light helper for the previous point light
    const sphereSize = 0.5;
    const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    this.app.scene.add(pointLightHelper);

    // add an ambient light
    const ambientLight = new THREE.AmbientLight(0x555555);
    this.app.scene.add(ambientLight);

    // SCENARIO
    this.scenario = new MyScenario(this.app);

    // track
    this.reader.readTrack();

    // routes
    this.reader.readRoutes(true);
    this.mixer = this.reader.mixer;

    // create obstacles
    this.reader.readObstacles();

    // create power ups
    this.reader.readPowerUps();
  }

  checkKeys() {
    if (this.keys['KeyW']) 
      this.playerVehicle.accelerate(this.speedFactor);

    if (this.keys['KeyA'])
      this.playerVehicle.shouldStop = true;

    if (this.keys['KeyS'])
      this.playerVehicle.turn(this.speedFactor/15); //the higher the number that divides speed factor -> the smaller is the turning angle

    if (this.keys['KeyD'])
      this.playerVehicle.turn(-this.speedFactor/15);

    if (this.keys['KeyR'])
      this.playerVehicle.reverse(this.speedFactor);

    if (this.keys['KeyP'])
      this.playerVehicle.reset();
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
    this.scenario.clouds.display();
    
    const time = Date.now();
    
    const delta = this.clock.getDelta()
    this.mixer.update(delta)

    if (this.previousTime == 0)
      this.previousTime = time;
    else {
      this.checkKeys();
      this.playerVehicle.update(time, this.speedFactor);
      this.previousTime = time;
    }
  }
}

export { MyContents };

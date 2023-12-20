import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyTrack } from "./MyTrack.js";
import { MyRoute } from "./MyRoute.js";
import { MyVehicle } from "./MyVehicle.js";

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

    this.startingPoint = new THREE.Vector3(32, 1, -117);

    this.showTrackWireframe = false;
    this.showTrackLine = true;
    this.trackClosedCurve = false;

    //Curve related attributes
    this.segments = 200;

    this.path = new THREE.CatmullRomCurve3([
      /*
      new THREE.Vector3(-5, 0, 3),
      new THREE.Vector3(0, 0, 2),
      new THREE.Vector3(5, 0, 6), 
      new THREE.Vector3(10, 0, 7), 
      new THREE.Vector3(15, 0, 3),
      new THREE.Vector3(20, 0, 0),
      new THREE.Vector3(18, 0, -8),
      new THREE.Vector3(15, 0, -10),
      new THREE.Vector3(10, 0, -14),
      new THREE.Vector3(5, 0, -12),
      new THREE.Vector3(0, 0, -16),
      new THREE.Vector3(5, 0, -20),
      new THREE.Vector3(-2, 0, -24),
      new THREE.Vector3(-7, 0, -10),
      new THREE.Vector3(-10, 0, -7),
      new THREE.Vector3(-15, 0, -3),
      new THREE.Vector3(-20, 0, 0),
      new THREE.Vector3(-20, 0, 4),
      new THREE.Vector3(-15, 0, 7),
      new THREE.Vector3(-10, 0, 4),
      new THREE.Vector3(-5, 0, 3)
      new THREE.Vector3(-10, 0, 5),
      new THREE.Vector3(-5, 0, 3),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(5, 0, 3),
      new THREE.Vector3(10, 0, 8),
      new THREE.Vector3(15, 0, 6),
      new THREE.Vector3(20, 0, 3),
      new THREE.Vector3(25, 0, -2),
      new THREE.Vector3(20, 0, -8),
      new THREE.Vector3(15, 0, -10),
      new THREE.Vector3(10, 0, -14),
      new THREE.Vector3(5, 0, -12),
      new THREE.Vector3(0, 0, -16),
      new THREE.Vector3(5, 0, -20),
      new THREE.Vector3(-5, 0, -24),
      new THREE.Vector3(-7, 0, -10),
      new THREE.Vector3(-10, 0, -7),
      new THREE.Vector3(-15, 0, -3),
      new THREE.Vector3(-20, 0, 0),
      new THREE.Vector3(-20, 0, 4),
      new THREE.Vector3(-15, 0, 7),
      new THREE.Vector3(-10, 0, 5)*/
      new THREE.Vector3(16, 0, 0),
      new THREE.Vector3(10, 0, -15),
      new THREE.Vector3(5, 0, -20),
      new THREE.Vector3(0, 0, -20.5),
      new THREE.Vector3(-5, 0, -20.5),
      new THREE.Vector3(-10, 0, -20),
      new THREE.Vector3(-15, 0, -15),
      new THREE.Vector3(-20, 0, 4),
      new THREE.Vector3(-30, 0, 8),
      new THREE.Vector3(-38, 0, 4),
      new THREE.Vector3(-45, 0, -15),
      new THREE.Vector3(-50, 0, -20),
      new THREE.Vector3(-55, 0, -20.5),
      new THREE.Vector3(-60, 0, -20.5),
      new THREE.Vector3(-65, 0, -20),
      new THREE.Vector3(-70, 0, -15),
      new THREE.Vector3(-75, 0, -5),
      new THREE.Vector3(-80, 0, 1),
      new THREE.Vector3(-85, 0, 4),
      new THREE.Vector3(-90, 0, 4),
      new THREE.Vector3(-95, 0, 2),
      new THREE.Vector3(-100, 0, -4),
      new THREE.Vector3(-105, 0, -30),
      new THREE.Vector3(-100, 0, -45),
      new THREE.Vector3(-90, 0, -52),
      new THREE.Vector3(-80, 0, -55),
      new THREE.Vector3(30, 0, -55),
      new THREE.Vector3(40, 0, -52),
      new THREE.Vector3(50, 0, -45),
      new THREE.Vector3(50, 0, 10),
      new THREE.Vector3(55, 0, 25),
      new THREE.Vector3(60, 0, 30),
      new THREE.Vector3(65, 0, 35),
      new THREE.Vector3(65.5, 0, 40),
      new THREE.Vector3(65, 0, 45),
      new THREE.Vector3(60, 0, 50),
      new THREE.Vector3(55, 0, 52),
      new THREE.Vector3(50, 0, 53),
      new THREE.Vector3(45, 0, 52),
      new THREE.Vector3(38, 0, 48),
      new THREE.Vector3(35, 0, 45),
      new THREE.Vector3(32, 0, 42),
      new THREE.Vector3(30, 0, 40),
      new THREE.Vector3(20, 0, 12),
      new THREE.Vector3(16, 0, 0)
    ]);


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

    this.car = new MyVehicle(1, 0.5, 1.6);
    this.app.scene.add(this.car);
  }



  /**
   * initializes the contents
   */
  init() {
    // create once
    if (this.axis === null) {
      // create and attach the axis to the scene
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }

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

    // create the track
    this.buildTrack(this.availableLayers[0]);

    this.buildRoutes();

  }


  buildTrack(layer) {
    this.track = new MyTrack(this.app, this.segments, 4, this.path, this.trackClosedCurve);
    //this.track.scale.set(3, 0.2, 3);
    this.track.layers.enable(layer);
    this.app.scene.add(this.track);
  }

  buildRoutes() {
    const keyPoints1 = [
      this.startingPoint,
      new THREE.Vector3(10, 1, -117),
      new THREE.Vector3(-34, 1, -115),
      new THREE.Vector3(-70, 1, -112),
      new THREE.Vector3(-85, 1, -105),
      new THREE.Vector3(-90, 1, -98),
      new THREE.Vector3(-95, 1, -90),
      new THREE.Vector3(-100, 1, -80),
      new THREE.Vector3(-105, 1, -60),
      new THREE.Vector3(-102, 1, -35),
      new THREE.Vector3(-100, 1, 5),
      new THREE.Vector3(-102, 1, 35),
      new THREE.Vector3(-110, 1, 50),
      new THREE.Vector3(-118, 1, 60),
      new THREE.Vector3(-127, 1, 70),
      new THREE.Vector3(-129, 1, 78),
      new THREE.Vector3(-129, 1, 85),
      new THREE.Vector3(-126, 1, 89),
      new THREE.Vector3(-120, 1, 95),
      new THREE.Vector3(-112, 1, 100),
      new THREE.Vector3(-105, 1, 102),
      new THREE.Vector3(-98, 1, 102),
      new THREE.Vector3(-90, 1, 100),
      new THREE.Vector3(-80, 1, 95),
      new THREE.Vector3(-70, 1, 87),
      new THREE.Vector3(-60, 1, 75),
      new THREE.Vector3(-50, 1, 45),
      new THREE.Vector3(-32, 1, -10),
      new THREE.Vector3(-10, 1, -37),
      new THREE.Vector3(10, 1, -38),
      new THREE.Vector3(20, 1, -35),
      new THREE.Vector3(30, 1, -25),
      new THREE.Vector3(35, 1, -15),
      new THREE.Vector3(40, 1, 0),
      new THREE.Vector3(45, 1, 8),
      new THREE.Vector3(53, 1, 12),
      new THREE.Vector3(60, 1, 12),
      new THREE.Vector3(65, 1, 10),
      new THREE.Vector3(72, 1, 8),
      new THREE.Vector3(80, 1, 0),
      new THREE.Vector3(85, 1, -20),
      new THREE.Vector3(95, 1, -35),
      new THREE.Vector3(105, 1, -38),
      new THREE.Vector3(115, 1, -38),
      new THREE.Vector3(125, 1, -37),
      new THREE.Vector3(140, 1, -25),
      new THREE.Vector3(150, 1, -10),
      new THREE.Vector3(165, 1, 2),
      new THREE.Vector3(175, 1, 8),


    ];

    const timeInterval1 = 2;

    const route1 = new MyRoute(this.app, keyPoints1, timeInterval1, true);
    this.app.scene.add(route1);
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
  update() {}
}

export { MyContents };

import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyTrack } from "./MyTrack.js";

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
      new THREE.Vector3(16, 0, 0),
    ]);
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
    this.buildTrack();

  }


  buildTrack() {
    this.track = new MyTrack(this.app, this.segments, 4, this.path, this.trackClosedCurve);
    //this.track.scale.set(3, 0.2, 3);
    this.app.scene.add(this.track);
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

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
        this.enableAxis = false;
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        const folderCamera = this.datgui.addFolder("Camera");
        folderCamera
            .add(this.app, "activeCameraName", ["Perspective", "PlayerCarPerspective", "AutonomousCarPerspective", "MainMenuPerspective", "StartMenuPerspective"])
            .name("Active camera")
            .onChange((value)=>this.app.setActiveCamera(value));
        
        const folderGeometry = this.datgui.addFolder("Curve");
        folderGeometry
            .add(this.contents, "trackSegments", 10, 200)
            .step(50)
            .onChange((value)=>this.contents.updateTrack(value));
        folderGeometry
            .add(this.contents, "showTrackWireframe")
            .name("Show track wireframe")
            .onChange(()=>this.contents.updateTrackWireframeVisibility());

        // AXIS
        this.datgui.add(this, 'enableAxis')
            .name('Axis')
            .onChange(() => {
                if (this.enableAxis) {
                    this.contents.createAxis()
                }
                else {
                    this.app.scene.remove(this.contents.axis);
                    this.contents.axis = null;
                }
            });

        this.datgui.close();
    }
}

export { MyGuiInterface };
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
        // CAMERAS
        const cameraFolder = this.datgui.addFolder('Cameras')
        const cameraNames = Array.from(this.contents.cameras.keys());
        cameraFolder.add(this.app, 'activeCameraName', cameraNames ).name("active camera");
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open()

        // LIGHTS
        const lightsFolder = this.datgui.addFolder('Lights');
        console.log(this.contents.lights)
        for (let [lightName, light] of this.contents.lights.entries()) {
            const defaultValue = light.enabled;
            lightsFolder.add(light, 'enabled').name(lightName).setValue(defaultValue);
        };


    }
}

export { MyGuiInterface };
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
        this.datgui =  new GUI()
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

        const tableLightTargetPosition = {
            'targetX' : this.contents.tableLight.target.position.x,
            'targetY' : this.contents.tableLight.target.position.y
        }

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Cameras')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Perspective2', 'Left', 'Right', 'Top', 'Front', 'Back', 'CoffeeTable', 'Cake', 'Vinyl', 'Flowers', 'Photos', 'Paintings', 'Window', 'Door' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open()

        // folder in the gui interface for the cake spotlight
        const spotLightFolder = this.datgui.addFolder('Cake SpotLight')
        spotLightFolder.addColor(this.contents.tableLight, 'color').onChange( (value) => { this.contents.tableLight.color = value } );
        spotLightFolder.add(this.contents.tableLight, 'intensity', 0, 20).onChange( (value) => { this.contents.tableLight.intensity = value } );
        spotLightFolder.add(this.contents.tableLight, 'distance', 0, 15).onChange( (value) => { this.contents.tableLight.distance = value } );
        spotLightFolder.add(this.contents.tableLight, 'angle',  0, 180).onChange( (value) => { this.contents.tableLight.angle = value*(Math.PI/180) } );
        spotLightFolder.add(this.contents.tableLight, 'penumbra', 0, 2).onChange( (value) => { this.contents.tableLight.penumbra = value } );
        spotLightFolder.add(this.contents.tableLight, 'decay', 0, 2).onChange( (value) => { this.contents.tableLight.decay = value } );
        spotLightFolder.add(this.contents.tableLight.position, 'x', -20, 20).onChange( (value) => { this.contents.tableLight.position.x = value } );
        spotLightFolder.add(this.contents.tableLight.position, 'y', -20, 20).onChange( (value) => { this.contents.tableLight.position.y = value } );
        spotLightFolder.add(tableLightTargetPosition, 'targetX', -20, 20).onChange( (value) => { this.contents.updateSpotLightTargetX(this.contents.tableLight, value) } );
        spotLightFolder.add(tableLightTargetPosition, 'targetY', -20, 20).onChange( (value) => { this.contents.updateSpotLightTargetY(this.contents.tableLight, value) } );
        spotLightFolder.close();

        // camera follows bird option
        this.datgui.add(this.contents, 'showAxis', true).name('show axis').onChange( () => { this.contents.updateAxis() });
     }

}

export { MyGuiInterface };
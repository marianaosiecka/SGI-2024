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
        // add a folder to the gui interface for the box
        const boxFolder = this.datgui.addFolder( 'Box' );
        // note that we are using a property from the contents object 
        boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        boxFolder.add(this.contents, 'boxEnabled', true).name("enabled");
        boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5)
        boxFolder.open()
        
        const data = {  
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
            'color': this.contents.tableLight.color
        };

        const tableLightTargetPosition = {
            'targetX' : this.contents.tableLight.target.position.x,
            'targetY' : this.contents.tableLight.target.position.y
        }

        // adds a folder to the gui interface for the plane
        const planeFolder = this.datgui.addFolder( 'Plane' );
        planeFolder.addColor( data, 'diffuse color' ).onChange( (value) => { this.contents.updateDiffusePlaneColor(value) } );
        planeFolder.addColor( data, 'specular color' ).onChange( (value) => { this.contents.updateSpecularPlaneColor(value) } );
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange( (value) => { this.contents.updatePlaneShininess(value) } );
        planeFolder.open();

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Perspective2', 'Left', 'Right', 'Top', 'Front', 'Back', 'CoffeeTable', 'Cake', 'Vinyl', 'Flowers', 'Paintings' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open()

        // folder in the gui interface for the light
        const spotLightFolder = this.datgui.addFolder('SpotLight')
        spotLightFolder.addColor(data, 'color').onChange( (value) => { this.contents.tableLight.color = value } );
        spotLightFolder.add(this.contents.tableLight, 'intensity', 0, 20).onChange( (value) => { this.contents.tableLight.intensity = value } );
        spotLightFolder.add(this.contents.tableLight, 'distance', 0, 15).onChange( (value) => { this.contents.tableLight.distance = value } );
        spotLightFolder.add(this.contents.tableLight, 'angle',  0, 180).onChange( (value) => { this.contents.tableLight.angle = value*(Math.PI/180) } );
        spotLightFolder.add(this.contents.tableLight, 'penumbra', 0, 2).onChange( (value) => { this.contents.tableLight.penumbra = value } );
        spotLightFolder.add(this.contents.tableLight, 'decay', 0, 2).onChange( (value) => { this.contents.tableLight.decay = value } );
        spotLightFolder.add(this.contents.tableLight.position, 'x', -20, 20).onChange( (value) => { this.contents.tableLight.position.x = value } );
        spotLightFolder.add(this.contents.tableLight.position, 'y', -20, 20).onChange( (value) => { this.contents.tableLight.position.y = value } );
        spotLightFolder.add(tableLightTargetPosition, 'targetX', -20, 20).onChange( (value) => { this.contents.updateSpotLightTargetX(this.contents.tableLight, value) } );
        spotLightFolder.add(tableLightTargetPosition, 'targetY', -20, 20).onChange( (value) => { this.contents.updateSpotLightTargetY(this.contents.tableLight, value) } );
        spotLightFolder.open()
    }
}

export { MyGuiInterface };
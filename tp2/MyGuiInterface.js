import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import * as THREE from 'three';
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
        this.enableWireframe = false;
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
        cameraFolder.close()

        // LIGHTS
        this.createLightsFolder();

        // WIREFRAME
        this.datgui.add(this, 'enableWireframe')
            .name('Wireframe')
            .onChange(() => {
                this.contents.materials.forEach(material => {
                    if (this.enableWireframe) {
                        material.material.wireframe = true;
                    } else {
                        material.material.wireframe = material.wireframe;
                    }
                });
            });
        
        // WINDOWS

        console.log(this.contents.group)
        this.contents.group.children.forEach((group, index) => {
            const windowMesh =  group.children.find(group => group.name === "windowDown");
            console.log(windowMesh)
        });

        //DOOR 
        this.datgui.add(this.contents.nodes.get('door').rotation, 'y', 0, 1.8).name("Open door");
    }

    createLightsFolder(){
        const lightsFolder = this.datgui.addFolder('Lights');
        const lightTypesFolder = {};

        for (let [lightName, light] of this.contents.lights.entries()) {
            if (lightName.endsWith('Highlight')) {
                continue;
            }

            // get the type
            const lightType = getLightType(light)

            // if the type folder isn't already created, create one
            if (!lightTypesFolder[lightType]) {
                lightTypesFolder[lightType] = lightsFolder.addFolder(lightType);
                lightTypesFolder[lightType].close();
            }

            // get the display name
            let displayName = lightName.replace('SpotLight', '');
            displayName = displayName.replace(/[A-Z]/g, match => ` ${match.toLowerCase()}`);

            // get the default enable value
            const defaultValue = light.enabled;

            // add the light checkbox to the respective folder
            lightTypesFolder[lightType].add(light, 'enabled').name(displayName).setValue(defaultValue)
                .onChange(() => {
                    if (light.enabled) {
                        light.light.intensity = light.intensity;
                    } else {
                        light.light.intensity = 0;
                    }

                    // if the light has a respective hightlight, enable/disable the highlight as well
                    const highlightName = lightName.replace('SpotLight', '') + "Highlight";
                    const highlightLight = this.contents.lights.get(highlightName);
                    if (highlightLight) {
                        if (light.enabled) {
                            highlightLight.light.intensity = highlightLight.intensity;
                        } else {
                            highlightLight.light.intensity = 0;
                        }
                    }

                });
        };

        function getLightType(light) {
            if (light.light instanceof THREE.SpotLight) {
                return 'spot lights';
            }
            else if (light.light instanceof THREE.PointLight) {
                return 'point lights';
            }
            else if (light.light instanceof THREE.DirectionalLight) {
                return 'directional lights';
            }
        }
        lightsFolder.close()
    }
}

export { MyGuiInterface };
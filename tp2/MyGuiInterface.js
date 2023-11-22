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
        this.enableExterior = true;
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
        

        // WINDOW
        this.datgui.add(this.contents.nodes.get('windowDown').group.position, 'y', 0, 1.3).name("Open window");
        
        //DOOR 
        this.datgui.add(this.contents.nodes.get('door').group.rotation, 'y', 0, 1.8).name("Open door");

        // VINYL
        this.createVinylPlayButton();

        // SHADOWS
        const shadowSlider = this.datgui.add({ shadowMapSize: 1024 }, 'shadowMapSize', 0, 4096).name('Shadow Map Size');

        shadowSlider.onChange((value) => {
            for (let light of this.contents.lights.values()) {
                if (light.light.castShadow) {
                    light.light.shadow.mapSize.width = value;
                    light.light.shadow.mapSize.height = value;
                }
            }
        });

        // AXIS
        this.datgui.add(this, 'enableAxis')
            .name('Show axis')
            .onChange(() => {
                if(this.enableAxis){
                    this.contents.createAxis()
                }
                else {
                    this.app.scene.remove(this.contents.axis);
                    this.contents.axis = null;
                }
            });

        // EXTERIOR
        this.datgui.add(this, 'enableExterior')
            .name('Show exterior walls')
            .onChange(() => {
                if(this.enableExterior){
                    this.showExteriorWalls()
                }
                else {
                    this.hideExteriorWalls()
                }
            });


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

    createVinylPlayButton(){
        const vinylNode = this.contents.nodes.get('vinyl').group;
        let isPlayingVinyl = false;
        let rotationCounter = 0;
        let zRotateUp = false;

        const videoElement = document.getElementById("music")

        this.datgui.add({ playVinyl: () => playVinyl() }, 'playVinyl').name('Play Vinyl');

        function playVinyl() {
            isPlayingVinyl = !isPlayingVinyl;

            if (isPlayingVinyl) {
                rotateVinyl();
                videoElement.style.display = 'block';
                videoElement.muted = false;
                videoElement.play();
            } else {
                videoElement.pause();
                videoElement.style.display = 'none';
            }
        }

        function rotateVinyl() {
            if (isPlayingVinyl) {
                vinylNode.rotation.y += 0.005;
                if (zRotateUp) {
                    vinylNode.rotation.z += 0.0004; 
                } else vinylNode.rotation.z -= 0.0004; 

                rotationCounter++;
                if(rotationCounter % 150 == 0) zRotateUp = !zRotateUp

                requestAnimationFrame(rotateVinyl);
            }
        }
    }


    showExteriorWalls(){
        this.contents.nodes.get("exteriorWalls").group.visible = true
        this.contents.nodes.get("porch").group.visible = true
        this.contents.nodes.get("roof").group.visible = true
        this.contents.nodes.get("ceiling").group.visible = true
        this.contents.nodes.get("chimney").group.visible = true
        this.contents.nodes.get("kite1").group.visible = true
    }

    hideExteriorWalls(){
        this.contents.nodes.get("exteriorWalls").group.visible = false
        this.contents.nodes.get("porch").group.visible = false
        this.contents.nodes.get("roof").group.visible = false
        this.contents.nodes.get("ceiling").group.visible = false
        this.contents.nodes.get("chimney").group.visible = false
        this.contents.nodes.get("kite1").group.visible = false
    }


}

export { MyGuiInterface };
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';
import { MyPolygon } from './auxiliar/primitives/MyPolygon.js';


/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui = new GUI();
        this.contents = null
        this.enableWireframe = false;
        this.enableExterior = true;
        this.enableCastShadows = true;
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
        /*
        // CAMERAS
        const cameraFolder = this.datgui.addFolder('Cameras')
        const cameraNames = Array.from(this.contents.cameras.keys());
        cameraFolder.add(this.app, 'activeCameraName', cameraNames).name("active camera");
        cameraFolder.close()

        // LIGHTS
        this.createLightsFolder();


        let sceneFolder = this.datgui.addFolder('Scene')

        // AXIS
        sceneFolder.add(this, 'enableAxis')
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

        // WIREFRAME
        sceneFolder.add(this, 'enableWireframe')
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


        // EXTERIOR
        sceneFolder.add(this, 'enableExterior')
            .name('Exterior walls')
            .onChange(() => {
                if (this.enableExterior) {
                    this.showExteriorWalls()
                }
                else {
                    this.hideExteriorWalls()
                }
            });

        // WINDOW
        sceneFolder.add(this.contents.nodes.get('windowDown').group.position, 'y', 0, 1.3).name("Open window");

        //DOOR 
        sceneFolder.add(this.contents.nodes.get('door').group.rotation, 'y', 0, 1.8).name("Open door");

        // VINYL
        this.createVinylPlayButton(sceneFolder);

        // OUTSIDE DOOR LAMP
        this.createMoveOutsideDoorLampButton(sceneFolder);

        // KITE
        this.createKiteFolder(sceneFolder);

        // MIP MAPS
        this.createMipMapsFolder();
        */
    }

    createLightsFolder() {
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

            // create a folder for each light
            const lightFolder = lightTypesFolder[lightType].addFolder(displayName);

            // add the enable checkbox to the respective folder
            lightFolder.add(light, 'enabled').name("Enable light").setValue(defaultValue)
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

            // add the castShadow checkbox to the respective folder
            lightFolder.add(light, 'castShadow')
                .name('Cast shadows')
                .onChange(() => {
                    if (light.castShadow) {
                        light.light.castShadow = true;
                    } else {
                        light.light.castShadow = false;
                    }
    
                });

            lightFolder.close();
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

    createVinylPlayButton(sceneFolder) {
        const vinylNode = this.contents.nodes.get('vinyl').group;
        let isPlayingVinyl = false;
        let rotationCounter = 0;
        let zRotateUp = false;

        const videoElement = document.getElementById("music")

        sceneFolder.add({ playVinyl: () => playVinyl() }, 'playVinyl').name('Play Vinyl');

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
                if (rotationCounter % 150 == 0) zRotateUp = !zRotateUp

                requestAnimationFrame(rotateVinyl);
            }
        }
    }

    createKiteFolder(sceneFolder) {
        // KITE 
        const kiteFolder = sceneFolder.addFolder('Kite');

        // getting the representations of node with id = kite to create polygon instance
        const kiteNode = this.contents.representations.get('kite');
        // getting the buffer geometry of the polygon
        const kiteGeometry = this.contents.nodes.get('kite').group.children[0].geometry;

        // creating polygon class instance
        const kitePolygon = new MyPolygon({
            stacks: kiteNode.stacks,
            slices: kiteNode.slices,
            radius: kiteNode.radius,
            color_c: kiteNode.color_c,
            color_p: kiteNode.color_p
        });

        // creates a new colors array with a changed color_c value and updates the geometry's color attribute and request for update
        kiteFolder.addColor(kiteNode, 'color_c').name("Color C").onChange(function(colorValue) {
            kiteGeometry.attributes.color = new THREE.Float32BufferAttribute(kitePolygon.updateColor(colorValue, true), 3);
            kiteGeometry.attributes.color.needsUpdate = true; 
        });

        // creates a new colors array with a changed color_p value and updates the geometry's color attribute and request for update
        kiteFolder.addColor(kiteNode, 'color_p').name("Color P").onChange(function(colorValue) {
            kiteGeometry.attributes.color = new THREE.Float32BufferAttribute(kitePolygon.updateColor(colorValue, false), 3);
            kiteGeometry.attributes.color.needsUpdate = true; 
        });

        kiteFolder.close();
    }

    showExteriorWalls() {
        this.contents.nodes.get("exteriorWalls").group.visible = true
        this.contents.nodes.get("porch").group.visible = true
        this.contents.nodes.get("roof").group.visible = true
        this.contents.nodes.get("ceiling").group.visible = true
        this.contents.nodes.get("chimney").group.visible = true
        this.contents.nodes.get("kite1").group.visible = true
    }

    hideExteriorWalls() {
        this.contents.nodes.get("exteriorWalls").group.visible = false
        this.contents.nodes.get("porch").group.visible = false
        this.contents.nodes.get("roof").group.visible = false
        this.contents.nodes.get("ceiling").group.visible = false
        this.contents.nodes.get("chimney").group.visible = false
        this.contents.nodes.get("kite1").group.visible = false
    }

    createMoveOutsideDoorLampButton(sceneFolder) {
        let isMovingOutsideLamp = false;
        sceneFolder.add({ moveOutsideLamp: () => moveOutsideLamp() }, 'moveOutsideLamp').name('Move Outside Lamp');
        const lampNode = this.contents.nodes.get('outsideDoorLamp').group;

        function moveOutsideLamp() {
            if (isMovingOutsideLamp) {
                return;
            }
            isMovingOutsideLamp = true;

            const initialRotation = lampNode.rotation.x; // initial rotation
            const initialPosition = lampNode.position.z // initial position
            const oscillationFrequency = 2.5 * Math.PI / 3000; // speed
            let oscillationAmplitude = 0.5; // moving range

            const duration = 17000; // animation duration
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(1, elapsed / duration);

                // oscillate around the x-axis and adjust the position in z
                const oscillation = Math.sin(oscillationFrequency * elapsed);
                lampNode.rotation.x = initialRotation + oscillation * oscillationAmplitude;
                lampNode.position.z = -(initialPosition + oscillation * oscillationAmplitude);

                oscillationAmplitude *= 0.998; // lower the moving range in each rotation

                // continue the animation until duration is reached or amplitude becomes very small
                if (progress < 1 && oscillationAmplitude > 0.01) {
                    requestAnimationFrame(animate);
                }
                else {
                    isMovingOutsideLamp = false;
                    lampNode.rotation.x = initialRotation;
                    lampNode.position.z = initialPosition
                }
            };

            animate();
        }
    }

    createMipMapsFolder(){
        this.options = {
            minFilters: {
                'NearestFilter': THREE.NearestFilter,
                'NearestMipMapLinearFilter': THREE.NearestMipMapLinearFilter,
                'NearestMipMapNearestFilter': THREE.NearestMipMapNearestFilter,
                'LinearFilter ': THREE.LinearFilter,
                'LinearMipMapLinearFilter (Default)': THREE.LinearMipMapLinearFilter,
                'LinearMipmapNearestFilter': THREE.LinearMipmapNearestFilter,
            },
            magFilters: {
                'NearestFilter': THREE.NearestFilter,
                'LinearFilter (Default)': THREE.LinearFilter,
            },
        }

        const mipmapsFolder = this.datgui.addFolder('Mipmaps');

        for (const myTexture of this.contents.textures) {
            const textureName = myTexture[0]
            const texture = myTexture[1];
            if (!(texture instanceof THREE.VideoTexture) && !texture.generateMipmaps) {
                const textureFolder = mipmapsFolder.addFolder(textureName);
        
                const minFilterController = textureFolder.add(texture, 'minFilter', this.options.minFilters)
                    .name('minFilter')
                    .onChange((value) => texture.magFilter = value);
        
                const magFilterController = textureFolder.add(texture, 'magFilter', this.options.magFilters)
                    .name('magFilter')
                    .onChange((value) => texture.magFilter = value);
    
            }
        }

        mipmapsFolder.close()
    }



}

export { MyGuiInterface };
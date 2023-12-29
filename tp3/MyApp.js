
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyContents } from './MyContents.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import Stats from 'three/addons/libs/stats.module.js'

/**
 * This class contains the application object
 */
class MyApp  {
    /**
     * the constructor
     */
    constructor() {
        this.scene = null
        this.stats = null

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.frustumSize = 20

        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = null
        this.contents == null
    }
    /**
     * initializes the application
     */
    init() {    
        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x101010 );

        this.stats = new Stats()
        this.stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        this.initCameras();
        //this.setActiveCamera('Perspective')
        this.setActiveCamera('MainMenuPerspective')

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");

        // Configure renderer size
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild( this.renderer.domElement );

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false );
    }

    /**
     * initializes all the cameras
     */
    initCameras() {
        const aspect = window.innerWidth / window.innerHeight;

        // Create a basic perspective camera
        const perspective1 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspective1.position.set(30,150,-20)
        this.cameras['Perspective'] = perspective1
        
        const playerCarPerspective = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        playerCarPerspective.position.set(0, 10, 0)
        this.cameras['PlayerCarPerspective'] = playerCarPerspective

        const autonomousCarPerspective = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        autonomousCarPerspective.position.set(0, 10, 0)
        this.cameras['AutonomousCarPerspective'] = autonomousCarPerspective

        const mainMenuPerspective = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        mainMenuPerspective.position.set(-197, -260, 335)
        this.cameras['MainMenuPerspective'] = mainMenuPerspective

        const startMenuPerspective = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        startMenuPerspective.position.set(-197, 0, 250)
        this.cameras['StartMenuPerspective'] = startMenuPerspective

        const playerParkingLotPerspective1 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        playerParkingLotPerspective1.position.set(128, 20, -197)
        this.cameras['PlayerParkingLot1'] = playerParkingLotPerspective1

        const playerParkingLotPerspective2 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        playerParkingLotPerspective2.position.set(128, 20, -205)
        this.cameras['PlayerParkingLot2'] = playerParkingLotPerspective2

        const playerParkingLotPerspective3 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        playerParkingLotPerspective3.position.set(128, 20, -213)
        this.cameras['PlayerParkingLot3'] = playerParkingLotPerspective3

        const playerParkingLotPerspective4 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        playerParkingLotPerspective4.position.set(128, 20, -221)
        this.cameras['PlayerParkingLot4'] = playerParkingLotPerspective4

        const autonomousParkingLotPerspective = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        autonomousParkingLotPerspective.position.set(-285, 6, -50)
        this.cameras['OpponentParkingLot1'] = autonomousParkingLotPerspective

        const autonomousParkingLotPerspective2 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        autonomousParkingLotPerspective2.position.set(-285, 6, -50)
        this.cameras['OpponentParkingLot2'] = autonomousParkingLotPerspective2

        const autonomousParkingLotPerspective3 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        autonomousParkingLotPerspective3.position.set(-285, 6, -50)
        this.cameras['OpponentParkingLot3'] = autonomousParkingLotPerspective3

        const autonomousParkingLotPerspective4 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        autonomousParkingLotPerspective4.position.set(-285, 6, -50)
        this.cameras['OpponentParkingLot4'] = autonomousParkingLotPerspective4
    }

    smoothCameraTransition(toCameraName, duration) {
        if(this.activeCameraName == toCameraName) {
            return
        }
        
        const fromCamera = this.activeCamera;
        const fromCameraOriginalPosition = fromCamera.position.clone();
        const toCamera = this.cameras[toCameraName];
        const startTime = performance.now();
    
        const updateCamera = () => {
            const now = performance.now();
            const progress = Math.min((now - startTime) / duration, 1);

            fromCamera.position.lerpVectors(fromCamera.position, toCamera.position, progress);
            fromCamera.lookAt(toCamera.position);
        
            if (progress < 0.13) {
                requestAnimationFrame(updateCamera);
            } else {
                fromCamera.position.copy(fromCameraOriginalPosition);
                this.setActiveCamera(toCameraName);
            }
        };

        updateCamera();
    }
    
    
   
    /**
     * sets the active camera by name
     * @param {String} cameraName 
     */
    setActiveCamera(cameraName) {   
        this.activeCameraName = cameraName
        this.activeCamera = this.cameras[this.activeCameraName]
        if(this.activeCameraName == 'PlayerCarPerspective') {
            this.contents.followPlayerVehicle = true
            this.contents.followAutonomousVehicle = false
        }
        else if(this.activeCameraName == 'AutonomousCarPerspective') {
            this.contents.followPlayerVehicle = false
            this.contents.followAutonomousVehicle = true
        }
        else {
            if(this.contents){
                this.contents.followPlayerVehicle = false
                this.contents.followAutonomousVehicle = false
            }
        }
    }

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {
        // camera changed?
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName]
            document.getElementById("camera").innerHTML = this.activeCameraName
           
            // call on resize to update the camera aspect ratio
            // among other things
            this.onResize()

            // are the controls yet?
            if (this.controls === null) {
                // Orbit controls allow the camera to orbit around a target.
                this.controls = new OrbitControls( this.activeCamera, this.renderer.domElement );
                //this.controls.enableZoom = false;
                //this.controls.enableRotate = false;
                //this.controls.enablePan = false;
                this.controls.update();
                this.setControlsTarget();
            }
            else {
                this.controls.object = this.activeCamera
                this.setControlsTarget();
            }
        }
    }

    /**
     * sets the controls' target
     */
    setControlsTarget() {
        /*
        switch (this.activeCameraName) {
            case 'PlayerParkingLot':
                this.controls.target = new THREE.Vector3(120, 10, -200);
                break;
            case 'AutonomousParkingLot':
                this.controls.target = new THREE.Vector3(-250, 10, 0);
                break;
            case 'Perspective':
                this.controls.target = new THREE.Vector3(0, 0, 0);
                break;
        }
        */
    }

    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }
    }
    /**
     * 
     * @param {MyContents} contents the contents object 
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * @param {MyGuiInterface} contents the gui interface object
     */
    setGui(gui) {   
        this.gui = gui
    }

    /**
    * the main render function. Called in a requestAnimationFrame loop
    */
    render () {
        this.stats.begin()
        this.updateCameraIfRequired()

        // update the animation if contents were provided
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.contents.update()
        }

        // required if controls.enableDamping or controls.autoRotate are set to true
        this.controls.update();

        // render the scene
        this.renderer.render(this.scene, this.activeCamera);

        // subsequent async calls to the render loop
        requestAnimationFrame( this.render.bind(this) );

        this.lastCameraName = this.activeCameraName
        this.stats.end()
    }
}


export { MyApp };
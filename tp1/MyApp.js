
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

        this.coffeeTablePosition = new THREE.Vector3(0, 0.9, -4.9);
        this.cakePosition = new THREE.Vector3(0, 1.9, 4.5);
        this.vinylPosition = new THREE.Vector3(-7, 2, -5);
        this.flowersPosition = new THREE.Vector3(-5, 2, -7);
        this.photosPosition = new THREE.Vector3(0, 2, -8);
        this.paintingsPosition = new THREE.Vector3(0, 2, 8);
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
        this.setActiveCamera('Perspective')

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
        perspective1.position.set(10,10,3)
        this.cameras['Perspective'] = perspective1

        // new camera from tp
        const perspective2 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspective2.position.set(0,8,3)
        this.cameras['Perspective2'] = perspective2

        // defines the frustum size for the orthographic cameras
        const left = -this.frustumSize / 2 * aspect
        const right = this.frustumSize /2 * aspect 
        const top = this.frustumSize / 2 
        const bottom = -this.frustumSize / 2
        const near = -this.frustumSize /2
        const far =  this.frustumSize

        // create a left view orthographic camera
        const orthoLeft = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoLeft.up = new THREE.Vector3(0,1,0);
        orthoLeft.position.set(-this.frustumSize /4,0,0) 
        orthoLeft.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Left'] = orthoLeft

        // create a right view orthographic camera
        const orthoRight = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoRight.up = new THREE.Vector3(0,1,0);
        orthoRight.position.set(this.frustumSize /4, 0, 0) 
        orthoRight.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Right'] = orthoRight

        // create a top view orthographic camera
        const orthoTop = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoTop.up = new THREE.Vector3(0,0,1);
        orthoTop.position.set(0, this.frustumSize /4, 0) 
        orthoTop.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Top'] = orthoTop

        // create a front view orthographic camera
        const orthoFront = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoFront.up = new THREE.Vector3(0,1,0);
        orthoFront.position.set(0,0, this.frustumSize /4) 
        orthoFront.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Front'] = orthoFront
        
        // create a back view orthographic camera
        const orthoBack = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoBack.up = new THREE.Vector3(0,1,0);
        orthoBack.position.set(0,0,-this.frustumSize /4) 
        orthoBack.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Back'] = orthoBack

        // coffeeTable camera
        let coffeeTableCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000 );
        coffeeTableCamera.position.set(-0.77, 1.94, -2.17)   
        this.cameras['CoffeeTable'] = coffeeTableCamera;

        // cake/table camera
        let cakeCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000 );
        cakeCamera.position.set(4.29, 4.25, 2.46);  
        this.cameras['Cake'] = cakeCamera;

        // vinyl camera
        let vinylCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000 );
        vinylCamera.position.set(-2, 2.4, -4.8);
        this.cameras['Vinyl'] = vinylCamera;

        // flowers camera
        let flowersCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000 );
        flowersCamera.position.set(-3, 4.7, -2.7);   
        this.cameras['Flowers'] = flowersCamera;

        // photos camera
        let photosCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000 );
        photosCamera.position.set(0, 2.5, -1);   
        this.cameras['Photos'] = photosCamera;

        // paintings camera
        let paintingsCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000 );
        paintingsCamera.position.set(0, 2.5, -1);   
        this.cameras['Paintings'] = paintingsCamera;
    }

    /**
     * sets the controls' target
     */
    setControlsTarget() {   
        switch(this.activeCameraName){
            case 'CoffeeTable':
                this.controls.target = this.coffeeTablePosition;
                break;
            case 'Cake':
                this.controls.target = this.cakePosition;
                break;
            case 'Vinyl':
                this.controls.target = this.vinylPosition;
                break;
            case 'Flowers':
                this.controls.target = this.flowersPosition;
                break;
            case 'Photos':
                this.controls.target = this.photosPosition;
                break;
            case 'Paintings':
                this.controls.target = this.paintingsPosition;
                break;
        }
    }

    /**
     * sets the active camera by name
     * @param {String} cameraName 
     */
    setActiveCamera(cameraName) {   
        this.activeCameraName = cameraName
        this.activeCamera = this.cameras[this.activeCameraName]
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
                this.controls.enableZoom = true;
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
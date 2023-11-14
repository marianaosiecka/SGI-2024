import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyGlobals } from './auxiliar/MyGlobals.js';
import { MyTexture } from './auxiliar/MyTexture.js';
import { MyMaterial } from './auxiliar/MyMaterial.js';
import { MyNode } from './auxiliar/MyNode.js';
import { MyOrthographicCamera } from './auxiliar/cameras/MyOrthographicCamera.js';
import { MyPerspectiveCamera } from './auxiliar/cameras/MyPerspectiveCamera.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        this.defaultMaterial = new THREE.MeshBasicMaterial();

        this.materials = new Map();
        this.textures = new Map();
        this.cameras = new Map();

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        this.reader.open("scenes/demo/demo.xml");	

    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        this.visitData(data);
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    visitData(data) {

        // TEXTURES
        for (var key in data.textures) {
            let textureData = data.textures[key]  
            let myTexture = new MyTexture(textureData)
            this.textures.set(textureData.id, myTexture.texture)
        }

        // MATERIALS
        for (var key in data.materials) {
            let materialData = data.materials[key]

            let tex = this.textures.get(materialData.textureref);
            if (tex == undefined) tex = null;

            let bumpTex = this.textures.get(materialData.bump_ref);
            if (bumpTex == undefined) bumpTex = null;
            
            let myMaterial = new MyMaterial(materialData, tex, bumpTex);
            this.materials.set(materialData.id, myMaterial.material)
        }

        // CAMERAS
        for (var key in data.cameras) {
            let cameraData = data.cameras[key]
            let camera = null;
            let isActive = false;
            if(data.activeCameraId == cameraData.id)
                isActive = true;
            if(cameraData.type == "orthogonal")
                camera = new MyOrthographicCamera(cameraData, isActive);
            else
                camera = new MyPerspectiveCamera(cameraData, isActive);
            this.cameras.set(cameraData.id, camera)
        }
        
        //let skybox = new THREE.BoxGeometry(data.skybox.width, data.skybox.height, data.skybox.depth)

        // SCENE GLOBALS
        let dataOptions = data.options;
        let fogData = data.fog;
        this.app.scene.add(new THREE.AmbientLight(dataOptions.ambient));
        this.app.scene.background = dataOptions.background;
        this.app.scene.fog = new THREE.Fog(fogData.color, fogData.near, fogData.far);

        // VISIT SCENE NODE CHILDREN
        let sceneNode = data.nodes.scene;
        let myScene = new MyNode(sceneNode.id, this.defaultMaterial, sceneNode.transformations);
        myScene.visitChildren(sceneNode.children, this.materials);
        myScene.group.visible = sceneNode.loaded;
        this.app.scene.add(myScene.group);
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        console.log(data)
        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item

        //console.log(new THREE.Color('#FFFFFF'));
        
       this.output(data.options)
        console.log("textures:")
        for (var key in data.textures) {
            let texture = data.textures[key]
            this.output(texture, 1)
        }

        console.log("materials:")
        for (var key in data.materials) {
            let material = data.materials[key]
            this.output(material, 1)
        }

        console.log("cameras:")
        for (var key in data.cameras) {
            let camera = data.cameras[key]
            this.output(camera, 1)
        }

        console.log("nodes:")
        for (var key in data.nodes) {
            let node = data.nodes[key]
            this.output(node, 1)
            for (let i=0; i< node.children.length; i++) {
                let child = node.children[i]
                if (child.type === "primitive") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with "  + child.representations.length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    }
                }
                else {
                    this.output(child, 2)
                }
            }
        }
    }

    update() {
        
    }
}

export { MyContents };
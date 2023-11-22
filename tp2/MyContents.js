import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyTexture } from './auxiliar/MyTexture.js';
import { MyMaterial } from './auxiliar/MyMaterial.js';
import { MyNode } from './auxiliar/MyNode.js';
import { MyOrthographicCamera } from './auxiliar/cameras/MyOrthographicCamera.js';
import { MyPerspectiveCamera } from './auxiliar/cameras/MyPerspectiveCamera.js';
import { MySkybox } from './auxiliar/MySkybox.js';

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

        this.defaultMaterial = new MyMaterial(new THREE.MeshBasicMaterial(), null, null, null, true);

        this.materials = new Map();
        this.textures = new Map();
        this.cameras = new Map();
        this.skyboxes = new Map();
        this.lights = new Map();
        this.nodes = new Map();

        this.group = null;

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        this.reader.open("scenes/scene.xml");	

    }

    /**
     * initializes the contents
     */
    init(){
        
    }
    createAxis() {
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
        //console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
       // this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    visitData(data) {
        // TEXTURES
        let videoNum = 0;
        for (var key in data.textures) {
            let textureData = data.textures[key]  
            let myTexture = new MyTexture(textureData, videoNum)
            this.textures.set(textureData.id, myTexture.texture)
            videoNum = myTexture.videoNum;
        }
        console.log(this.textures)

        // MATERIALS
        for (var key in data.materials) {
            let materialData = data.materials[key]

            let tex = this.textures.get(materialData.textureref);
            if (tex == undefined) tex = null;

            let bumpTex = this.textures.get(materialData.bumpref);
            if (bumpTex == undefined) bumpTex = null;

            let specularTex = this.textures.get(materialData.specularref);
            if (specularTex == undefined) specularTex = null;

            let myMaterial = new MyMaterial(materialData, tex, bumpTex, specularTex);
            this.materials.set(materialData.id, myMaterial)
        }

        // CAMERAS
        this.activeCameraId = data.activeCameraId;
        for (var key in data.cameras) {
            let cameraData = data.cameras[key]
            let camera = null;
            const isActive = (cameraData.id == this.activeCameraId)
            if(cameraData.type == "orthogonal")
                camera = new MyOrthographicCamera(cameraData, isActive);
            else
                camera = new MyPerspectiveCamera(cameraData, isActive);
            this.cameras.set(cameraData.id, camera)
        }
        
        // SKYBOXES
        for (var key in data.skyboxes) {
            let skyboxData = data.skyboxes[key];
            let skybox = new MySkybox(skyboxData);
            this.skyboxes.set(skyboxData.id, skybox.skybox);
            this.app.scene.add(skybox.skybox);
        }

        // SCENE GLOBALS
        let dataOptions = data.options;
        let fogData = data.fog;
        const ambientLight = new THREE.AmbientLight(dataOptions.ambient, 0.5);
        this.app.scene.add(ambientLight);
        this.app.scene.background = dataOptions.background;
        this.app.scene.fog = new THREE.Fog(fogData.color, fogData.near, fogData.far);

        
        // VISIT SCENE NODE CHILDREN
        let sceneNode = data.nodes.scene;
        let myScene = new MyNode(sceneNode.id, this.defaultMaterial, sceneNode.transformations, this.lights);
        myScene.visitChildren(sceneNode.children, this.materials);
        myScene.group.visible = sceneNode.loaded;
        this.app.scene.add(myScene.group);
        this.group = myScene.group;

        this.nodes = myScene.nodesMap;

    }

    onAfterSceneLoadedAndBeforeRender(data) {
        //console.log(data)
        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item
        
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
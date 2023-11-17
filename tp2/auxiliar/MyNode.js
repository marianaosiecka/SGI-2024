import * as THREE from 'three';
import { MyPrimitiveVisitor } from './MyPrimitiveVisitor.js';
import { MyDirectionalLight } from "./lights/MyDirectionalLight.js";
import { MyPointLight } from "./lights/MyPointLight.js";
import { MySpotLight } from "./lights/MySpotLight.js";

class MyNode {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(id, material, transformations, app) {
        console.log(id)
        this.id = id;
        this.material = material;
        this.transformations = transformations;


        this.app = app;
        this.group = new THREE.Group();
    }

    visitChildren(children, materials){
        for(let child of children){
            let childNode;
            
            // MATERIAL
            //console.log(this.material)
            let materialIds = child.materialIds;
            let childMaterial;
            if(materialIds != undefined)
                childMaterial = materialIds.length == 0 ? this.material : materials.get(materialIds[0]);
            else childMaterial = this.material
              
            
            if(child.type === "node"){
                childNode = new MyNode(child.id, childMaterial, child.transformations, this.app)
                childNode.visitChildren(child.children, materials)
                this.group.add(childNode.group)
            }
            else if(child.type === "primitive"){
                let primitive = new MyPrimitiveVisitor(child, child.transformations, childMaterial)
                childNode = primitive.mesh;
                this.group.add(childNode)
            }
            else if(child.type === "spotlight"){
                let spotlight = new MySpotLight(child)
                childNode = spotlight.light
                this.group.add(childNode)

                let spotlightTarget = spotlight.target
                this.group.add(spotlightTarget)

                /*let spotlightHelper = new THREE.SpotLightHelper(spotlight.light)
                console.log(spotlightHelper)
                childNode.updateMatrixWorld();
                spotlightHelper.update();
                this.group.add(spotlightHelper)*/
            }
            else if(child.type === "directionallight"){
                let directionallight = new MyDirectionalLight(child)
                childNode = directionallight.light
                this.group.add(childNode)
            }
            else if(child.type === "pointlight"){
                let pointlight = new MyPointLight(child)
                childNode = pointlight.light
                this.group.add(childNode)
            }
        }

        for(let key in this.transformations){
            let transformation = this.transformations[key]
            if(transformation.type == "T"){
                this.group.position.set(this.group.position.x + transformation.translate[0],
                                        this.group.position.y + transformation.translate[1],
                                        this.group.position.z + transformation.translate[2])
            }
            else if (transformation.type == "R"){
                this.group.rotation.set(this.group.rotation.x + transformation.rotation[0], 
                                        this.group.rotation.y + transformation.rotation[1],
                                        this.group.rotation.z + transformation.rotation[2])
            }
            else if(transformation.type == "S"){
                this.group.scale.set(this.group.scale.x * transformation.scale[0],
                                    this.group.scale.y * transformation.scale[1],
                                    this.group.scale.z * transformation.scale[2])
            }
        }

    }    
}

export { MyNode };
import * as THREE from 'three';
import { MyPrimitiveVisitor } from './MyPrimitiveVisitor.js';
import { MyDirectionalLight } from "./lights/MyDirectionalLight.js";
import { MyPointLight } from "./lights/MyPointLight.js";
import { MySpotLight } from "./lights/MySpotLight.js";

class MyNode extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(id, material, transformations) {
        super();
        //this.id = id;
        this.material = material;
        
        this.transformations = new Map();
        this.transformations.set("T", [0, 0, 0])
        this.transformations.set("R", [1, 1, 1])
        this.transformations.set("S", [1, 1, 1])

        for(let tranformation of transformations){
            if(tranformation.type == "T"){
                this.transformations.set("T", [this.transformations.get("T")[0] + tranformation.translate[0],
                                               this.transformations.get("T")[1] + tranformation.translate[1],
                                               this.transformations.get("T")[2] + tranformation.translate[2]])
            }
            else if(tranformation.type == "R"){
                this.transformations.set("R", [this.transformations.get("R")[0] * tranformation.rotation[0],
                                               this.transformations.get("R")[1] * tranformation.rotation[1],
                                               this.transformations.get("R")[2] * tranformation.rotation[2]])
            }
            else if(tranformation.type == "S"){
                this.transformations.set("S", [this.transformations.get("S")[0] * tranformation.scale[0],
                                               this.transformations.get("S")[1] * tranformation.scale[1],
                                               this.transformations.get("S")[2] * tranformation.scale[2]])
            }
        }

        this.group = new THREE.Group();
    }

    visitChildren(children){
        for(let child of children){
            let childNode;
            let childMaterial = child.material == null ? this.material : child.material;

            let childTransformations = new Map([...this.transformations]);
           
            // TRANSFORMATIONS
            if(child.tranformations != undefined){
                for(let childTransformation of child.transformations){
                    if(childTransformation.type == "T"){
                        childTransformations.set("T", [this.transformations.get("T")[0] + childTransformation.translate[0],
                                                       this.transformations.get("T")[1] + childTransformation.translate[1],
                                                       this.transformations.get("T")[2] + childTransformation.translate[2]])
                    }
                    else if(childTransformation.type == "R"){
                        childTransformations.set("R", [this.transformations.get("R")[0] * childTransformation.rotation[0],
                                                        this.transformations.get("R")[1] * childTransformation.rotation[1],
                                                        this.transformations.get("R")[2] * childTransformation.rotation[2]])
                    }
                    else if(childTransformation.type == "S"){
                        childTransformations.set("S", [this.transformations.get("S")[0] * childTransformation.scale[0],
                                                        this.transformations.get("S")[1] * childTransformation.scale[1],
                                                        this.transformations.get("S")[2] * childTransformation.scale[2]])
                    }
                }
            }
            console.log(child.type)
            if(child.type == "node"){
                childNode = new MyNode(child.id, childMaterial, childTransformations)
                childNode.visitChildren(child.children)
            }
            else if(child.type == "primitive"){
                let primitive = new MyPrimitiveVisitor(child, childTransformations, childMaterial)
                childNode = primitive.mesh;
            }
            
            else if(child.type == "spotlight"){
                childNode = new THREE.PointLight(child.color, child.intensity, child.distance, child.angle, child.penumbra, child.decay);
                childNode.position.set(child.position[0], child.position[1], child.position[2]);
                //target can't be like this this.light.target.position.set(spotData.target[0], spotData.target[1], spotData.target[2]);
                if(child.castShadow){
                    childNode.castShadow = true;
                    childNode.shadow.mapSize.width = child.shadowmapsize;
                    childNode.shadow.mapSize.height = child.shadowmapsize;
                    childNode.camera.far = childNode.shadowfar;
                }
                if(!child.enabled)
                    this.light.intensity = 0;

            }
            else if(child.type == "directional"){
                directional = new MyDirectionalLight(child.data)
                childNode = directional.light
            }
            else if(child.type == "pointlight"){
                childNode = new THREE.PointLight(child.color, child.intensity, child.distance, child.decay);
                childNode.position.set(child.position[0], child.position[1], child.position[2]);
                if(child.castShadow){
                    childNode.castShadow = true;
                    childNode.shadow.mapSize.width = pointData.shadowmapsize;
                    childNode.shadow.mapSize.height = pointData.shadowmapsize;
                    childNode.camera.far = pointData.shadowfar;
                }
                if(!child.enabled)
                    childNode.intensity = 0;
            }
            
            this.group.add(childNode)
        }  
    }    
}

MyNode.prototype.isGroup = true;

export { MyNode };
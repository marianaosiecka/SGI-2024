import * as THREE from 'three';
import { MyPrimitiveVisitor } from './MyPrimitiveVisitor.js';
import { MyDirectionalLight } from "./lights/MyDirectionalLight.js";
import { MyPointLight } from "./lights/MyPointLight.js";
import { MySpotLight } from "./lights/MySpotLight.js";

class MyNode {
    constructor(id, material, transformations, nodesMap = new Map()) {
        console.log(id)
        this.id = id;
        this.material = material;
        this.transformations = transformations;
        this.getTransformationMatrix();
        this.nodesMap = nodesMap;
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
                childNode = new MyNode(child.id, childMaterial, child.transformations, this.nodesMap)

                if(!this.nodesMap.has(child.id)){
                    childNode.visitChildren(child.children, materials)
                    this.nodesMap.set(childNode.id, childNode.group)
                }
               else {
                    childNode.group = this.nodesMap.get(child.id).clone();
                }
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

        this.group.applyMatrix4(this.transformationMatrix);
    }


    getTransformationMatrix(){
        this.transformationMatrix = new THREE.Matrix4();
        this.transformationMatrix.identity();

        for (let key in this.transformations){
            let transformation = this.transformations[key];
            if(transformation.type == "T"){
                let translationMatrix = new THREE.Matrix4();
                translationMatrix.makeTranslation(transformation.translate[0], transformation.translate[1], transformation.translate[2]);
                this.transformationMatrix.multiply(translationMatrix);
            }
    
            else if(transformation.type == "S"){
                let scaleMatrix = new THREE.Matrix4();
                scaleMatrix.makeScale(transformation.scale[0], transformation.scale[1], transformation.scale[2]);
                this.transformationMatrix.multiply(scaleMatrix);
            }
    
            else if(transformation.type == "R"){
                let rotationMatrix = new THREE.Matrix4();
                rotationMatrix.makeRotationFromEuler(new THREE.Euler(transformation.rotation[0], transformation.rotation[1], transformation.rotation[2]));
                this.transformationMatrix.multiply(rotationMatrix);
            }
        }        
    }
}

export { MyNode };
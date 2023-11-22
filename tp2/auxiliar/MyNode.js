import * as THREE from 'three';
import { MyPrimitiveVisitor } from './MyPrimitiveVisitor.js';
import { MyDirectionalLight } from "./lights/MyDirectionalLight.js";
import { MyPointLight } from "./lights/MyPointLight.js";
import { MySpotLight } from "./lights/MySpotLight.js";
import { MyLod } from "./MyLod.js";


class MyNode {
    /**
     * @param {string} id - The unique identifier for the node.
     * @param {MyMaterial} material - The material for the node.
     * @param {Array} transformations - The array of transformations for the node.
     * @param {Map} lights - Map of lights.
     * @param {Map} nodesMap - Map of nodes.
     * @param {boolean} castShadows - Indicates whether the node casts shadows.
     * @param {boolean} receiveShadows - Indicates whether the node receives shadows.
     */
    constructor(id, material, transformations, lights, nodesMap = new Map(), castShadows = false, receiveShadows = false) {
        this.id = id;
        this.material = material;

        this.transformations = transformations;
        this.getTransformationMatrix();

        this.lights = lights;
        this.nodesMap = nodesMap;
        this.castShadows = castShadows;
        this.receiveShadows = receiveShadows;

        this.group = new THREE.Group();
        this.group.name = this.id;
    }

    /**
     * Visits the children of the node and creates the corresponding objects.
     * @param {Object[]} children - The array of child objects.
     * @param {Map} materials - Map of materials.
     */
    visitChildren(children, materials) {
        for (let child of children) {
            // material
            let materialIds = child.materialIds;
            let childMaterial;

            // if the node doesn't have a material associated, gets the one from its parent node; else, gets the one specified
            if (materialIds != undefined)
                childMaterial = materialIds.length == 0 ? this.material : materials.get(materialIds[0]);
            else childMaterial = this.material

            // process child based on its type
            // node
            if (child.type === "node") {
                const childReceiveShadow = (this.receiveShadows || child.receiveShadows)
                const childCastShadow = (this.castShadows || child.castShadows)

                let childNode = new MyNode(child.id, childMaterial, child.transformations, this.lights, this.nodesMap, childCastShadow, childReceiveShadow)

                // if the node wasn't already created, visit its children
                if (!this.nodesMap.has(child.id)) {
                    childNode.visitChildren(child.children, materials)
                    this.nodesMap.set(childNode.id, childNode)
                }

                // if it was, clone the node group and, if needed, adjust the material
                else {
                    childNode.group = this.nodesMap.get(child.id).group.clone();
                    if (childNode.material.material != this.nodesMap.get(child.id).material.material) {
                        this.changeGroupMaterial(childNode.group, childNode.material.material)
                    }
                }
                this.group.add(childNode.group)
            }

            // lod
            else if (child.type === "lod") {
                const myLod = new MyLod(child, this.material, materials, this.lights, this.nodesMap, this.castShadows, this.receiveShadows);
                const lod = myLod.lod;
                this.group.add(lod);
            }

            // primitive
            else if (child.type === "primitive") {
                const myPrimitive = new MyPrimitiveVisitor(child, child.transformations, childMaterial, this.castShadows, this.receiveShadows)
                const primitive = myPrimitive.mesh;
                this.group.add(primitive)
            }

            // spot light
            else if (child.type === "spotlight") {
                const childCastShadow = (this.castShadows || child.castshadow)

                let mySpotlight = new MySpotLight(child, childCastShadow)
                let spotLight = mySpotlight.light
                this.group.add(spotLight)

                // create and add the target
                let spotlightTarget = mySpotlight.target
                this.group.add(spotlightTarget)

                this.lights.set(child.id, mySpotlight)
            }

            // directional light
            else if (child.type === "directionallight") {
                const childCastShadow = (this.castShadows || child.castshadow)
                let myDirectionallight = new MyDirectionalLight(child, childCastShadow)
                let directionalLight = myDirectionallight.light
                this.group.add(directionalLight)
                this.lights.set(child.id, myDirectionallight)
            }

            // point light
            else if (child.type === "pointlight") {
                const childCastShadow = (this.castShadows || child.castshadow)
                let myPointlight = new MyPointLight(child, childCastShadow)
                let pointLight = myPointlight.light
                this.group.add(pointLight)
                this.lights.set(child.id, myPointlight)
            }

        }

        // apply transformations
        this.group.applyMatrix4(this.transformationMatrix);
    }

    /**
     * Changes the material of a group and its children.
     * @param {THREE.Group} group - The group to change the material for.
     * @param {THREE.Material} newMaterial - The new material.
     */
    changeGroupMaterial(group, newMaterial) {
        group.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = newMaterial;
            }
        });
    }

    /**
     * Computes the transformation matrix based on the transformation array.
     */
    getTransformationMatrix() {
        this.transformationMatrix = new THREE.Matrix4();
        this.transformationMatrix.identity();

        for (let key in this.transformations) {
            let transformation = this.transformations[key];
            // translation
            if (transformation.type == "T") {
                let translationMatrix = new THREE.Matrix4();
                translationMatrix.makeTranslation(transformation.translate[0], transformation.translate[1], transformation.translate[2]);
                this.transformationMatrix.multiply(translationMatrix);
            }

            // scale
            else if (transformation.type == "S") {
                let scaleMatrix = new THREE.Matrix4();
                scaleMatrix.makeScale(transformation.scale[0], transformation.scale[1], transformation.scale[2]);
                this.transformationMatrix.multiply(scaleMatrix);
            }

            // rotation
            else if (transformation.type == "R") {
                let rotationMatrix = new THREE.Matrix4();
                rotationMatrix.makeRotationFromEuler(new THREE.Euler(transformation.rotation[0], transformation.rotation[1], transformation.rotation[2]));
                this.transformationMatrix.multiply(rotationMatrix);
            }
        }
    }
}

export { MyNode };
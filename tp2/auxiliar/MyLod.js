import * as THREE from 'three';
import { MyNode } from "./MyNode.js";

class MyLod {

    /**
     * Constructor for MyLod class.
     *
     * @param {Object} lodData - The LOD configuration data.
     * @param {MyMaterial} parentMaterial - The material for the LOD.
     * @param {Map} materials - A map of materials of the scene.
     * @param {Map} lights - Map of lights.
     * @param {Map} nodesMap - Map of nodes.
     * @param {boolean} castShadows - Indicates whether the LOD casts shadows.
     * @param {boolean} receiveShadows - Indicates whether the LOD receives shadows.
     */
    constructor(lodData, parentMaterial, materials, lights, nodesMap, representationsMap, castShadows, receiveShadows) {
        this.lod = new THREE.LOD();
        for(let lodRef of lodData.children){
            const lodNode = lodRef.node;
        
            // material
            let lodMaterial = null;
            if(lodNode.materialIds != undefined)
                lodMaterial = lodNode.materialIds.length == 0 ? parentMaterial : materials.get(lodNode.materialIds[0]);
            else lodMaterial = parentMaterial

            // shadows
            const lodReceiveShadow = (receiveShadows || lodNode.castshadow)
            const lodCastShadow = (castShadows || lodNode.receiveshadow)

            // node 
            let myLodNode = new MyNode(lodNode.id, lodMaterial, lodNode.transformations, lights, nodesMap, representationsMap, lodCastShadow, lodReceiveShadow)

            if(!nodesMap.has(lodNode.id)){
                myLodNode.visitChildren(lodNode.children, materials)
            }
            else {
                myLodNode.group = nodesMap.get(lodNode.id).clone()
                if (lodNode.material.material != this.nodesMap.get(lodNode.id).material.material) {
                    myLodNode.changeGroupMaterial(lodNode.group, lodNode.material.material)
                }
            }
            this.lod.addLevel(myLodNode.group, lodRef.mindist);
        }
    }

}


export { MyLod };
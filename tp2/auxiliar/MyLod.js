import * as THREE from 'three';
import { MyNode } from "./MyNode.js";

class MyLod {

    /**
     * Constructor for MyLod class.
     *
     * @param {Object} lodData - The LOD configuration data.
     * @param {MyMaterial} parentMaterial - A basic material.
     * @param {Map} materials - A map of materials referenced in the LOD configuration.
     * @param {Array<THREE.Light>} lights - An array of lights affecting the LOD.
     * @param {Map} nodesMap - A map containing information about nodes in the scene.
     * @param {boolean} castShadows - Indicates whether the LOD casts shadows.
     * @param {boolean} receiveShadows - Indicates whether the LOD receives shadows.
     */
    constructor(lodData, parentMaterial, materials, lights, nodesMap, castShadows, receiveShadows) {
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
            let myLodNode = null;
            if(!nodesMap.has(lodNode.id)){
                myLodNode = new MyNode(lodNode.id, lodMaterial, lodNode.transformations, lights, nodesMap, lodCastShadow, lodReceiveShadow)
                myLodNode.visitChildren(lodNode.children, materials)
            }
            else {
                myLodNode.group = nodesMap.get(lodNode.id).clone()
            }
            this.lod.addLevel(myLodNode.group, lodRef.mindist);
        }
    }
}


export { MyLod };
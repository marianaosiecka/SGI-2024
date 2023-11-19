import * as THREE from 'three';
import { MyNode } from "./MyNode.js";

class MyLod {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(lodData, parentMaterial, materials, lights, nodesMap, castShadows, receiveShadows) {
        this.lod = new THREE.LOD();
        for(let lodRef of lodData.children){
            const lodNode = lodRef.node;
        
            // MATERIAL
            let lodMaterial = null;
            if(lodNode.materialIds != undefined)
                lodMaterial = lodNode.materialIds.length == 0 ? parentMaterial : materials.get(lodNode.materialIds[0]);
            else lodMaterial = parentMaterial

            // SHADOWS
            const lodReceiveShadow = (receiveShadows || lodNode.castshadow)
            const lodCastShadow = (castShadows || lodNode.receiveshadow)

            // NODE 
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
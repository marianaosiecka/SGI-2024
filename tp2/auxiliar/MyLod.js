import * as THREE from 'three';
import { MyNode } from "./MyNode.js";

class MyLod {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(lodData, parentMaterial, materials, lights, nodesMap) {
        this.lod = new THREE.LOD();
        for(let lodRef of lodData.children){
            console.log("lodRef ", lodRef)
            const lodNode = lodRef.node;
        
            // MATERIAL
            let lodMaterial = null;
            if(lodNode.materialIds != undefined)
                lodMaterial = lodNode.materialIds.length == 0 ? parentMaterial : materials.get(lodNode.materialIds[0]);
            else lodMaterial = parentMaterial

            // NODE 
            let myLodNode = null;
            if(!nodesMap.has(lodNode.id)){
                console.log("a")
                myLodNode = new MyNode(lodNode.id, lodMaterial, lodNode.transformations, lights, nodesMap, lodNode.castshadow, lodNode.receiveshadow)
                myLodNode.visitChildren(lodNode.children, materials)
            }
            else {
                myLodNode = nodesMap.get(lodNode.id).clone()
            }
            console.log(myLodNode)
            this.lod.addLevel(myLodNode.group, lodRef.mindist);
        }
    }
}


export { MyLod };
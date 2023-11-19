import * as THREE from 'three';
import { MyBox } from "./primitives/MyBox.js";
import { MyRectangle } from "./primitives/MyRectangle.js";
import { MyCylinder } from "./primitives/MyCylinder.js";
import { MySphere } from "./primitives/MySphere.js";
import { MyTriangle } from "./primitives/MyTriangle.js";
import { MyNurbs } from "./primitives/MyNurbs.js";


class MyPrimitiveVisitor {

    constructor(node, tranformations, material, castShadow, receiveShadow) {
        this.data = node.representations[0];
        this.tranformations = tranformations;
        this.material = material
        this.castShadow = castShadow;
        this.receiveShadow = receiveShadow;
        
        let geometry = null;
        switch (node.subtype) {
            case "box": {
                let boxGeometry = new MyBox(this.data);
                geometry = boxGeometry.box;
                material.setRepeat(boxGeometry.boxDepth, boxGeometry.boxWidth)
                break;
            }
            case "cylinder": {
                let cylinderGeometry = new MyCylinder(this.data);
                geometry = cylinderGeometry.cylinder;
                material.setRepeat(cylinderGeometry.top, cylinderGeometry.top)
                break;
            }
            case "nurbs": {
                let nurbGeometry = new MyNurbs(this.data);
                geometry = nurbGeometry.build();
                break;
            }
            case "rectangle": {
                let rectangleGeometry = new MyRectangle(this.data);
                geometry = rectangleGeometry.rectangle;
                material.setRepeat(rectangleGeometry.rectWidth, rectangleGeometry.rectHeight)
                break;
            }
            case "sphere": {
                let sphereGeometry = new MySphere(this.data);
                geometry = sphereGeometry.sphere;
                material.setRepeat(sphereGeometry.radius, sphereGeometry.radius)
                break;
            }
            case "triangle": {
                let triangleGeometry = new MyTriangle(this.data);
                geometry = triangleGeometry;
                break;
            }
        }
        this.mesh = new THREE.Mesh(geometry, material.material);
        this.mesh.castShadow = this.castShadow
        this.mesh.receiveShadow = this.receiveShadow

        if(node.subtype === "rectangle"){
            this.mesh.position.x = (node.representations[0].xy1[0] + node.representations[0].xy2[0])/2;
            this.mesh.position.y = (node.representations[0].xy1[1] + node.representations[0].xy2[1])/2;
        }

        if(node.subtype === "box"){
            this.mesh.position.x = (node.representations[0].xyz1[0] + node.representations[0].xyz2[0])/2;
            this.mesh.position.y = (node.representations[0].xyz1[1] + node.representations[0].xyz2[1])/2;
            this.mesh.position.z = (node.representations[0].xyz1[2] + node.representations[0].xyz2[2])/2;
        }
 
    }

}


export { MyPrimitiveVisitor };
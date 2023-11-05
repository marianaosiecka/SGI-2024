import * as THREE from 'three';
import { MyBox } from "./primitives/MyBox.js";
import { MyRectangle } from "./primitives/MyRectangle.js";
import { MyCylinder } from "./primitives/MyCylinder.js";
import { MySphere } from "./primitives/MySphere.js";
import { MyTriangle } from "./primitives/MyTriangle.js";
import { MyNurbs } from "./primitives/MyNurbs.js";


class MyPrimitiveVisitor {

    constructor(node, tranformations, material) {
        this.data = node.representations[0];
        this.tranformations = tranformations;
        this.material = material
        
        let geometry = null;
        switch (node.subtype) {
            case "box": {
                let boxGeometry = new MyBox(this.data);
                geometry = boxGeometry.box;
                break;
            }
            case "cylinder": {
                let cylinderGeometry = new MyCylinder(this.data);
                geometry = cylinderGeometry.cylinder;
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
                break;
            }
            case "sphere": {
                let sphereGeometry = new MySphere(this.data);
                geometry = sphereGeometry.sphere;
                break;
            }
            /*case "triangle": {
                let triangleGeometry = new MyTriangle(this.data);
                geometry = triangleGeometry.triangle;
                break;
            }*/
        }

        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.position.set(tranformations.get("T")[0], tranformations.get("T")[1], tranformations.get("T")[2]);
        this.mesh.rotation.set(tranformations.get("R")[0]*Math.PI/180, tranformations.get("R")[1]*Math.PI/180, tranformations.get("R")[2]*Math.PI/180);
        this.mesh.scale.set(tranformations.get("S")[0], tranformations.get("S")[1], tranformations.get("S")[2]);
             
    }

}


export { MyPrimitiveVisitor };
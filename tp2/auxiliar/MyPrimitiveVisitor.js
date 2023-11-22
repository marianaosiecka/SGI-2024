import * as THREE from 'three';
import { MyBox } from "./primitives/MyBox.js";
import { MyRectangle } from "./primitives/MyRectangle.js";
import { MyCylinder } from "./primitives/MyCylinder.js";
import { MySphere } from "./primitives/MySphere.js";
import { MyTriangle } from "./primitives/MyTriangle.js";
import { MyNurbs } from "./primitives/MyNurbs.js";
import { MyPolygon } from './primitives/MyPolygon.js';
import { MyMaterial } from './MyMaterial.js';


class MyPrimitiveVisitor {

    /**
     * Constructor for MyPrimitiveVisitor class.
     *
     * @param {Object} node - The node containing information about the primitive.
     * @param {MyMaterial} material - The material that needs to be added to the mesh.
     * @param {boolean} castShadow - Indicates whether the primitive casts shadows.
     * @param {boolean} receiveShadow - Indicates whether the primitive receives shadows.
     */
    constructor(node, material, castShadow, receiveShadow) {
        this.data = node.representations[0];
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
            case "polygon": {
                let polygonGeometry = new MyPolygon(this.data);
                geometry = polygonGeometry;
                material.material.vertexColors = true;
                break;
            }
        }
        this.mesh = new THREE.Mesh(geometry, material.material);
        this.mesh.castShadow = this.castShadow;
        this.mesh.receiveShadow = this.receiveShadow;

        // in these cases the mesh position needs to be corrected to the center, because before the position was of the first corner of the geometry
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
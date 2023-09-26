import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // plane related attributes
        this.diffusePlaneColor = "#FFF0AD"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess })
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    buildWalls(){
        let wall = new THREE.PlaneGeometry( 10, 5 );
        // right
        this.wall1Mesh = new THREE.Mesh( wall, this.planeMaterial );
        this.wall1Mesh.position.z = -5
        this.wall1Mesh.position.y = 2.5;
        this.app.scene.add( this.wall1Mesh );
        // left
        this.wall2Mesh = new THREE.Mesh( wall, this.planeMaterial );
        this.wall2Mesh.rotation.x = Math.PI;
        this.wall2Mesh.position.z = 5;
        this.wall2Mesh.position.y = 2.5;
        this.app.scene.add( this.wall2Mesh );
        // back
        this.wall3Mesh = new THREE.Mesh( wall, this.planeMaterial );
        this.wall3Mesh.rotation.y = Math.PI / 2;
        this.wall3Mesh.position.y = 2.5;
        this.wall3Mesh.position.x = -5;
        this.app.scene.add( this.wall3Mesh );
        // front
        this.wall4Mesh = new THREE.Mesh( wall, this.planeMaterial );
        this.wall4Mesh.rotation.y = - Math.PI / 2;
        this.wall4Mesh.position.y = 2.5;
        this.wall4Mesh.position.x = 5;
        this.app.scene.add( this.wall4Mesh );
    }

    buildParalelepiped(height, width, depth, posX, posY, posZ, color) {
        let paralelMaterial = new THREE.MeshPhongMaterial({ color: color, 
            specular: "#000000", emissive: "#000000", shininess: 90 })

        let paralel = new THREE.BoxGeometry(width, height, depth);
        let paralelMesh = new THREE.Mesh( paralel, paralelMaterial);
        paralelMesh.rotation.x = -Math.PI / 2;
        paralelMesh.position.x = posX;
        paralelMesh.position.y = posY;
        paralelMesh.position.z = posZ;
        this.app.scene.add(paralelMesh);
    }

    buildCylinder(radiusTop, radiusBottom, height, radialSegments, posX, posY, posZ, color){
        const cylinder = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);         
        const cylinderMaterial = new THREE.MeshBasicMaterial({ color: color });
        const cylinderMesh = new THREE.Mesh(cylinder, cylinderMaterial);
        cylinderMesh.position.x = posX;
        cylinderMesh.position.y = posY;
        cylinderMesh.position.z = posZ;
        this.app.scene.add(cylinderMesh);
    }

    buildCone(radius, height, radialSegments, posX, posY, posZ, color){
        const cone = new THREE.ConeGeometry(radius, height, radialSegments);         
        const coneMaterial = new THREE.MeshBasicMaterial({ color: color });
        const coneMesh = new THREE.Mesh(cone, coneMaterial);
        coneMesh.position.x = posX;
        coneMesh.position.y = posY;
        coneMesh.position.z = posZ;
        this.app.scene.add(coneMesh);
    }

    /*buildSphere(radius, widthSegments, heightSegments, posX, posY, posZ, color){
        const sphere = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, Math.PI * 2); 
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: color});
        const sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
        sphereMesh.position.x = posX;
        sphereMesh.position.y = posY;
        sphereMesh.position.z = posZ;
        this.app.scene.add(sphereMesh);
    }
    */

    buildHemisphere(radius, widthSegments, heightSegments, posX, posY, posZ, verticalAngle, color){
        const hemisphere = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, Math.PI*2, verticalAngle, Math.PI/2);   
        const hemisphereMaterial = new THREE.MeshBasicMaterial({ color: color});
        const hemisphereMesh = new THREE.Mesh(hemisphere, hemisphereMaterial);
        hemisphereMesh.position.x = posX;
        hemisphereMesh.position.y = posY;
        hemisphereMesh.position.z = posZ;
        this.app.scene.add(hemisphereMesh);
    }

    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        this.buildBox()
        
        
        // Create a Plane Mesh with basic material
        let plane = new THREE.PlaneGeometry( 10, 10 );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.app.scene.add( this.planeMesh );

        this.buildWalls();

        //MESA
        //tampo da mesa
        this.buildParalelepiped(3.5, 4.2, 0.1, 0, 1.2, 0, "#7A9E9F");
        //perna esquerda dianteira
        this.buildCylinder(0.2, 0.1, 1.2, 20, 1.75 ,0.6, 1.4, "#7A9E9F");
        //perna esquerda traseira
        this.buildCylinder(0.2, 0.1, 1.2, 20, -1.75 ,0.6, 1.4, "#7A9E9F");
        //perna direira dianteira
        this.buildCylinder(0.2, 0.1, 1.2, 20, 1.75 ,0.6, -1.4, "#7A9E9F");
        //perna direita traseira 
        this.buildCylinder(0.2, 0.1, 1.2, 20, -1.75 ,0.6, -1.4, "#7A9E9F");

        //PRATO
        this.buildCylinder(1.2, 1.2, 0.1, 50, 0, 1.28, 0, "#d9d9cc");
        
        //VELA
        this.buildCylinder(0.04, 0.04, 0.2, 40, 0, 1.38, 0, "#d9883d");
        //chama
        this.buildCone(0.03, 0.1, 40, 0, 1.53, 0, "#ffda54");

        //CADEIRAS
        this.buildParalelepiped(0.9, 1, 0.1, -0.8, 0.7, 2, "#b51f19");
        this.buildParalelepiped(0.1, 0.1, 0.7, -1.1, 0.35, 1.7, "#7A9E9F");
        this.buildParalelepiped(0.1, 0.1, 0.7, -1.1, 0.35, 2.3, "#7A9E9F");
        this.buildParalelepiped(0.1, 0.1, 0.7, -0.5, 0.35, 1.7, "#7A9E9F");
        this.buildParalelepiped(0.1, 0.1, 0.7, -0.5, 0.35, 2.3, "#7A9E9F");
        this.buildParalelepiped(0.1, 1, 0.8, -0.8, 1.05, 2.4, "#b51f19");

        this.buildParalelepiped(0.9, 1, 0.1, 0.8, 0.7, 2, "#b51f19");
        this.buildParalelepiped(0.1, 0.1, 0.7, 1.1, 0.35, 1.7, "#7A9E9F");
        this.buildParalelepiped(0.1, 0.1, 0.7, 1.1, 0.35, 2.3, "#7A9E9F");
        this.buildParalelepiped(0.1, 0.1, 0.7, 0.5, 0.35, 1.7, "#7A9E9F");
        this.buildParalelepiped(0.1, 0.1, 0.7, 0.5, 0.35, 2.3, "#7A9E9F");
        this.buildParalelepiped(0.1, 1, 0.8, 0.8, 1.05, 2.4, "#b51f19");

        this.buildParalelepiped(0.9, 1, 0.1, -0.8, 0.7, -2, "#b51f19");
        this.buildParalelepiped(0.1, 0.1, 0.7, -1.1, 0.35, -1.7, "#7A9E9F");
        this.buildParalelepiped(0.1, 0.1, 0.7, -1.1, 0.35, -2.3, "#7A9E9F");
        this.buildParalelepiped(0.1, 0.1, 0.7, -0.5, 0.35, -1.7, "#7A9E9F");
        this.buildParalelepiped(0.1, 0.1, 0.7, -0.5, 0.35, -2.3, "#7A9E9F");
        this.buildParalelepiped(0.1, 1, 0.8, -0.8, 1.05, -2.4, "#b51f19");

        this.buildParalelepiped(0.9, 1, 0.1, 0.8, 0.7, -2, "#b51f19");
        this.buildParalelepiped(0.1, 0.1, 0.7, 1.1, 0.35, -1.7, "#7A9E9F");
        this.buildParalelepiped(0.1, 0.1, 0.7, 1.1, 0.35, -2.3, "#7A9E9F");
        this.buildParalelepiped(0.1, 0.1, 0.7, 0.5, 0.35, -1.7, "#7A9E9F");
        this.buildParalelepiped(0.1, 0.1, 0.7, 0.5, 0.35, -2.3, "#7A9E9F");
        this.buildParalelepiped(0.1, 1, 0.8, 0.8, 1.05, -2.4, "#b51f19");

        //CANDEEIRO DE TETO
        this.buildCylinder(0.02, 0.02, 0.6, 40, 0, 4.7, 0, "#526d6e");
        this.buildHemisphere(0.5, 30, 30, 0, 4, 0, 0, "#b51f19");
        this.buildHemisphere(0.3, 30, 30, 0, 4.2, 0, Math.PI/2, "#f7e731");
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };
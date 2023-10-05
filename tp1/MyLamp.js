import * as THREE from 'three';

class MyLamp extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, radiusCable, radiusTop, radiusLight, height, radialSegments, xPos, yPos, zPos, colorTop, colorLight, spotLight) {
        super();
        this.app = app;
        this.type = 'Group';

        this.cable = new THREE.CylinderGeometry(radiusCable, radiusCable, height, radialSegments);         
        this.cableMaterial = new THREE.MeshBasicMaterial({ color: colorTop });
        this.cableMesh = new THREE.Mesh(this.cable, this.cableMaterial);
        this.cableMesh.position.x = xPos;
        this.cableMesh.position.y = yPos;
        this.cableMesh.position.z = zPos;
        this.add(this.cableMesh);
        
        this.top = new THREE.SphereGeometry(radiusTop, radialSegments, radialSegments, 0, Math.PI*2, 0, Math.PI/2);   
        this.topMaterial = new THREE.MeshPhongMaterial({ color: colorTop, specular:"#777777", shininess:8} );
        this.topMesh = new THREE.Mesh(this.top, this.topMaterial);
        this.topMesh.position.x = xPos;
        this.topMesh.position.y = yPos - height/2 - radiusTop;
        this.topMesh.position.z = zPos;
        this.add(this.topMesh);

        this.light = new THREE.SphereGeometry(radiusLight, radialSegments, radialSegments, 0, Math.PI*2, Math.PI/2, Math.PI/2);   
        this.lightMaterial = new THREE.MeshBasicMaterial({ color: colorLight});
        this.lightMesh = new THREE.Mesh(this.light, this.lightMaterial);
        this.lightMesh.position.x = xPos;
        this.lightMesh.position.y = yPos - height/2.5 - radiusTop/2 - radiusLight/3;
        this.lightMesh.position.z = zPos;
        this.add(this.lightMesh);

        this.add(spotLight);
    }

    changeColorCable(color) {
        this.cableMesh.material.color = new THREE.Color(color);
    }

    changeColorTop(color) {
        this.topMesh.material.color = new THREE.Color(color);
    }
}


MyLamp.prototype.isGroup = true;
export { MyLamp };
import * as THREE from 'three';

class MyLamp extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, radiusCable, radiusTop, radiusLight, height, radialSegments, colorTop, colorLight, spotLight) {
        super();
        this.app = app;
        this.type = 'Group';

        this.cable = new THREE.CylinderGeometry(radiusCable, radiusCable, height, radialSegments);         
        this.cableMaterial = new THREE.MeshBasicMaterial({ color: colorTop });
        this.cableMesh = new THREE.Mesh(this.cable, this.cableMaterial);
        this.add(this.cableMesh);
        
        this.top = new THREE.SphereGeometry(radiusTop, radialSegments, radialSegments, 0, Math.PI*2, 0, Math.PI/2);   
        this.topMaterial = new THREE.MeshPhongMaterial({ color: colorTop, specular:colorTop, shininess:8, side: THREE.DoubleSide} );
        this.topMesh = new THREE.Mesh(this.top, this.topMaterial);
        this.topMesh.position.y = - height/2 - radiusTop;
        this.add(this.topMesh);

        this.light = new THREE.SphereGeometry(radiusLight, radialSegments, radialSegments, 0, Math.PI*2, Math.PI/2, Math.PI/2);   
        this.lightMaterial = new THREE.MeshPhongMaterial({ color: colorLight, specular:"#FFFFFF", shininess:5});
        this.lightMesh = new THREE.Mesh(this.light, this.lightMaterial);
        this.lightMesh.position.y = - height/2.5 - radiusTop/2 - radiusLight/3;
        this.add(this.lightMesh);

        this.spotLightLamp = new THREE.SpotLight( "#fcf7dc", 10, 4.5, Math.PI/4, 1, 0.2);
        this.spotLightLamp.position.y = -3;
        this.spotLightLamp.target = this.lightMesh;
        this.add(this.spotLightLamp);
        
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.camera.near = 0.1;
        spotLight.shadow.camera.far = 27;
        spotLight.position.y = this.lightMesh.position.y;
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
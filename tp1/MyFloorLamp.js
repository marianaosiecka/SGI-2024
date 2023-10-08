import * as THREE from 'three';

class MyFloorLamp extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, radius, topRadius, lightRadius, footHeight, armHeight, radialSegments, colorFoot, colorLamp, colorLight, lampHighlight) {
        super();
        this.app = app;
        this.type = 'Group';

        this.lampFoot = new THREE.ConeGeometry(radius, footHeight, radialSegments);         
        this.lampFootMaterial = new THREE.MeshPhongMaterial({ color: colorFoot, specular:"#777777", shininess: 5});
        this.lampFootesh = new THREE.Mesh(this.lampFoot, this.lampFootMaterial);
        this.lampFootesh.position.y = footHeight/2;
        this.add(this.lampFootesh);

        const armRadius = 0.04;
        this.lampArm1 = new THREE.CylinderGeometry(armRadius, armRadius, armHeight, radialSegments);         
        this.lampArm1Mesh = new THREE.Mesh(this.lampArm1, this.lampFootMaterial);
        this.lampArm1Mesh.position.y = armHeight/2 + footHeight;
        this.add(this.lampArm1Mesh);

        const armRotation = Math.PI/3;
        this.lampArm2 = new THREE.CylinderGeometry(armRadius, armRadius, armHeight/1.2, radialSegments);         
        this.lampArm2Mesh = new THREE.Mesh(this.lampArm2, this.lampFootMaterial);
        this.lampArm2Mesh.rotation.x = armRotation;
        this.lampArm2Mesh.position.z = footHeight*1.5;
        this.lampArm2Mesh.position.y = armHeight*2.9/3; + footHeight;
        this.add(this.lampArm2Mesh);

        this.lampArm3 = new THREE.CylinderGeometry(armRadius, armRadius, armHeight/10, radialSegments);         
        this.lampArm3Mesh = new THREE.Mesh(this.lampArm3, this.lampFootMaterial);
        this.lampArm3Mesh.rotation.x = Math.PI/7 + Math.PI/2;
        this.lampArm3Mesh.position.z = Math.cos(Math.PI/6) * (footHeight*1.5 + armHeight/2.4) + Math.sin(Math.PI/3) * armHeight/17;
        this.lampArm3Mesh.position.y = this.lampArm2Mesh.position.y + Math.sin(Math.PI/6) * (footHeight*1.5 + armHeight/2.4) - armHeight/13
        this.add(this.lampArm3Mesh);

        this.lampHead = new THREE.SphereGeometry(topRadius, radialSegments, radialSegments, 0, Math.PI*2, 0, Math.PI/2)
        this.lampHeadMaterial = new THREE.MeshPhongMaterial({ color: colorLamp, specular:"#777777", shininess:8, side: THREE.DoubleSide} );
        this.lampHeadMesh = new THREE.Mesh(this.lampHead, this.lampHeadMaterial);
        this.lampHeadMesh.rotation.x = -2*Math.PI/7
        this.lampHeadMesh.position.y = this.lampArm3Mesh.position.y - topRadius*1.5 + 0.12;
        this.lampHeadMesh.position.z = this.lampArm3Mesh.position.z + topRadius*1.5
        this.lampHeadMesh.scale.y = 1.5;
        this.add(this.lampHeadMesh);

        this.lampLight = new THREE.SphereGeometry(lightRadius, radialSegments, radialSegments, 0, Math.PI*2, Math.PI/2, Math.PI/2);   
        this.lampLightMaterial = new THREE.MeshPhongMaterial({ color: colorLight, specular:"#FFFFFF", shininess:5});
        this.lampLightMesh = new THREE.Mesh(this.lampLight, this.lampLightMaterial);
        this.lampLightMesh.rotation.x = -2*Math.PI/7
        this.lampLightMesh.position.y = this.lampHeadMesh.position.y - lightRadius/2 + 0.15;
        this.lampLightMesh.position.z = this.lampHeadMesh.position.z - lightRadius/3;
        this.add(this.lampLightMesh);
        
        lampHighlight.target = this.lampLightMesh;
    }

    getLightXPos() {
        return this.lampLightMesh.position.x;
    }

    getLightYPos() {
        return this.lampLightMesh.position.y;
    }

    getLightZPos() {
        return this.lampLightMesh.position.z;
    }

    changeColorWax(color) {
        this.waxMesh.material.color = new THREE.Color(color);
    }

    changeColorFlame(color) {
        this.flameMesh.material.color = new THREE.Color(color);
    }
}


MyFloorLamp.prototype.isGroup = true;
export { MyFloorLamp };
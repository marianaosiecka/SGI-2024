import * as THREE from 'three';

class MyFloorLamp extends THREE.Object3D {

    /**
     * Constructs the object.
     * @param {MyApp} app - The application object.
     * @param {number} radius - The radius of the lamp's foot.
     * @param {number} topRadius - The top radius of the lamp head.
     * @param {number} lightRadius - The radius of the light bulb.
     * @param {number} footHeight - The height of the lamp's foot.
     * @param {number} armHeight - The height of the lamp's arm.
     * @param {number} radialSegments - The number of radial segments for geometry.
     * @param {number} colorFoot - The color of the lamp foot material.
     * @param {number} colorLamp - The color of the lamp material.
     * @param {number} colorLight - The color of the light bulb material.
     * @param {Object3D} lampHighlight - The highlight object for the lamp.
     * @param {Light} lightFloorLamp - The light source for the floor lamp.
     */
    constructor(app, radius, topRadius, lightRadius, footHeight, armHeight, radialSegments, colorFoot, colorLamp, colorLight, lampHighlight, lightFloorLamp) {
        super();
        this.app = app;
        this.type = 'Group';

        //lamp foot
        this.lampFoot = new THREE.ConeGeometry(radius, footHeight, radialSegments);
        this.lampFootMaterial = new THREE.MeshPhongMaterial({ color: colorFoot, specular: "#777777", shininess: 5 });
        this.lampFootMesh = new THREE.Mesh(this.lampFoot, this.lampFootMaterial);
        this.lampFootMesh.position.y = footHeight / 2;
        this.add(this.lampFootMesh);

        //the lamp arm is composed of three segments
        const armRadius = 0.04;

        //this first segment is vertical
        this.lampArm1 = new THREE.CylinderGeometry(armRadius, armRadius, armHeight, radialSegments);
        this.lampArm1Mesh = new THREE.Mesh(this.lampArm1, this.lampFootMaterial);
        this.lampArm1Mesh.position.y = armHeight / 2 + footHeight;
        this.add(this.lampArm1Mesh);

        //this second segment is the crossed segment
        const armRotation = Math.PI / 3;
        this.lampArm2 = new THREE.CylinderGeometry(armRadius, armRadius, armHeight / 1.2, radialSegments);
        this.lampArm2Mesh = new THREE.Mesh(this.lampArm2, this.lampFootMaterial);
        this.lampArm2Mesh.rotation.x = armRotation;
        this.lampArm2Mesh.position.z = footHeight * 1.5;
        this.lampArm2Mesh.position.y = armHeight * 2.9 / 3; + footHeight;
        this.add(this.lampArm2Mesh);

        //this third segment makes the connection with the lamp's head
        this.lampArm3 = new THREE.CylinderGeometry(armRadius, armRadius, armHeight / 10, radialSegments);
        this.lampArm3Mesh = new THREE.Mesh(this.lampArm3, this.lampFootMaterial);
        this.lampArm3Mesh.rotation.x = Math.PI / 7 + Math.PI / 2;
        this.lampArm3Mesh.position.z = Math.cos(Math.PI / 6) * (footHeight * 1.5 + armHeight / 2.4) + Math.sin(Math.PI / 3) * armHeight / 17;
        this.lampArm3Mesh.position.y = this.lampArm2Mesh.position.y + Math.sin(Math.PI / 6) * (footHeight * 1.5 + armHeight / 2.4) - armHeight / 13
        this.add(this.lampArm3Mesh);

        //lamp head
        this.lampHead = new THREE.SphereGeometry(topRadius, radialSegments, radialSegments, 0, Math.PI * 2, 0, Math.PI / 2)
        this.lampHeadMaterial = new THREE.MeshPhongMaterial({ color: colorLamp, specular: "#777777", shininess: 8, side: THREE.DoubleSide });
        this.lampHeadMesh = new THREE.Mesh(this.lampHead, this.lampHeadMaterial);
        this.lampHeadMesh.rotation.x = -2 * Math.PI / 7
        this.lampHeadMesh.position.y = this.lampArm3Mesh.position.y - topRadius * 1.5 + 0.12;
        this.lampHeadMesh.position.z = this.lampArm3Mesh.position.z + topRadius * 1.5
        this.lampHeadMesh.scale.y = 1.5;
        this.add(this.lampHeadMesh);

        //light bulb
        this.lampLight = new THREE.SphereGeometry(lightRadius, radialSegments, radialSegments, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
        this.lampLightMaterial = new THREE.MeshPhongMaterial({ color: colorLight, specular: "#FFFFFF", shininess: 5 });
        this.lampLightMesh = new THREE.Mesh(this.lampLight, this.lampLightMaterial);
        this.lampLightMesh.rotation.x = -2 * Math.PI / 7
        this.lampLightMesh.position.y = this.lampHeadMesh.position.y - lightRadius / 2 + 0.15;
        this.lampLightMesh.position.z = this.lampHeadMesh.position.z - lightRadius / 3;
        this.add(this.lampLightMesh);

        //bulb highlight
        lampHighlight.target = this.lampLightMesh;
        this.add(lampHighlight);
        this.add(lightFloorLamp);
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
}


MyFloorLamp.prototype.isGroup = true;
export { MyFloorLamp };
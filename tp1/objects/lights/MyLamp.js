import * as THREE from 'three';

class MyLamp extends THREE.Object3D {

    /**
     * Constructs the object.
     * @param {MyApp} app - The application object.
     * @param {number} radiusCable - The radius of the lamp's cable.
     * @param {number} radiusHead - The radius of the lamp's head.
     * @param {number} radiusLight - The radius of the lamp's light.
     * @param {number} height - The height of the lamp.
     * @param {number} radialSegments - The number of radial segments for geometry.
     * @param {number} colorHead - The color of the lamp head material.
     * @param {number} colorLight - The color of the light bulb material.
     * @param {SpotLight} spotLight - The spot light source for the lamp.
     */
    constructor(app, radiusCable, radiusHead, radiusLight, height, radialSegments, colorHead, colorLight, spotLight) {
        super();
        this.app = app;
        this.type = 'Group';

        //cable hanging from the ceiling
        this.cable = new THREE.CylinderGeometry(radiusCable, radiusCable, height, radialSegments);
        this.cableMaterial = new THREE.MeshBasicMaterial({ color: colorHead });
        this.cableMesh = new THREE.Mesh(this.cable, this.cableMaterial);
        this.add(this.cableMesh);

        //lamp's head - it's a half empty sphere
        this.head = new THREE.SphereGeometry(radiusHead, radialSegments, radialSegments, 0, Math.PI * 2, 0, Math.PI / 2);
        this.headMaterial = new THREE.MeshPhongMaterial({ color: colorHead, specular: colorHead, shininess: 8, side: THREE.DoubleSide });
        this.headMesh = new THREE.Mesh(this.head, this.headMaterial);
        this.headMesh.position.y = - height / 2 - radiusHead;
        this.add(this.headMesh);

        //light bulb
        this.light = new THREE.SphereGeometry(radiusLight, radialSegments, radialSegments, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
        this.lightMaterial = new THREE.MeshPhongMaterial({ color: colorLight, specular: "#FFFFFF", shininess: 5 });
        this.lightMesh = new THREE.Mesh(this.light, this.lightMaterial);
        this.lightMesh.position.y = - height / 2.5 - radiusHead / 2 - radiusLight / 3;
        this.add(this.lightMesh);

        //light emitted by the bulb
        this.spotLightLamp = new THREE.SpotLight("#fcf7dc", 10, 3, Math.PI / 4, 1, 0.2);
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
}


MyLamp.prototype.isGroup = true;
export { MyLamp };
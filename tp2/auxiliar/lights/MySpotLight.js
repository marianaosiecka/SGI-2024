import * as THREE from 'three';

class MySpotLight {

    /**
     * Constructor for MySpotLight class.
     *
     * @param {Object} lightData - The light properties data.
     * @param {boolean} castShadow - Indicates whether the light must cast shadows.
    */
    constructor(lightData, castShadow) {
        let color = new THREE.Color(lightData.color.r, lightData.color.g, lightData.color.b);
        this.light = new THREE.SpotLight(color, lightData.intensity, lightData.distance, lightData.angle, lightData.penumbra, lightData.decay);
        this.light.position.set(lightData.position[0], lightData.position[1], lightData.position[2]);
        
        this.target = new THREE.Object3D();
        this.target.position.set(lightData.target[0], lightData.target[1], lightData.target[2])
        this.light.target = this.target
        
        if(castShadow){
            this.light.castShadow = true;
            this.light.shadow.mapSize.width = lightData.shadowmapsize;
            this.light.shadow.mapSize.height = lightData.shadowmapsize;
            this.light.shadow.camera.far = lightData.shadowfar;
        }
        
        if(!lightData.enabled)
            this.light.intensity = 0;
        this.enabled = lightData.enabled
        this.intensity = lightData.intensity
    }
}


export { MySpotLight };
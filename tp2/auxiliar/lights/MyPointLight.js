import * as THREE from 'three';


class MyPointLight {
    
    /**
     * Constructor for MyPointLight class.
     *
     * @param {Object} lightData - The light properties data.
     * @param {boolean} castShadow - Indicates whether the light must cast shadows.
    */
    constructor(lightData, castShadow) {
        let color = new THREE.Color(lightData.color.r, lightData.color.g, lightData.color.b);
        this.light = new THREE.PointLight(color, lightData.intensity, lightData.distance, lightData.decay);
        this.light.position.set(lightData.position[0], lightData.position[1], lightData.position[2]);
        if(castShadow){
            this.light.castShadow = true;
            this.light.shadow.mapSize.width = lightData.shadowmapsize;
            this.light.shadow.mapSize.height = lightData.shadowmapsize;
            this.light.camera.far = lightData.shadowfar;
        }
        if(!lightData.enabled)
            this.light.intensity = 0;
        this.enabled = lightData.enabled;
        this.intensity = lightData.intensity
        this.castShadow = castShadow;
    }
}


export { MyPointLight };
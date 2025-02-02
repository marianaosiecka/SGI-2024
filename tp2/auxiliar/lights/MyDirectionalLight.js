import * as THREE from 'three';


class MyDirectionalLight {

    /**
     * Constructor for MyDirectionalLight class.
     *
     * @param {Object} lightData - The light properties data.
     * @param {boolean} castShadow - Indicates whether the light must cast shadows.
    */
    constructor(lightData, castShadow) {
        let color = new THREE.Color(lightData.color.r, lightData.color.g, lightData.color.b);

        this.light = new THREE.DirectionalLight(color, lightData.intensity);
        this.light.position.set(lightData.position[0], lightData.position[1], lightData.position[2]);

        if(castShadow){
            this.light.castShadow = true;
            this.light.shadow.mapSize.width = lightData.shadowmapsize;
            this.light.shadow.mapSize.height = lightData.shadowmapsize;
            this.light.shadow.camera.far = lightData.shadowfar;
            this.light.camera.left = lightData.shadowleft;
            this.light.camera.right = lightData.shadowright;
            this.light.camera.top = lightData.shadowtop;
            this.light.camera.bottom = lightData.shadowbottom;
        }
        if(!lightData.enabled)
            this.light.intensity = 0;
        
        this.enabled = lightData.enabled;
        this.intensity = lightData.intensity;
        this.castShadow = castShadow;

    }
}


export { MyDirectionalLight };
import * as THREE from 'three';

class MySpotLight {
    constructor(node) {
        let color = new THREE.Color(node.color.r, node.color.g, node.color.b);
        this.light = new THREE.SpotLight(color, node.intensity, node.distance, node.angle, node.penumbra, node.decay);
        this.light.position.set(node.position[0], node.position[1], node.position[2]);
        
        //target can't be like this this.light.target.position.set(spotData.target[0], spotData.target[1], spotData.target[2]);
        this.target = new THREE.Object3D();
        this.target.position.set(node.target[0], node.target[1], node.target[2])
        this.light.target = this.target
        
        if(node.castshadow){
            this.light.castShadow = true;
            this.light.shadow.mapSize.width = node.shadowmapsize;
            this.light.shadow.mapSize.height = node.shadowmapsize;
           // this.light.camera.far = node.shadowfar;
        }
        
        if(!node.enabled)
            this.light.intensity = 0;
        this.enabled = node.enabled
    }
}


export { MySpotLight };
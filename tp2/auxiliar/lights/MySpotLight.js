import * as THREE from 'three';

class MySpotLight {

    /*
    this.descriptors["spotlight"] = [
			{name: "id", type: "string" },
			{name: "color", type: "rgba"},
			{name: "position", type: "vector3"}, 	
			{name: "target", type: "vector3"}, 		
			{name: "angle", type: "float"},
            {name: "enabled", type: "boolean", required: false, default: true},
			{name: "intensity", type: "float", required: false, default: 1.0},
			{name: "distance", type: "float", required: false, default: 1000},
			{name: "decay", type: "float", required: false, default: 2.0},
			{name: "penumbra", type: "float", required: false, default: 1.0},
			{name: "castshadow", type: "boolean", required: false, default: false},
            {name: "shadowfar", type: "float", required: false, default: 500.0},
            {name: "shadowmapsize", type: "integer", required: false, default: 512},
		]
    */
    constructor(spotData) {
        this.id = spotData.id;
        this.light = new THREE.PointLight(spotData.color, spotData.intensity, spotData.distance, spotData.angle, spotData.penumbra, spotData.decay);
        this.light.position.set(spotData.position[0], spotData.position[1], spotData.position[2]);
        //target can't be like this this.light.target.position.set(spotData.target[0], spotData.target[1], spotData.target[2]);
        if(spotData.castShadow){
            this.light.castShadow = true;
            this.light.shadow.mapSize.width = spotData.shadowmapsize;
            this.light.shadow.mapSize.height = spotData.shadowmapsize;
            this.light.camera.far = spotData.shadowfar;
        }
        if(spotData.enabled)
            this.light.intensity = 0;
    }
}


export { MySpotLight };
import * as THREE from 'three';

class MyPointLight {

    /*
    this.descriptors["pointlight"] = [
			{name: "id", type: "string" },
			{name: "color", type: "rgba"},
			{name: "position", type: "vector3"}, 
            {name: "enabled", type: "boolean", required: false, default: true},
			{name: "intensity", type: "float", required: false, default: 1.0},
			{name: "distance", type: "float", required: false, default: 1000},
			{name: "decay", type: "float", required: false, default: 2.0},
			{name: "castshadow", type: "boolean", required: false, default: false},
            {name: "shadowfar", type: "float", required: false, default: 500.0},
            {name: "shadowmapsize", type: "integer", required: false, default: 512},		
		]
    */
    constructor(pointData) {
        this.id = pointData.id;
        this.light = new THREE.PointLight(pointData.color, pointData.intensity, pointData.distance, pointData.decay);
        this.light.position = pointData.position;
        if(pointData.castShadow){
            this.light.castShadow = true;
            this.light.shadow.mapSize.width = pointData.shadowmapsize;
            this.light.shadow.mapSize.height = pointData.shadowmapsize;
            this.light.camera.far = pointData.shadowfar;
        }
        if(!pointData.enabled)
            this.light.intensity = 0;
    }
}


export { MyPointLight };
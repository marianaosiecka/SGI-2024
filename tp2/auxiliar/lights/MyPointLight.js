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
    constructor(node) {
        let color = new THREE.Color(node.color.r, node.color.g, node.color.b);
        this.light = new THREE.PointLight(color, node.intensity, node.distance, node.decay);
        this.light.position.set(node.position[0], node.position[1], node.position[2]);
        if(node.castShadow){
            this.light.castShadow = true;
            this.light.shadow.mapSize.width = node.shadowmapsize;
            this.light.shadow.mapSize.height = node.shadowmapsize;
            this.light.camera.far = node.shadowfar;
        }
        if(!node.enabled)
            this.light.intensity = 0;
    }
}


export { MyPointLight };
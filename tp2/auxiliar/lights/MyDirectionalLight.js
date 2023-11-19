import * as THREE from 'three';

class MyDirectionalLight {

    /*
    this.descriptors["directionallight"] = [
			{name: "id", type: "string" },
			{name: "color", type: "rgba"},
			{name: "position", type: "vector3"},
            {name: "enabled", type: "boolean", required: false, default: true},
			{name: "intensity", type: "float", required: false, default: 1.0},
			{name: "castshadow", type: "boolean", required: false, default: false},
            {name: "shadowleft", type: "float", required: false, default: -5.0},
            {name: "shadowright", type: "float", required: false, default: 5.0}, 
            {name: "shadowbottom", type: "float", required: false, default: -5.0},
            {name: "shadowtop", type: "float", required: false, default: 5.0}, 
            {name: "shadowfar", type: "float", required: false, default: 500.0},
            {name: "shadowmapsize", type: "integer", required: false, default: 512},
		]
    */
    constructor(node, castShadow) {
        let color = new THREE.Color(node.color.r, node.color.g, node.color.b);

        this.light = new THREE.DirectionalLight(color, node.intensity);
        this.light.position.set(node.position[0], node.position[1], node.position[2]);

        if(castShadow){
            this.light.castShadow = true;
            this.light.shadow.mapSize.width = node.shadowmapsize;
            this.light.shadow.mapSize.height = node.shadowmapsize;
            this.light.camera.far = node.shadowfar;
            this.light.camera.left = node.shadowleft;
            this.light.camera.right = node.shadowright;
            this.light.camera.top = node.shadowtop;
            this.light.camera.bottom = node.shadowbottom;
        }
        if(!node.enabled)
            this.light.intensity = 0;
        
        
        this.enabled = node.enabled;
        this.intensity = node.intensity

    }
}


export { MyDirectionalLight };
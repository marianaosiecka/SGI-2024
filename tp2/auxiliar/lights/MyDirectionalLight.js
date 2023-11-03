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
    constructor(directionalData) {
        this.id = directionalData.id;
        this.light = new THREE.DirectionalLight(directionalData.color, directionalData.intensity);
        this.light.position = directionalData.position;
        if(directionalData.castShadow){
            this.light.castShadow = true;
            this.light.shadow.mapSize.width = directionalData.shadowmapsize;
            this.light.shadow.mapSize.height = directionalData.shadowmapsize;
            this.light.camera.far = directionalData.shadowfar;
            this.light.camera.left = directionalData.shadowleft;
            this.light.camera.right = directionalData.shadowright;
            this.light.camera.top = directionalData.shadowtop;
            this.light.camera.bottom = directionalData.shadowbottom;
        }
        if(!directionalData.enabled)
            this.light.intensity = 0;
    }
}


export { MyDirectionalLight };
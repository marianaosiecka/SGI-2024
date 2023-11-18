import * as THREE from 'three';

/*this.descriptors["spotlight"] = [
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
class MySpotLight {
    constructor(node) {
        let color = new THREE.Color(node.color.r, node.color.g, node.color.b);
        this.light = new THREE.SpotLight(color, node.intensity, node.distance, node.angle, node.penumbra, node.decay);
        this.light.position.set(node.position[0], node.position[1], node.position[2]);
        
        this.target = new THREE.Object3D();
        this.target.position.set(node.target[0], node.target[1], node.target[2])
        this.light.target = this.target
        
        if(node.castshadow){
            this.light.castShadow = true;
            this.light.shadow.mapSize.width = node.shadowmapsize;
            this.light.shadow.mapSize.height = node.shadowmapsize;
            this.light.shadow.camera.far = node.shadowfar;
        }
        
        if(!node.enabled)
            this.light.intensity = 0;
    }
}


export { MySpotLight };
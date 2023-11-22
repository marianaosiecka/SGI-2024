import * as THREE from 'three';

class MySkybox extends THREE.Object3D{

    /**
     * Constructor for MySkybox class.
     *
     * @param {Object} skyboxData - The skybox properties data.
    */
    constructor(skyboxData) {
        super();

        // geometry
        let skyboxGeometry = new THREE.BoxGeometry(skyboxData.size[0], skyboxData.size[1], skyboxData.size[2])
    
        // textures
        const front = new THREE.TextureLoader().load(skyboxData.front);
        const back = new THREE.TextureLoader().load(skyboxData.back);
        const up = new THREE.TextureLoader().load(skyboxData.up);
        const down = new THREE.TextureLoader().load(skyboxData.down);
        const right = new THREE.TextureLoader().load(skyboxData.right);
        const left = new THREE.TextureLoader().load(skyboxData.left);
        
        // materials
        const skyboxMaterials = [new THREE.MeshBasicMaterial({map: front, side:THREE.BackSide}), 
                        new THREE.MeshBasicMaterial({map: back, side:THREE.BackSide}), 
                        new THREE.MeshBasicMaterial({map: up, side:THREE.BackSide}), 
                        new THREE.MeshBasicMaterial({map: down, side:THREE.BackSide}),
                        new THREE.MeshBasicMaterial({map: left, side:THREE.BackSide}),
                        new THREE.MeshBasicMaterial({map: right, side:THREE.BackSide})];

        // mesh
        this.skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
        this.skybox.position.set(skyboxData.center[0], skyboxData.center[1], skyboxData.center[2])
    }
}


export { MySkybox };
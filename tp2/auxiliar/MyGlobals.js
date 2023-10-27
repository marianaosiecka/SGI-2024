import * as THREE from 'three';

class MyScene {

    constructor(background, ambient) {
        this.scene = THREE.Scene();
        this.scene.background = new THREE.Color(background);
        this.scene.ambient = new THREE.Color(ambient);
    }

    setSceneFog(fogColor, fogNear, fogFar) {
        this.scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
    }
}


export { MyScene };
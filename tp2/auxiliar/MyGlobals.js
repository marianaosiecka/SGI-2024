import * as THREE from 'three';

class MyGlobals {

    constructor(globalsData) {
        console.log(globalsData.background)
        this.background = (globalsData.background);
        this.ambient = new THREE.AmbientLight(globalsData.ambient);
    }

    setSceneFog(fogData) {
        this.fog = new THREE.Fog(fogData.fogColor, fogData.fogNear, fogData.fogFar);
    }
}


export { MyGlobals };
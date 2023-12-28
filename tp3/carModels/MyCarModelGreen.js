import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

class MyCarModelGreen {

  constructor() {
    this.loadModel();
  }

    loadModel() {
        return new Promise((resolve) => {
        const loader = new FBXLoader();
        loader.load('carModels/files/car2.fbx', (fbx) => {
            fbx.scale.set(0.025, 0.025, 0.025);
            fbx.rotation.y = Math.PI / 2;
            fbx.position.y = -0.5;
            
            //removing platform that came with the model
            fbx.remove(fbx.children[2]);
            let fullCar = fbx.clone();
            
            //removing camera
            fbx.remove(fbx.children[1]);
            //removing extra elements
            fbx.remove(fbx.children[1]);

            //removing the wheels
            fbx.children[0].remove(fbx.children[0].children[0]);

            //changing colors
            fbx.children[0].children[1].children[1].children[0].material[0].color = new THREE.Color("#23401f");
            fbx.children[0].children[1].children[0].children[2].material.color = new THREE.Color("#546652");

            //setting attributes
            let car = fbx;
            let wheelsRatio = 1;
            let width = 5;
            let height = 3.5;
            let depth = 14;
            let rotation = 0;
            resolve([fullCar, car, rotation, wheelsRatio, width, height, depth]);
            });
        });
    }

}

export { MyCarModelGreen };
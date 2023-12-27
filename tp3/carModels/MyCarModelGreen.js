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
            //removing the wheels
            fbx.children[0].remove(fbx.children[0].children[0]);
            //removing camera
            fbx.remove(fbx.children[1]);
            //removing extra elements
            fbx.remove(fbx.children[1]);
            console.log(fbx.children[0].children[1].children[0].children[2]);

            //changing colors
            fbx.children[0].children[1].children[1].children[0].material[0].color = new THREE.Color("#23401f");
            fbx.children[0].children[1].children[0].children[2].material.color = new THREE.Color("#546652");

            //setting attributes
            this.car = fbx;
            this.wheelsRatio = 2;
            this.width = 4.5;
            this.height = 2;
            this.depth = 9;
            this.mesh = fbx.children[0].children[1].children[1].children[0];
            resolve([this.car, this.mesh, this.wheelsRatio, this.width, this.height, this.depth]);
            });
        });
    }

}

export { MyCarModelGreen };
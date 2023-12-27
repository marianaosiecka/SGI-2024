import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

class MyCarModelPurple {

  constructor() {
    this.loadModel();
  }

    loadModel() {
        return new Promise((resolve) => {
        const loader = new FBXLoader();
        loader.load('carModels/files/car1.fbx', (fbx) => {
            fbx.scale.set(0.04, 0.04, 0.04);
            fbx.rotation.y = Math.PI / 2 + Math.PI / 7;
            fbx.position.y = -1.2;
            
            //removing platform that came with the model
            fbx.remove(fbx.children[1]);
            //removing the wheels
            fbx.children[1].remove(fbx.children[1].children[5]);
            fbx.children[1].remove(fbx.children[1].children[5]);
            //removing camera
            fbx.remove(fbx.children[0]);
            
            //changing colors
            fbx.children[0].children[3].material[0].color = new THREE.Color("#695f75");
            fbx.children[0].children[3].material[1].color = new THREE.Color("#363534");
            fbx.children[0].children[3].material[2].color = new THREE.Color("#9ed5ff");

            //setting attributes
            this.car = fbx;
            this.wheelsRatio = 2.3;
            this.width = 5;
            this.height = 1.8;
            this.depth = 7;
            this.mesh = fbx.children[0].children[3];
            resolve([this.car, this.mesh, this.wheelsRatio, this.width, this.height, this.depth]);
          });
        });
    }

}

export { MyCarModelPurple };
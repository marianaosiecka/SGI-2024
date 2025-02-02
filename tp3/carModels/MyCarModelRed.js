import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

class MyCarModelRed {

  constructor() {
    this.properties = null;
    this.loadModel();
  }

    /**
     * loads the car model and returns its properties 
     * @returns {Promise} Promise object that loads the model
     */
    loadModel() {
      return new Promise((resolve) => {
        const loader = new FBXLoader();
        loader.load('carModels/files/car1.fbx', (fbx) => {
          fbx.scale.set(0.04, 0.04, 0.04);
          fbx.rotation.y = Math.PI / 2 + Math.PI / 7.5;
          fbx.position.y = -1.9;
          
          //removing platform that came with the model
          fbx.remove(fbx.children[1]);
          let fullCar = fbx.clone();

          //removing the wheels
          fbx.children[1].remove(fbx.children[1].children[5]);
          fbx.children[1].remove(fbx.children[1].children[5]);
          //removing camera
          fbx.remove(fbx.children[0]);
          
          //setting attributes
          let car = fbx;
          let wheelsRatio = 1.2;
          let width = 4;
          let height = 4.5;
          let depth = 10;
          let rotation = Math.PI / 7.5;
          resolve([fullCar, car, rotation, wheelsRatio, width, height, depth]);
        });
      });
    }

}

export { MyCarModelRed };
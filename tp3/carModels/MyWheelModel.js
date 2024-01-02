import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class MyWheelModel {

  constructor() {
    this.loadModel();
  }

    loadModel() {
        return new Promise((resolve) => {
        const loader = new GLTFLoader();
        loader.load('carModels/files/Wheel.glb', (glb) => {
            glb.scene.scale.set(2, 2, 2)
            resolve(glb.scene);
            });
        });
    }

}

export { MyWheelModel };
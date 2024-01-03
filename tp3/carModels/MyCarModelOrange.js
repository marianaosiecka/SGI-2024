import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

class MyCarModelOrange {

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
            loader.load('carModels/files/car2.fbx', (fbx) => {
                fbx.scale.set(0.025, 0.025, 0.025);
                fbx.rotation.y = Math.PI / 2;
                fbx.position.y = -0.5;
                
                //removing platform that came with the model
                fbx.remove(fbx.children[2]);
                //removing camera
                fbx.remove(fbx.children[1]);
                //removing extra elements
                fbx.remove(fbx.children[1]);
                let fullCar = fbx.clone();

                //removing the wheels
                fbx.children[0].remove(fbx.children[0].children[0]);
                
                //setting attributes
                let car = fbx;
                let wheelsRatio = 1;
                let width = 4;
                let height = 5;
                let depth = 14;
                let rotation = 0;
                resolve([fullCar, car, rotation, wheelsRatio, width, height, depth]);
            });
        });
    }

}

export { MyCarModelOrange };
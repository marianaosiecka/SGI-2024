import * as THREE from 'three';
import { MyNurbsBuilder } from '../../MyNurbsBuilder.js';

class MyNewspaper extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {Texture} texture The texture to be applied to the newspaper pages
    */ 
    constructor(app, texture) {
        super();
        this.type = 'Group';
        this.app = app;

        this.material = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
        this.builder = new MyNurbsBuilder(this.app);

        this.samplesU = 12;     
        this.samplesV = 12;
        this.orderU = 1;
        this.orderV = 2;

        const numberPages = 4;
        let maxPageY = 0.25;
    
        for (let i=0; i<numberPages; i++){
            let controlPoints = [
                // U = 0
                [
                    [-0.4, maxPageY - 0.015*i, 1, 1],
                    [-0.4, 0, 0, 1],
                    [-0.4, 0.015*i, 1, 1]
                ],
                // U = 1
                [
                    [0.4, maxPageY - 0.015*i, 1, 1],
                    [0.4, 0, 0, 1],
                    [0.4, 0.015*i, 1, 1]
                ]
            ];

            let surfaceData = this.builder.build(controlPoints, this.orderU, this.orderV, this.samplesU, this.samplesV)  
            let page = new THREE.Mesh(surfaceData, this.material);
            page.castShadow = true
            page.receiveShadow = true
            this.add(page);
        }
    
  }
}

MyNewspaper.prototype.isGroup = true;
export { MyNewspaper };

/*<!-- TEXTURES BLOCK -->  
    <!-- this block must exist but may be empty if no  -->  
    <!-- textures are to be used -->
    <textures>  
        <!-- there can be zero or more such lines: -->
        <texture id="ss" filepath="ss" />
    </textures>
*/

import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains a 3D axis representation
 */
class MyTexture extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';
        
    }
}

MyTexture.prototype.isGroup = true;

export { MyTexture };
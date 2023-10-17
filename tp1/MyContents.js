import * as THREE from 'three';

import { MyAxis } from './MyAxis.js';


class MyContents  {

    constructor(app) {
        this.app = app
        this.axis = null
    }

    init() {
        // create once
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // variables to hold the curves
        this.polyline = null

        // number of samples to use for the curves (not for polyline)
        this.numberOfSamples = 6

        // hull material and geometry
        this.hullMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, opacity: 0.50, transparent: true} );
       

        // curve recomputation
        this.recompute();
    }

    // Deletes the contents of the line if it exists and recreates them
    recompute() {
        if (this.polyline !== null) this.app.scene.remove(this.polyline)
        this.initPolyline()
    }

    /*
    drawHull(position, points) {

        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        let line = new THREE.Line( geometry, this.hullMaterial );
        // set initial position
        line.position.set(position.x,position.y,position.z)
        this.app.scene.add( line );

    }
    */


    initPolyline() {

        // define vertex points
        let points = [
            new THREE.Vector3( -0.6, -0.6, 0.0 ),
            new THREE.Vector3(  0.6, -0.6, 0.0 ),
            new THREE.Vector3(  0.6,  0.6, 0.0 ),
            new THREE.Vector3( -0.6,  0.6, 0.0 )
        ]

        let position = new THREE.Vector3(0,0,0)
        // this.drawHull(position, points);

        // define geometry
        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        // create the line from material and geometry
        this.polyline = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xff0000 } ) );

        // set initial position
        this.polyline.position.set(position.x,position.y,position.z)

        // add the line to the scene
        this.app.scene.add( this.polyline );
    }


    /**
     * updates the contents
     * this method is called from the render method of the app
     *
     */
    update() {    
    }
}

export { MyContents };
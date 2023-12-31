import * as THREE from 'three'

class MyFirework {

    constructor(app, launchPosition) {
        this.app = app;
        this.launchPosition = launchPosition;

        this.done = false;
        this.dest = [];
        
        this.vertices = null;
        this.colors = null;
        this.geometry = null;
        this.points = null;
        
        this.material = new THREE.PointsMaterial({
            size: 1,
            color: 0xffffff,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        });
        
        this.height = 30;
        this.speed = 20;

        this.launch();

    }

    /**
     * compute particle launch
     */

    launch() {
        const color = new THREE.Color();
        color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), 1, 0.5);
        let colors = [ color.r, color.g, color.b ];

        // destination
        let x = this.launchPosition.x + THREE.MathUtils.randFloat(-20, 20);
        let y = this.launchPosition.y + THREE.MathUtils.randFloat(this.height * 1.2, this.height * 1.8);
        let z = this.launchPosition.z + THREE.MathUtils.randFloat(-20, 20);

        this.dest.push( x, y, z );
        let vertices = [this.launchPosition.x, this.launchPosition.y, this.launchPosition.z];
        let velocities = [this.speed, this.speed, this.speed];
        
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(vertices), 3 ) );
        this.geometry.setAttribute( 'velocity', new THREE.BufferAttribute( new Float32Array(velocities), 3 ) );
        this.geometry.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array(colors), 3 ) );
        this.points = new THREE.Points( this.geometry, this.material );
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.app.scene.add(this.points);  
        console.log("firework launched");
    }

    /**
     * compute explosion
     * @param {*} vector 
     */
    explode(origin, n, rangeBegin, rangeEnd) {
        this.app.scene.remove(this.points);
        this.dest = []; 
        this.colors = []; 
        this.geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const velocities = [];

        for (let i = 0; i < n; i++) {
            const color = new THREE.Color();
            color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), 1, 0.5);
            colors.push(color.r, color.g, color.b);
            this.colors.push(color);

            const from = new THREE.Vector3(
                THREE.MathUtils.randInt(origin[0] - rangeBegin, origin[0] + rangeBegin),
                THREE.MathUtils.randInt(origin[1] - rangeBegin, origin[1] + rangeBegin),
                THREE.MathUtils.randInt(origin[2] - rangeBegin, origin[2] + rangeBegin)
            );
            positions.push(from.x, from.y, from.z);

            const to = new THREE.Vector3(
                THREE.MathUtils.randInt(origin[0] - rangeEnd, origin[0] + rangeEnd),
                THREE.MathUtils.randInt(origin[1] - rangeEnd, origin[1] + rangeEnd),
                THREE.MathUtils.randInt(origin[2] - rangeEnd, origin[2] + rangeEnd)
            );
            this.dest.push(to.x, to.y, to.z);

            const velocity = new THREE.Vector3(
                THREE.MathUtils.randFloat(0.1, 0.5),
                THREE.MathUtils.randFloat(0.1, 0.5),
                THREE.MathUtils.randFloat(0.1, 0.5)
            );
            velocities.push(velocity.x, velocity.y, velocity.z);
        }

        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        this.geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

        this.material.opacity = 1; // Reset opacity for the explosion particles
        this.points = new THREE.Points(this.geometry, this.material);
        this.app.scene.add(this.points);
    }
    
    /**
     * cleanup
     */
    reset() {
        console.log("firework reseted");
        this.app.scene.remove( this.points );  
        this.dest = [];
        this.vertices = null;
        this.colors = null;
        this.geometry = null;
        this.points = null;
    }

    updateParticlesPosition(vertices, velocities, delta) {
        const gravity = 9.8; 
        
        for (let i = 0; i < vertices.length; i += 3) {
            // Calculate lerp for each dimension
            const lerpX = (this.dest[i] - vertices[i]) / velocities[i];
            const lerpY = (this.dest[i + 1] - vertices[i + 1]) / velocities[i + 1];
            const lerpZ = (this.dest[i + 2] - vertices[i + 2]) / velocities[i + 2];

           
            // Update particle positions with lerp and gravity
            vertices[i] += lerpX;
            vertices[i + 1] += lerpY;
            vertices[i + 2] += lerpZ;

            velocities[i + 1] -= gravity * delta;
            //console.log(velocities[i + 1]);
            // Update velocity based on gravity

            // Apply damping to simulate air resistance
            /*
            vertices[i] *= damping;
            vertices[i + 1] *= damping;
            vertices[i + 2] *= damping;*/
        }
    }

    /**
     * update firework
     * @returns 
     */
    update(delta) {
        // do only if objects exist
        if( this.points && this.geometry ){
            let verticesAtribute = this.geometry.getAttribute( 'position' );
            let velocitiesAtribute = this.geometry.getAttribute( 'velocity' );
            let vertices = verticesAtribute.array;
            let velocities = [this.speed, this.speed, this.speed];
            
            if(velocitiesAtribute)
                velocities = velocitiesAtribute.array;
            let count = verticesAtribute.count;

            this.updateParticlesPosition(vertices, velocities, delta);
            /*for( let i = 0; i < vertices.length; i+=3 ) {
                vertices[i  ] += ( this.dest[i  ] - vertices[i  ] ) / this.speed
                vertices[i+1] += ( this.dest[i+1] - vertices[i+1] ) / this.speed
                vertices[i+2] += ( this.dest[i+2] - vertices[i+2] ) / this.speed

                vertices[i+1] -= 0.002;
            }*/
            // Update particle attribute
            verticesAtribute.needsUpdate = true;
            if(velocitiesAtribute)
                velocitiesAtribute.needsUpdate = true;

            
            // only one particle?
            if( count === 1 ) {
                //is YY coordinate higher close to destination YY? 
                if( Math.ceil( vertices[1] ) > ( this.dest[1] * 0.95 ) ) {
                    // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                    this.explode(vertices, 80, 10, 1000);
                    return;
                }
            }
            
            // are there a lot of particles (aka already exploded)?
            if( count > 1 ) {
                // fade out exploded particles 
                //this.material.opacity -= 0.0015;
                //this.material.needsUpdate = true;
            }
            
            // remove, reset and stop animating 
            if( this.material.opacity <= 0 ) {
                //this.reset();
                //this.done = true;
                //return;
            }
            if(this.done || this.material.opacity <= 0){
                console.log("firework done");
            }
        }
    }
}

export { MyFirework }
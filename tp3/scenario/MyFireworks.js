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
        this.velocities = [];

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

        this.exploded = false;

        this.launch();
    }

    /**
     * compute particle launch
     */

    launch() {
        const color = new THREE.Color();
        color.setHSL(
            THREE.MathUtils.randFloat(0.1, 0.9),
            1,
            0.5
        );
        let colors = [color.r, color.g, color.b];

        // destination
        let x = this.launchPosition.x + THREE.MathUtils.randFloat(-20, 20);
        let y = this.launchPosition.y + THREE.MathUtils.randFloat(this.height * 1.2, this.height * 1.8);
        let z = this.launchPosition.z + THREE.MathUtils.randFloat(-20, 20);

        this.dest.push(x, y, z);
        let vertices = [this.launchPosition.x, this.launchPosition.y, this.launchPosition.z];

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

        this.points = new THREE.Points(this.geometry, this.material);
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.app.scene.add(this.points);
        //console.log("firework launched");
    }

    /**
     * compute explosion
     * @param {*} vector 
     */
    explode(origin, n, rangeBegin, rangeEnd) {
        this.app.scene.remove(this.points);
        const colors = [];
        const vertices = [];

        for (let i = 0; i < n; i++) {
            const color = new THREE.Color();
            color.setHSL(
                THREE.MathUtils.randFloat(0.1, 0.9), 
                THREE.MathUtils.randFloat(0.7, 1),
                THREE.MathUtils.randFloat(0.4, 0.7));
            colors.push(color.r, color.g, color.b);

            vertices.push(origin[0], origin[1], origin[2]);

            let velocity = new THREE.Vector3(
                THREE.MathUtils.randFloat(-100, 100),
                THREE.MathUtils.randFloat(-100, 100),
                THREE.MathUtils.randFloat(-100, 100 )
            );
            this.velocities.push(velocity);
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        //this.geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

        this.points = new THREE.Points(this.geometry, this.material);
        this.points.castShadow = true;
        this.points.receiveShadow = true;
        this.app.scene.add(this.points);
        this.exploded = true;
    }

    /**
     * cleanup
     */
    reset() {
        //console.log("firework reseted");
        this.app.scene.remove(this.points);
        this.dest = [];
        this.vertices = null;
        this.colors = null;
        this.geometry = null;
        this.points = null;
        this.exploded = false;
    }

    updateParticlesPosition(delta) {
        if (this.points.material.opacity > 0) {
            let vertices = this.points.geometry.getAttribute('position');

            for (let i = 0; i < vertices.count; i++) {
                let velocity = this.velocities[i];
                vertices.setXYZ(
                    i,
                    vertices.getX(i) + velocity.x * delta,
                    vertices.getY(i) + velocity.y * delta,
                    vertices.getZ(i) + velocity.z * delta
                );
                velocity.y -= 100 * delta;
            }
            vertices.needsUpdate = true;
            this.points.material.opacity -= 0.004;
            this.points.material.needsUpdate = true;
        }
        else {
            this.reset();
        }
    }

    /**
     * update firework
     * @returns 
     */
    update(delta) {
        // do only if objects exist
        if (!this.exploded) {
            if (this.points && this.geometry) {
                let verticesAtribute = this.geometry.getAttribute('position');
                let vertices = verticesAtribute.array;

                let velocitiesAtribute = this.geometry.getAttribute('velocity');
                let velocities = [this.speed, this.speed, this.speed];
                if (velocitiesAtribute)
                    velocities = velocitiesAtribute.array;

                let count = verticesAtribute.count;

                for (let i = 0; i < vertices.length; i += 3) {
                    vertices[i] += (this.dest[i] - vertices[i]) / this.speed
                    vertices[i + 1] += (this.dest[i + 1] - vertices[i + 1]) / this.speed
                    vertices[i + 2] += (this.dest[i + 2] - vertices[i + 2]) / this.speed

                    vertices[i + 1] -= 0.002;
                }
                // Update particle attribute
                verticesAtribute.needsUpdate = true;

                // only one particle?
                if (count === 1) {
                    //is YY coordinate higher close to destination YY? 
                    if (Math.ceil(vertices[1]) > (this.dest[1] * 0.95)) {
                        // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                        this.explode(vertices, 80, 10, 1000);
                        return;
                    }
                }

                // are there a lot of particles (aka already exploded)?
                if (count > 1) {
                    // fade out exploded particles 
                    this.material.opacity -= 0.0015;
                    this.material.needsUpdate = true;
                }

                // remove, reset and stop animating 
                if (this.material.opacity <= 0) {
                    this.reset();
                    this.done = true;
                    return;
                }
                if (this.done || this.material.opacity <= 0) {
                    //console.log("firework done");
                }
            }
        }
        else {
            this.updateParticlesPosition(delta);
        }
    }
}

export { MyFirework }
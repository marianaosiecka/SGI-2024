import * as THREE from 'three';

class MyObstacle extends THREE.Object3D {
    /**
     * constructor for MyObstacle class
     * @param app application
     * @param type obstacle type: slip or switch
     * @param texture texture of the obstacle
     * @param rotate angle of rotation
     * @param layer layer that the obstacle belongs to
     */
    constructor(app, type, texture, rotate, layer) {
        super();
        this.app = app;
        this.type = type;
        this.texture = texture;
        this.rotate = rotate;
        this.layer = layer;

        let geometry = new THREE.PlaneGeometry(6, 6);
        
        //vertex shader
        const vertexShader = `
            varying vec2 vUv;
            uniform float time;

            void main() {
                vUv = uv;

                float scaleFactor = 1.0 + 0.15 * sin(4.0*time);
                vec3 newPosition = position * scaleFactor;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
            }`;

        // fragment shader 
        const fragmentShader = `
            varying vec2 vUv;        
            uniform sampler2D text;
            
            void main() {
                vec4 color = texture2D(text, vUv);
                gl_FragColor = vec4(color.rgb, color.a);
            }`
        ;

        const uniforms = {
            time: { value: 1 },
            text: { value: this.texture },
        };

        this.shader = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(geometry, this.shader);
        this.mesh.rotation.x = rotate;
        
        if (rotate !== Math.PI/2){
            this.mesh.position.set(0, 2, 0);
            this.mesh.rotation.y = Math.PI/2;
        }
        else{
            this.mesh.rotation.y =- Math.PI;
            this.mesh.position.set(0, -1, 0);
            this.mesh.scale.set(1.8, 1.8, 1.8);
        }


        this.add(this.mesh);
    }


    /**
     * sets the bounding box of the obstacle
     */
    setBoundingBox() {
        this.bb = new THREE.Box3().setFromObject(this);
    }

    /**
     * applies the modifier to the player vehicle
     * @param playerVehicle 
     */
    applyModifier(playerVehicle) {
        if(this.type == "slip"){
            playerVehicle.slipping = true;
        }
    }

    /**
     * stops the effect of the modifeir
     * @param playerVehicle 
     */
    stopModifier(playerVehicle) {
        if(this.type == "slip"){
            playerVehicle.slipping = false;
        }
    }

}

MyObstacle.prototype.isGroup = true;
export { MyObstacle };
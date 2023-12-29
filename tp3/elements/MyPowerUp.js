import * as THREE from 'three';

class MyPowerUp extends THREE.Object3D {
    
    constructor(app, type, texture) {
        super();
        this.app = app;
        this.type = type;
        this.texture = texture;
        this.mesh = null;
        
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
            }`

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

        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.mesh = new THREE.Mesh(geometry, this.shaderMaterial);
        this.mesh.position.set(0, 2.2, 0);
        this.mesh.rotation.y = Math.PI/2;
        this.add(this.mesh);
        
    }

    setBoundingBox() {
        this.bb = new THREE.Box3().setFromObject(this);
    }

    setDestinationPoint(destinationPoint) {
        this.animationDestPosition = destinationPoint;
    }

    applyModifier(playerVehicle){
        if(this.type == "shield"){
            playerVehicle.shield = true;
        }
        else if(this.type == "speed"){
            if (playerVehicle.velocity + 1.5*playerVehicle.velocity < playerVehicle.maxVelocity){
                playerVehicle.velocity *= 1.5;
                playerVehicle.speeding = true;  
            }  
        }
    }

    stopModifier(playerVehicle){
        if(this.type == "shield"){
            playerVehicle.shield = false;
        }
        else if (this.type == "speed"){
            if(playerVehicle.speeding){
                playerVehicle.velocity /= 1.5;
                playerVehicle.speeding = false;
            }
        }
    }

}

MyPowerUp.prototype.isGroup = true;
export { MyPowerUp };
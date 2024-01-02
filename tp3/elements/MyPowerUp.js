import * as THREE from 'three';
import { MyObstacle } from './MyObstacle.js';
import { MyScenario } from '../scenario/MyScenario.js';
import { MyShader } from '../MyShader.js';

class MyPowerUp extends THREE.Object3D {
    
    constructor(app, type, texture, rotate) {
        super();
        this.app = app;
        this.type = type;
        this.texture = texture;
        this.rotate = rotate;
        this.mesh = null;
        this.pointer = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 0.1;
        this.raycaster.far = 100;
        
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
        this.mesh.position.set(0, 2.5, 0);
        this.mesh.rotation.y = this.rotate;
        this.add(this.mesh);    
    }

    setBoundingBox() {
        this.bb = new THREE.Box3().setFromObject(this);
    }

    setDestinationPoint(destinationPoint) {
        this.animationDestPosition = destinationPoint;
    }

    applyModifier(playerVehicle, obstacles, track){
        console.log("applyModifier")
        if(this.type == "shield"){
            playerVehicle.shield = true;
        }
        else if(this.type == "speed"){
            if(!playerVehicle.speeding){
                playerVehicle.maxVelocity *= 2;
                playerVehicle.speeding = true;  
            }
        } 
        else if(this.type == "pick"){
            this.app.contents.paused = true;
            this.app.smoothCameraTransition("ObstaclePerspective", 6000);
            this.app.contents.selectedLayer = this.app.contents.availableLayers[2];
            this.app.contents.updateSelectedLayer();
            this.app.contents.scenario.setPickableObstacles();
        } 
    }

    stopModifier(playerVehicle) {
        if(this.type == "shield"){
            playerVehicle.shield = false;
        }
        else if (this.type == "speed"){
            if(playerVehicle.speeding){
                playerVehicle.maxVelocity /= 2;
                if(playerVehicle.velocity > playerVehicle.maxVelocity){
                    playerVehicle.velocity = playerVehicle.maxVelocity;
                }
                playerVehicle.speeding = false;
            }
        }

    }

}

MyPowerUp.prototype.isGroup = true;
export { MyPowerUp };
import * as THREE from 'three';

class MyCloud extends THREE.Object3D{
    constructor(app, position) {
        super();
        this.app = app;
        this.cameraPosition = this.app.activeCamera.position;
        
        let textureLoader = new THREE.TextureLoader();
        let texture = textureLoader.load('textures/cloud.png');

        let fog = new THREE.Fog( 0x4584b4, - 100, 3000 );   

        const vertexShader = `
            varying vec2 vUv;

            void main() {

            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

            }`;

        const fragmentShader = `
            uniform sampler2D map;

            uniform vec3 fogColor;
            uniform float fogNear;
            uniform float fogFar;
        
            varying vec2 vUv;
        
            void main() {
        
            float depth = gl_FragCoord.z / gl_FragCoord.w;
            float fogFactor = smoothstep( fogNear, fogFar, depth );
        
            gl_FragColor = texture2D( map, vUv );
            gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 );
            gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );
        
            }`;

        this.material = new THREE.ShaderMaterial( {
            uniforms: {
                "map": { value: texture },
                "fogColor" : { type: "c", value: fog.color },
                "fogNear" : { type: "f", value: fog.near },
                "fogFar" : { type: "f", value: fog.far },

            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            depthWrite: false,
            transparent: true,
            side: THREE.DoubleSide,

        } );


        this.cloud = new THREE.Mesh(new THREE.PlaneGeometry(64, 64), this.material);
        this.cloud.position.set(position.x, position.y - 100, position.z);
        this.cloud.scale.x = 0.15;
        this.cloud.scale.y = 0.15;
        this.cloud.lookAt(this.cameraPosition);
        this.app.scene.add(this.cloud);
    }

    update(position) {
        this.cloud.position.set(position.x, position.y - 2, position.z);
        this.cloud.lookAt(this.cameraPosition);
    }
}

export { MyCloud }
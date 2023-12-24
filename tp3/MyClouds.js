import * as THREE from 'three';

class MyClouds extends THREE.Object3D{
    constructor(app) {
        super()
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

        this.clouds_list = []

        for ( var i = -500; i < 500; i += 1 ) {
            let cloud = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ), this.material );
            cloud.position.x =  Math.random() * 1000 - 500; // between -500 and 500
            cloud.position.y = - Math.random() * Math.random() * 100 - 50; // between -50 and -100
            cloud.position.z = i; // between -500 and 500
            cloud.rotation.z = Math.random() * Math.PI;
            cloud.scale.x = cloud.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

            cloud.lookAt(this.cameraPosition);

            let cloud_clone = cloud.clone();
            cloud_clone.position.y -= 100;
            cloud_clone.lookAt(this.cameraPosition);

            this.clouds_list.push(cloud);
            this.clouds_list.push(cloud_clone);
            this.add(cloud);
            this.add(cloud_clone);
        }
    }


    update() {
        this.clouds_list.forEach(cloud => {
            const lookAtDirection = new THREE.Vector3();
            lookAtDirection.subVectors(this.app.controls.target, this.app.activeCamera.position).normalize();
        
            const upVector = this.app.activeCamera.up.clone();
            const rotationMatrix = new THREE.Matrix4();
            rotationMatrix.lookAt(new THREE.Vector3(), lookAtDirection, upVector);
        
            cloud.rotation.setFromRotationMatrix(rotationMatrix);
        });
    }

}

export { MyClouds }
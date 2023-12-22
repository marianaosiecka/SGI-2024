
import * as THREE from 'three';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';

class MyScenario {
    constructor(app) {
        this.app = app;

        this.sky = null;
        this.cloud = null;

        this.init();
    }

    init() {
        
        // Sky
        const canvas = document.createElement( 'canvas' );
        canvas.width = 1;
        canvas.height = 100;

        const context = canvas.getContext( '2d' );
        const gradient = context.createLinearGradient( 0, 0, 0, 100 );
        gradient.addColorStop( 0.0, '#014a84' );
        gradient.addColorStop( 0.5, '#0561a0' );
        gradient.addColorStop( 1.0, '#437ab6' );
        context.fillStyle = gradient;
        context.fillRect( 0, 0, 1, 100 );

        const skyMap = new THREE.CanvasTexture( canvas );
        skyMap.colorSpace = THREE.SRGBColorSpace;

        this.sky = new THREE.Mesh(
            new THREE.SphereGeometry( 500 ),
            new THREE.MeshBasicMaterial( { map: skyMap, side: THREE.BackSide } )
        );
        this.app.scene.add( this.sky );
        

        // clouds

        var material;

        var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load('textures/cloud.png');
        
        var fog = new THREE.Fog( 0x4584b4, - 100, 3000 );        

        material = new THREE.ShaderMaterial( {
            uniforms: {
                "map": { value: texture },
                "fogColor" : { type: "c", value: fog.color },
                "fogNear" : { type: "f", value: fog.near },
                "fogFar" : { type: "f", value: fog.far },

            },
            vertexShader: document.getElementById( 'vs' ).textContent,
            fragmentShader: document.getElementById( 'fs' ).textContent,
            depthWrite: false,
            transparent: true,
            side: THREE.DoubleSide,

        } );


        
        for ( var i = -400; i < 400; i += 0.5 ) {
            let cloud = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ), material );
            let cloud2 = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ), material );

            cloud.position.x = cloud2.position.x =  Math.random() * 800 - 400; 
            cloud.position.y = cloud2.position.y = - Math.random() * 200 - 200;
            cloud.position.z = cloud2.position.z = i; 
            cloud.rotation.z = cloud2.rotation.z = Math.random() * Math.PI;
            cloud.scale.x = cloud2.scale.x = cloud.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

            cloud2.rotation.x = Math.PI / 2;
            this.app.scene.add(cloud);

            // create a cloud2 equal to cloud
            //this.app.scene.add(cloud2);

        }



       
    }
}

export { MyScenario}
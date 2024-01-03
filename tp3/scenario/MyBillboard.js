import * as THREE from 'three';

class MyBillboard extends THREE.Object3D {
    constructor(app) {
        super()
        this.app = app;

        this.billboardWidth = window.innerWidth * 0.05;
        this.billboardHeight = window.innerHeight * 0.05;

        this.metalMaterial = new THREE.MeshStandardMaterial({ color: 0x8f8f8f, emissive: 0x414141, roughness: 0.8, metalness: 1 });

        // cylinder
        const cylinderGeometry = new THREE.CylinderGeometry(3, 3, 420, 32);
        const cylinder = new THREE.Mesh(cylinderGeometry, this.metalMaterial);
        this.add(cylinder);

        // cone
        const coneGeometry = new THREE.ConeGeometry(15, 8, 32);
        coneGeometry.openEnded = true;
        const cone = new THREE.Mesh(coneGeometry, this.metalMaterial);
        cone.scale.set(0.3, 1, 1);
        cone.position.y = 207;
        cone.rotation.x = Math.PI;
        this.add(cone);

        // panel front box
        const boxGeometry1 = new THREE.BoxGeometry(this.billboardWidth, this.billboardHeight, 2);
        const boxMaterial1 = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const box1 = new THREE.Mesh(boxGeometry1, boxMaterial1);
        box1.position.y = 231.5;
        box1.position.x = 3
        box1.rotation.y = Math.PI / 2;
        this.add(box1);

        // panel back box
        const boxGeometry2 = new THREE.BoxGeometry(this.billboardWidth, this.billboardHeight, 3);
        const boxMaterial2 = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const box2 = new THREE.Mesh(boxGeometry2, boxMaterial2);
        box2.position.y = 231.5;
        box2.position.x = -2
        box2.rotation.y = Math.PI / 2;
        this.add(box2);

        // panel for the image
        const planeGeometry = new THREE.PlaneGeometry(this.billboardWidth, this.billboardHeight, 100, 100);
        const planeMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/blank.png') });
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.plane.position.y = 231.5;
        this.plane.position.x = 4.1
        this.plane.rotation.y = Math.PI / 2;
        this.add(this.plane);

        // connection between boxes
        const cylinderConnectionGeometry = new THREE.CylinderGeometry(0.7, 0.7, 4, 32);
        const cylinderConnection = new THREE.Mesh(cylinderConnectionGeometry, this.metalMaterial);
        cylinderConnection.position.y = this.billboardHeight / 2 + 231.5 - 2;
        cylinderConnection.position.x = 0.5;
        cylinderConnection.position.z = this.billboardWidth / 2 - 2;
        cylinderConnection.rotation.z = Math.PI / 2;
        this.add(cylinderConnection);

        const cylinderConnection2 = new THREE.Mesh(cylinderConnectionGeometry, this.metalMaterial);
        cylinderConnection2.position.y = this.billboardHeight / 2 + 231.5 - 2;
        cylinderConnection2.position.x = 0.5;
        cylinderConnection2.position.z = -this.billboardWidth / 2 + 2;
        cylinderConnection2.rotation.z = Math.PI / 2;
        this.add(cylinderConnection2);

        const cylinderConnection3 = new THREE.Mesh(cylinderConnectionGeometry, this.metalMaterial);
        cylinderConnection3.position.y = - this.billboardHeight / 2 + 231.5 + 2;
        cylinderConnection3.position.x = 0.5;
        cylinderConnection3.position.z = this.billboardWidth / 2 - 2;
        cylinderConnection3.rotation.z = Math.PI / 2;
        this.add(cylinderConnection3);

        const cylinderConnection4 = new THREE.Mesh(cylinderConnectionGeometry, this.metalMaterial);
        cylinderConnection4.position.y = - this.billboardHeight / 2 + 231.5 + 2;
        cylinderConnection4.position.x = 0.5;
        cylinderConnection4.position.z = -this.billboardWidth / 2 + 2;
        cylinderConnection4.rotation.z = Math.PI / 2;
        this.add(cylinderConnection4);


        // lights
        const light1 = this.createLight();
        light1.position.y = this.billboardHeight / 2 + 231.5
        light1.position.x = 3.5;
        this.add(light1);

        const light2 = this.createLight();
        light2.position.y = this.billboardHeight / 2 + 231.5
        light2.position.x = 3.5;
        light2.position.z = this.billboardWidth / 2 - 10
        this.add(light2);

        const light3 = this.createLight();
        light3.position.y = this.billboardHeight / 2 + 231.5
        light3.position.x = 3.5;
        light3.position.z = -this.billboardWidth / 2 + 10
        this.add(light3);
    }

    createLight() {
        const light = new THREE.Group();

        const lightCylinderGeo1 = new THREE.CylinderGeometry(0.3, 0.3, 3, 32);
        const lightCylinder1 = new THREE.Mesh(lightCylinderGeo1, this.metalMaterial);
        light.add(lightCylinder1);

        const lightCylinderGeo2 = new THREE.CylinderGeometry(0.3, 0.3, 4, 32);
        const lightCylinder2 = new THREE.Mesh(lightCylinderGeo2, this.metalMaterial);
        lightCylinder2.position.y = 3
        lightCylinder2.position.x = 1.1
        lightCylinder2.rotation.z = -Math.PI / 5
        light.add(lightCylinder2);

        const boxGeometry = new THREE.BoxGeometry(3, 2.5, 3);
        const box = new THREE.Mesh(boxGeometry, this.metalMaterial);
        box.position.y = 3.5
        box.position.x = 3.4
        light.add(box);

        const planeGeometry = new THREE.PlaneGeometry(3, 3);
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.y = 2.22;
        plane.position.x = 3.4;
        plane.rotation.x = Math.PI / 2;
        light.add(plane);

        const spotLight = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 4, 0.5, 1);
        spotLight.position.set(3.4, 2.2, 0);
        spotLight.target.position.set(3.5, -10, 0);
        light.add(spotLight.target);
        light.add(spotLight);

        return light
    }

    getImage() {
        console.log("updating billboard image");

        // GET RBG AND LGRAY TEXTURES
        // creating a render target (with depth texture)
        let renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        renderTarget.depthBuffer = true;
        renderTarget.depthTexture = new THREE.DepthTexture();

        // rendering the scene to the render target
        this.app.renderer.setRenderTarget(renderTarget);
        this.app.renderer.render(this.app.scene, this.app.activeCamera);
        this.app.renderer.setRenderTarget(null);

        // rgb texture
        this.rgbTexture = renderTarget.texture;

        // depth texture
        let depthTexture = renderTarget.depthTexture;

        // read pixel data from the depth texture
        let depthData = new Uint8Array(window.innerWidth * window.innerHeight * 4);
        this.app.renderer.readRenderTargetPixels(renderTarget, 0, 0, window.innerWidth, window.innerHeight, depthData);

        // convert depth values to a grayscale
        for (let i = 0; i < depthData.length; i += 4) {
            let depthValue = (depthData[i] / 255); 
            let grayValue = depthValue * 255;
            depthData[i] = grayValue;
            depthData[i + 1] = grayValue;
            depthData[i + 2] = grayValue;
        }

        // create the lgray texture from the depth data
        this.lgrayTexture = new THREE.DataTexture(depthData, window.innerWidth, window.innerHeight, THREE.RGBAFormat, THREE.UnsignedByteType);
        this.lgrayTexture.needsUpdate = true;

        // CREATE AND APPLY SHADER
        const vertexShader = `
            varying vec2 vUv;

            uniform sampler2D lgrayTexture;
            
            void main() {
                vUv = uv;
            
                float z_offset = texture2D(lgrayTexture, vUv).r;
                vec3 offset = normal * z_offset * 2.0;
                vec3 displacedPosition = position + offset;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
            }
        `;

        const fragmentShader = `
            varying vec2 vUv;

            uniform sampler2D rgbTexture;
            
            void main() {
                vec3 rgbColor = texture2D(rgbTexture, vUv).rgb;
                gl_FragColor = vec4(rgbColor, 1.0);
            }
        `;

        this.billboardShader = new THREE.ShaderMaterial({
            uniforms: {
                rgbTexture: { type: "t", value: this.rgbTexture },
                lgrayTexture: { type: "t", value: this.lgrayTexture },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });
        
        this.plane.material = this.billboardShader;
    }

}

export { MyBillboard }
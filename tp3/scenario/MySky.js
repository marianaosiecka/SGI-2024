
import * as THREE from 'three';

class MySky {
    constructor(app) {
        this.app = app;

        const canvas = document.createElement( 'canvas' );
        canvas.width = 1;
        canvas.height = 100;

        const context = canvas.getContext('2d');
        const gradient = context.createLinearGradient(0, 0, 0, 100);
        gradient.addColorStop(0.0, '#ffffff');
        gradient.addColorStop(0.5, '#0561a0');
        gradient.addColorStop(1.0, '#437ab6');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 1, 100);

        const skyMap = new THREE.CanvasTexture(canvas);
        skyMap.colorSpace = THREE.SRGBColorSpace;

        const sky = new THREE.Mesh(
            new THREE.SphereGeometry( 500 ),
            new THREE.MeshBasicMaterial( { map: skyMap, side: THREE.DoubleSide } )
        );

        this.app.scene.add(sky);
    }
}

export { MySky }
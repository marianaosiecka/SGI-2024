import * as THREE from 'three';

class MyRoute extends THREE.Object3D {
    constructor(app, keyPoints, timeInterval, visualRepresentation = false) {
        super();
        this.type = 'Group';
        this.app = app;

        const keyframes = [];
        for (let i = 0; i < keyPoints.length; i++) {
            keyframes.push({ time: i * timeInterval, value: keyPoints[i] });
        }

        this.spline = new THREE.CatmullRomCurve3(keyframes.map(kf => kf.value));

        // visual representation of the spline
        if (visualRepresentation) {
            for (let i = 0; i < keyPoints.length; i++) {
                const geometry = new THREE.SphereGeometry(5, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
                const sphere = new THREE.Mesh(geometry, material);
                sphere.scale.set(0.2, 0.2, 0.2)
                sphere.position.set(... keyPoints[i])
    
                this.add(sphere)
            }

            const tubeGeometry = new THREE.TubeGeometry(this.spline, 100, 0.05, 10, false);
            const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
            this.add(tubeMesh)
        }
    }
}

MyRoute.prototype.isGroup = true;
export { MyRoute };
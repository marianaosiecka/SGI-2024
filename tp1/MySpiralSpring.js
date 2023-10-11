import * as THREE from 'three';

class MySpiralSpring extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, color) {
    super();
    this.type = 'Group';
    this.app = app;

    const numCoils = 3; // Número de voltas na espiral
    const radius = 0.08; // Raio da espiral
    const height = 0.5; // Altura da espiral
    const segments = 100; // Número de segmentos na espiral
    const particleCount = segments * numCoils; // Número de partículas


    for (let i = 0; i < particleCount; i++) {
        const t = i / segments;
        const angle = t * 2 * Math.PI * numCoils;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const z = (height / segments) * i;

        const particle = new THREE.SphereGeometry(0.04, 10, 10);
        const particleMaterial = new THREE.MeshPhongMaterial({ color: color, specular:"#FFFFFF", shininess:8 });
        const particleMesh = new THREE.Mesh(particle, particleMaterial);
        particleMesh.position.set(x, y, z);
        this.add(particleMesh);
    }
    
  }
}

MySpiralSpring.prototype.isGroup = true;
export { MySpiralSpring };
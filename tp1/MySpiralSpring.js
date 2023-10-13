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

    const numTurns = 3;      //Número de voltas na espiral
    const radius = 0.08;     //Raio da espiral
    const looseness = 0.5;   //Determina o quão "larga" é a espiral quanto menor o valor, mais apertada é
    const segments = 150;    //Número de segmentos na espiral, quanto mais segmentos menos se nota as particulas individuais
    const sphereCount = segments * numTurns; // Número de esferas


    for (let i = 0; i < sphereCount; i++) {
        const t = i / segments;                     //Representa um número de transição entre 0 e 1; permite a progressão ao longo da espiral
        const angle = t * 2 * Math.PI * numTurns;   //Multiplica por 2*PI para normalizar para radianos
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const z = (looseness / segments) * i;

        const sphere = new THREE.SphereGeometry(0.04, 10, 10);
        const sphereMaterial = new THREE.MeshPhongMaterial({ color: color, specular:"#FFFFFF", shininess:8 });
        const sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
        sphereMesh.position.set(x, y, z);
        this.add(sphereMesh);
    }
    
  }
}

MySpiralSpring.prototype.isGroup = true;
export { MySpiralSpring };
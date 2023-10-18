import * as THREE from 'three';

class MySpiralSpring extends THREE.Object3D {

  /**
     constructs the object
     @param {MyApp} app The application object
     @param {color} color The color of the spiral spring
  */
  constructor(app, color) {
    super();
    this.type = 'Group';
    this.app = app;

    this.numTurns = 8;                              //Número de voltas na espiral
    this.spiralRadius = 0.08;                       //Raio da espiral
    this.looseness = 0.2;                           //Determina o quão "larga" é a espiral quanto menor o valor, mais apertada é
    this.segments = 150;                            //Número de segmentos na espiral, quanto mais segmentos menos se nota as particulas individuais
    this.divCount = this.segments * this.numTurns;  //Número de divisões
    this.tubeRadius = 0.03;                         //Raio do tubo

    const points = [];
    for (let i = 0; i < this.divCount; i++) {
      const t = i / this.divCount;                   //Representa um número de transição entre 0 e 1; 
      const angle = t * 2 * Math.PI * this.numTurns; //Multiplica por 2*PI para normalizar para radianos
      const x = this.spiralRadius * Math.cos(angle);
      const y = this.spiralRadius * Math.sin(angle);
      const z = (this.looseness / this.segments) * i;
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    this.tubeGeometry = new THREE.TubeGeometry(curve, this.divCount, this.tubeRadius, 10, false);
    this.tubeMaterial = new THREE.MeshPhongMaterial({ color: color, specular: "#FFFFFF", shininess: 8, side: THREE.DoubleSide });
    this.spiralMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
    this.spiralMesh.castShadow = true;
    this.add(this.spiralMesh);
  }

}


MySpiralSpring.prototype.isGroup = true;
export { MySpiralSpring };
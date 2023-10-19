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

    this.numTurns = 8;                              //number of turns of the spiral
    this.spiralRadius = 0.08;                       //turn radius
    this.looseness = 0.2;                           //determines how wide or tight the turn is
    this.segments = 150;                            //number of segments in the spiral
    this.divCount = this.segments * this.numTurns;  //number of division
    this.tubeRadius = 0.03;                         //tube radius

    const points = [];
    for (let i = 0; i < this.divCount; i++) {
      const t = i / this.divCount;                   //transition number between 0 and 1; 
      const angle = t * 2 * Math.PI * this.numTurns; //normalizing to radians
      //coordinates of the points that make the curve
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
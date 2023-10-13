import * as THREE from 'three';


class MyCar extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
    super();
    this.app = app;
    this.type = 'Group';

    this.radius = 0.8;
    let angle = Math.PI/2; // 90 graus para fazer 1/4 de circunferência

    this.startPoint1 = new THREE.Vector3(0, 0, 0);
    this.endPoint1 = new THREE.Vector3(this.radius, this.radius, 0);

    this.backRoofCurve = new THREE.CubicBezierCurve3(
        this.startPoint1,
        new THREE.Vector3(this.startPoint1.x, this.startPoint1.y + this.radius * (4/3) * Math.tan(angle / 4), 0),
        new THREE.Vector3(this.endPoint1.x - this.radius * (4/3) * Math.tan(angle / 4), this.endPoint1.y, 0),
        this.endPoint1
    );

    this.endPoint2 = new THREE.Vector3(this.endPoint1.x + this.radius/2, this.endPoint1.y/2, 0);

    this.frontRoofCurve = new THREE.CubicBezierCurve3(
        this.endPoint1,
        new THREE.Vector3(this.endPoint1.x + this.radius/2 * (4/3) * Math.tan(angle / 4), this.endPoint1.y, 0),
        new THREE.Vector3(this.endPoint2.x, this.endPoint2.y + this.radius/2 * (4/3) * Math.tan(angle / 4), 0),
        this.endPoint2
    );

    this.endPoint3 = new THREE.Vector3(this.endPoint2.x + this.radius/2, 0, 0);

    this.hoodCurve = new THREE.CubicBezierCurve3(
      this.endPoint2,
      new THREE.Vector3(this.endPoint2.x + this.radius/2 * (4/3) * Math.tan(angle / 4), this.endPoint2.y, 0),
      new THREE.Vector3(this.endPoint3.x, this.endPoint3.y + this.radius/2 * (4/3) * Math.tan(angle / 4), 0),
      this.endPoint3
    );

    this.wheelRadius = 0.3;
    this.frontWheelEndPoint = new THREE.Vector3(this.startPoint1.x + this.wheelRadius*2, 0, 0);
    this.backWheelStartPoint = new THREE.Vector3(this.endPoint3.x - this.wheelRadius*2, 0, 0);

    this.backWheelCurve = new THREE.CubicBezierCurve3(
      this.startPoint1,
      new THREE.Vector3(this.startPoint1.x, this.startPoint1.y + 0.3 * (4/3) * Math.tan(angle / 2), 0),
      new THREE.Vector3(this.frontWheelEndPoint.x, this.frontWheelEndPoint.y + 0.3 * (4/3) * Math.tan(angle / 2), 0),
      this.frontWheelEndPoint
    );

    this.frontWheelCurve = new THREE.CubicBezierCurve3(
      this.backWheelStartPoint,
      new THREE.Vector3(this.backWheelStartPoint.x, this.backWheelStartPoint.y + 0.3 * (4/3) * Math.tan(angle / 2), 0),
      new THREE.Vector3(this.endPoint3.x, this.endPoint3.y + 0.3 * (4/3) * Math.tan(angle / 2), 0),
      this.endPoint3
    );
    
  }
}

MyCar.prototype.isGroup = true;
export { MyCar };
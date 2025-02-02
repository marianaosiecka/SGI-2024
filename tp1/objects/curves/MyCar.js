import * as THREE from 'three';


class MyCar extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
    super();
    this.app = app;

    this.radius = 0.8;
    let angle = Math.PI/2; // 90 degrees to make 1/4 of circunference

    //start and end points of the back roof curve
    this.startPoint1 = new THREE.Vector3(0, 0, 0);
    this.endPoint1 = new THREE.Vector3(this.radius, this.radius, 0);

    this.backRoofCurve = new THREE.CubicBezierCurve3(
        this.startPoint1,
        new THREE.Vector3(this.startPoint1.x, this.startPoint1.y + this.radius * (4/3) * (Math.sqrt(2)-1), 0),
        new THREE.Vector3(this.endPoint1.x - this.radius * (4/3) * (Math.sqrt(2)-1), this.endPoint1.y, 0),
        this.endPoint1
    );

    //end point of the front roof curve; the start point of the front roof curve is the previous end point
    this.endPoint2 = new THREE.Vector3(this.endPoint1.x + this.radius/2, this.endPoint1.y/2, 0);

    this.frontRoofCurve = new THREE.CubicBezierCurve3(
        this.endPoint1,
        new THREE.Vector3(this.endPoint1.x + this.radius/2 * (4/3) * (Math.sqrt(2)-1), this.endPoint1.y, 0),
        new THREE.Vector3(this.endPoint2.x, this.endPoint2.y + this.radius/2 * (4/3) * (Math.sqrt(2)-1), 0),
        this.endPoint2
    );

    //end point of the hood curve; the start point of the hood curve is the previous end point
    this.endPoint3 = new THREE.Vector3(this.endPoint2.x + this.radius/2, 0, 0);

    this.hoodCurve = new THREE.CubicBezierCurve3(
      this.endPoint2,
      new THREE.Vector3(this.endPoint2.x + this.radius/2 * (4/3) * (Math.sqrt(2)-1), this.endPoint2.y, 0),
      new THREE.Vector3(this.endPoint3.x, this.endPoint3.y + this.radius/2 * (4/3) * (Math.sqrt(2)-1), 0),
      this.endPoint3
    );

    this.wheelRadius = 0.3;
    //start and end points of the back and front wheel curve
    this.backWheelEndPoint = new THREE.Vector3(this.startPoint1.x + this.wheelRadius*2, 0, 0);
    this.frontWheelStartPoint = new THREE.Vector3(this.endPoint3.x - this.wheelRadius*2, 0, 0);

    this.backWheelCurve = new THREE.CubicBezierCurve3(
      this.startPoint1,
      new THREE.Vector3(this.startPoint1.x, this.startPoint1.y + this.wheelRadius * (4/3) * Math.tan(angle / 2), 0),
      new THREE.Vector3(this.backWheelEndPoint.x, this.backWheelEndPoint.y + this.wheelRadius * (4/3) * Math.tan(angle / 2), 0),
      this.backWheelEndPoint
    );

    //start and end points of the small back wheel curve are of a distance of smallWheelRadius from the previous start and end points
    this.smallWheelRadius = this.wheelRadius/2;
    this.smallBackWheelCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(this.startPoint1.x + this.smallWheelRadius, this.startPoint1.y, 0),
      new THREE.Vector3(this.startPoint1.x + this.smallWheelRadius, this.startPoint1.y + this.smallWheelRadius * (4/3), 0),
      new THREE.Vector3(this.backWheelEndPoint.x - this.smallWheelRadius, this.backWheelEndPoint.y + this.smallWheelRadius * (4/3), 0),
      new THREE.Vector3(this.backWheelEndPoint.x - this.smallWheelRadius, this.backWheelEndPoint.y, 0)
    );

    this.frontWheelCurve = new THREE.CubicBezierCurve3(
      this.frontWheelStartPoint,
      new THREE.Vector3(this.frontWheelStartPoint.x, this.frontWheelStartPoint.y + this.wheelRadius * (4/3), 0),
      new THREE.Vector3(this.endPoint3.x, this.endPoint3.y + this.wheelRadius * (4/3), 0),
      this.endPoint3
    );

     //start and end points of the small front wheel curve are of a distance of smallWheelRadius from the previous start and end points
     this.smallFrontWheelCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(this.frontWheelStartPoint.x + this.smallWheelRadius, this.frontWheelStartPoint.y, 0),
      new THREE.Vector3(this.frontWheelStartPoint.x + this.smallWheelRadius, this.frontWheelStartPoint.y + this.smallWheelRadius * (4/3), 0),
      new THREE.Vector3(this.endPoint3.x - this.smallWheelRadius, this.endPoint3.y + this.smallWheelRadius * (4/3), 0),
      new THREE.Vector3(this.endPoint3.x - this.smallWheelRadius, this.endPoint3.y, 0)
    );
    
  }
}

export { MyCar };
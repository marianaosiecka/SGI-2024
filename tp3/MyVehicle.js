import * as THREE from 'three';

class MyVehicle extends THREE.Object3D {

  /**
    * Creates the mesh, the line and the wireframe used to visualize the curve
    * @param {MyApp} app The application object
    * @param {width} width The width of the car
    * @param {height} height The height of the car
    * @param {depth} depth The depth of the car
    */
  constructor(scene, width, height, depth, maxVelocity, initialPosition) {
    super();
    this.scene = scene;
    this.type = 'Group';
    this.maxVelocity = maxVelocity;
    this.carOrientation = 0;
    this.wheelOrientation = 0;
    this.directionForward = 1;
    this.velocity = 0;
    this.position.x = initialPosition[0];
    this.position.y = initialPosition[1];
    this.position.z = initialPosition[2] - depth/2; //so that the rotation pivot is in the rear axle
    this.initialPosition = initialPosition;
    this.initialWheelTurnAngle = Math.PI/2;
    this.wheelTurnAngle = Math.PI/2;
    this.turnAngle = 0;
    this.shouldStop = false;
    this.rotationAdjusted = false;
    this.previousTurnAngle = null;

    // car geometry
    let geometry = new THREE.BoxGeometry(depth, height, width);

    // wheel geometry
    let wheelHeight = height/3;
    let wheelGeometry = new THREE.CylinderGeometry(wheelHeight, wheelHeight, wheelHeight, 32);
    
    // materials
    let wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    // meshes
    this.carMesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x0000ff }));
    this.wheelMeshLeftBack = new THREE.Mesh(wheelGeometry, wheelMaterial);
    this.wheelMeshLeftFront = new THREE.Mesh(wheelGeometry, wheelMaterial);
    this.wheelMeshRightBack = new THREE.Mesh(wheelGeometry, wheelMaterial);
    this.wheelMeshRightFront = new THREE.Mesh(wheelGeometry, wheelMaterial);

    // wheel positions
    this.wheelMeshLeftFront.rotation.set(0, Math.PI / 2, Math.PI / 2);
    this.wheelMeshLeftFront.position.x = -depth / 2 + wheelHeight;
    this.wheelMeshLeftFront.position.y = -height / 2;
    this.wheelMeshLeftFront.position.z = width / 2 - wheelHeight / 3;

    this.wheelMeshRightFront.rotation.set(0, Math.PI / 2, Math.PI / 2);
    this.wheelMeshRightFront.position.x = -depth / 2 + wheelHeight;
    this.wheelMeshRightFront.position.y = -height / 2;
    this.wheelMeshRightFront.position.z = -width / 2 + wheelHeight / 3;

    this.wheelMeshLeftBack.rotation.set(0, Math.PI / 2, Math.PI / 2);
    this.wheelMeshLeftBack.position.x = depth / 2 - wheelHeight;
    this.wheelMeshLeftBack.position.y = -height / 2;
    this.wheelMeshLeftBack.position.z = width / 2 - wheelHeight / 3;

    this.wheelMeshRightBack.rotation.set(0, Math.PI / 2, Math.PI / 2);
    this.wheelMeshRightBack.position.x = depth / 2 - wheelHeight;
    this.wheelMeshRightBack.position.y = -height / 2;
    this.wheelMeshRightBack.position.z = -width / 2 + wheelHeight / 3;


    this.add(this.carMesh);
    this.add(this.wheelMeshLeftBack);
    this.add(this.wheelMeshLeftFront);
    this.add(this.wheelMeshRightBack);
    this.add(this.wheelMeshRightFront);

    }

    getOrientation(){
        return this.carOrientation;
    }

    getVelocity() {
        return this.velocity*this.directionForward;
    }

    updateAutonomous(point) {
        this.position.set(...point);
    }

    update(time, velocity) {
        if(this.shouldStop)
            this.stop(velocity)
    
        // calculate the distance that the car should move
        let timeVariation = time - this.scene.previousTime;
        let dist = this.velocity * timeVariation * 0.005 * this.directionForward;
            
        this.updatePosition(dist)
        this.updateRotation()
        this.updateWheelRotation(dist)
    }

    updatePosition(dist){
        this.position.x -= dist * Math.cos(this.carOrientation);
        this.position.z -= dist * Math.sin(-this.carOrientation);
    }

    updateRotation(){
        // car rotation
        this.rotation.set(0, this.carOrientation, 0)

        // front wheels rotation
        if(this.wheelOrientation !== 0 && this.needsRotationAdjusted) {
            let rotationAngle = this.wheelOrientation;

            const normalizedAngle = this.wheelOrientation % (2 * Math.PI);
            const maxRotationAngle = Math.PI / 6; //max wheel rotation angle

            if (normalizedAngle > maxRotationAngle) {
                rotationAngle = maxRotationAngle;
            } 
            else if (normalizedAngle < -maxRotationAngle) {
                rotationAngle = -maxRotationAngle;
            }

            // apply rotation
            this.wheelMeshLeftFront.rotation.set(0, this.initialWheelTurnAngle + (rotationAngle*this.directionForward), this.initialWheelTurnAngle);
            this.wheelMeshRightFront.rotation.set(0, this.initialWheelTurnAngle + (rotationAngle*this.directionForward), this.initialWheelTurnAngle);
            this.needsRotationAdjusted = false;
        }
        else if (!this.needsRotationAdjusted){
            this.wheelMeshLeftFront.rotation.set(0, this.initialWheelTurnAngle, this.initialWheelTurnAngle);
            this.wheelMeshRightFront.rotation.set(0, this.initialWheelTurnAngle, this.initialWheelTurnAngle);
        }
            
    }

    updateWheelRotation(dist){
        // all wheels rotate on themselves
        this.wheelTurnAngle = Math.sin(dist * this.directionForward);

        this.wheelMeshLeftFront.rotateOnAxis(new THREE.Vector3(0, 1, 0), this.wheelTurnAngle)
        this.wheelMeshLeftBack.rotateOnAxis(new THREE.Vector3(0, 1, 0), this.wheelTurnAngle)
        this.wheelMeshRightFront.rotateOnAxis(new THREE.Vector3(0, 1, 0), this.wheelTurnAngle)
        this.wheelMeshRightBack.rotateOnAxis(new THREE.Vector3(0, 1, 0), this.wheelTurnAngle)
    }

    accelerate(velocity) {
        if (this.velocity + velocity < this.maxVelocity)  
            this.velocity += velocity/3;
    }

    stop(velocity) {
        if(this.velocity > 0){
            this.accelerate(-velocity/3)
        }
        if(this.velocity <= 0){
            this.velocity = 0;
            this.shouldStop = false;
        }
    }

    reverse () {
        this.directionForward = -1;
    }

    turn(turningRate) {
        this.carOrientation += turningRate;

        if(this.previousTurnAngle === null)
            this.previousTurnAngle = turningRate;

        // previousTurnAngle helps to differentiate when the car turns left or right so that the front wheels turn accordingly
        if((turningRate > 0 && this.previousTurnAngle < 0) || (turningRate < 0 && this.previousTurnAngle > 0)){
            // this restarts the rotation of the wheels
            this.wheelOrientation = turningRate * 10;
        }
        else
            this.wheelOrientation += turningRate;
        
        this.previousTurnAngle = turningRate;
        this.needsRotationAdjusted = true;
    }

    reset() {
        this.carOrientation = 0;
        this.velocity = 0;
        this.directionForward = 1;
        this.position.x = this.initialPosition[0];
        this.position.y = this.initialPosition[1];
        this.position.z = this.initialPosition[2];

        //reset wheel rotations
        this.wheelMeshLeftBack.rotation.set(0, Math.PI / 2, Math.PI / 2);
        this.wheelMeshLeftFront.rotation.set(0, Math.PI / 2, Math.PI / 2);
        this.wheelMeshRightBack.rotation.set(0, Math.PI / 2, Math.PI / 2);
        this.wheelMeshRightFront.rotation.set(0, Math.PI / 2, Math.PI / 2);
        
    }

}


MyVehicle.prototype.isGroup = true;
export { MyVehicle };
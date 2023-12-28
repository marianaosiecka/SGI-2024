import * as THREE from 'three';

class MyVehicle extends THREE.Object3D {

  /**
    * Creates the mesh, the line and the wireframe used to visualize the curve
    * @param {MyApp} app The application object
    * @param {width} width The width of the car
    * @param {height} height The height of the car
    * @param {depth} depth The depth of the car
    */
  constructor(scene, wheelsRatio, width, height, depth, maxVelocity, initialPosition) {
    super();
    this.scene = scene;
    this.type = 'Group';
    this.maxVelocity = maxVelocity;
    this.carOrientation = 0;
    this.wheelOrientation = 0;
    this.directionForward = 1;
    this.velocity = 0;
    this.previousVelocity = 0;
    this.position.x = initialPosition[0];
    this.position.y = initialPosition[1];
    this.position.z = initialPosition[2] - depth/2; //so that the rotation pivot is in the rear axle
    this.initialPosition = initialPosition;
    this.initialWheelTurnAngle = Math.PI/2;
    this.turnAngle = 0;
    this.shouldStop = false;
    this.rotationAdjusted = false;
    this.previousTurnAngle = null;
    this.shield = false;
    this.slipping = false;
    this.speeding = false;
    this.isReverse = false;
    this.outOfTrack = false;
    this.collidedCar = false;
    this.collidedCarStarted = false;
    this.allCarOutOfTrack = false;

    // car geometry
    let geometry = new THREE.BoxGeometry(depth, height, width);

    let textureLoader = new THREE.TextureLoader();
    let texture = textureLoader.load('textures/rodas.png');

    // wheel geometry
    let wheelHeight = height/8;
    let wheelGeometry = new THREE.CylinderGeometry(wheelHeight, wheelHeight, wheelHeight, 32);
    
    // materials
    let wheelMaterial = new THREE.MeshPhongMaterial({ map: texture });

    // meshes
    this.carMesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x0000ff }));
    this.wheelMeshLeftBack = new THREE.Mesh(wheelGeometry, wheelMaterial);
    this.wheelMeshLeftFront = new THREE.Mesh(wheelGeometry, wheelMaterial);
    this.wheelMeshRightBack = new THREE.Mesh(wheelGeometry, wheelMaterial);
    this.wheelMeshRightFront = new THREE.Mesh(wheelGeometry, wheelMaterial);

    this.carMesh.position.y = height/3;

    this.wheels = [this.wheelMeshLeftBack, this.wheelMeshLeftFront, this.wheelMeshRightBack, this.wheelMeshRightFront];

    // bounding boxes
    this.carBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    this.carBB.setFromObject(this.carMesh);
    this.wheel1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    this.wheel1BB.setFromObject(this.wheelMeshLeftBack);
    this.wheel2BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    this.wheel2BB.setFromObject(this.wheelMeshLeftFront);
    this.wheel3BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    this.wheel3BB.setFromObject(this.wheelMeshRightBack);
    this.wheel4BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    this.wheel4BB.setFromObject(this.wheelMeshRightFront);

    this.wheelsBB = [this.wheel1BB, this.wheel2BB, this.wheel3BB, this.wheel4BB];

    let xWheels = depth/3;

    // wheel positions
    this.wheelMeshLeftFront.rotation.set(0, Math.PI / 2, Math.PI / 2);
    this.wheelMeshLeftFront.position.x = -xWheels + wheelHeight;
    this.wheelMeshLeftFront.position.z = width / 2 * 1.1 - wheelHeight / 3;

    this.wheelMeshRightFront.rotation.set(0, Math.PI / 2, Math.PI / 2);
    this.wheelMeshRightFront.position.x = -xWheels  + wheelHeight;
    this.wheelMeshRightFront.position.z = -width / 1.9 + wheelHeight / 3;

    this.wheelMeshLeftBack.rotation.set(0, Math.PI / 2, Math.PI / 2);
    this.wheelMeshLeftBack.position.x = xWheels / wheelsRatio - wheelHeight;
    this.wheelMeshLeftBack.position.z = width / 2 * 1.1 - wheelHeight / 3;

    this.wheelMeshRightBack.rotation.set(0, Math.PI / 2, Math.PI / 2);
    this.wheelMeshRightBack.position.x = xWheels / wheelsRatio - wheelHeight;
    this.wheelMeshRightBack.position.z = -width / 1.9 + wheelHeight / 3;

    this.add(this.carMesh);
    this.add(this.wheelMeshLeftBack);
    this.add(this.wheelMeshLeftFront);
    this.add(this.wheelMeshRightBack);
    this.add(this.wheelMeshRightFront);

    this.carBodyMesh = null;

    }

    setModel(model) {
        this.carMesh.visible = false;
        this.add(model);
    }

    getVelocity() {
        return this.velocity*this.directionForward;
    }

    updateAutonomous(velocity, point, orientation) {
        this.position.set(...point);
        this.setRotationFromQuaternion(orientation);
        this.carOrientation = this.rotation.y;

        this.carMesh.updateMatrixWorld();
        this.wheels.forEach(wheel => {
            wheel.updateMatrixWorld();
        })        

        this.updateWheelRotation(velocity, true)

        // update the bounding box positions
        this.carBB.copy(this.carMesh.geometry.boundingBox).applyMatrix4(this.carMesh.matrixWorld);
        this.wheel1BB.copy(this.wheelMeshLeftBack.geometry.boundingBox).applyMatrix4(this.wheelMeshLeftBack.matrixWorld);
        this.wheel2BB.copy(this.wheelMeshLeftFront.geometry.boundingBox).applyMatrix4(this.wheelMeshLeftFront.matrixWorld);
        this.wheel3BB.copy(this.wheelMeshRightBack.geometry.boundingBox).applyMatrix4(this.wheelMeshRightBack.matrixWorld);
        this.wheel4BB.copy(this.wheelMeshRightFront.geometry.boundingBox).applyMatrix4(this.wheelMeshRightFront.matrixWorld);
    }

    setPos(position) {
        this.position.set(...position);

        this.carMesh.updateMatrixWorld();
        this.wheels.forEach(wheel => {
            wheel.updateMatrixWorld();
        })

        // update the bounding box positions
        this.carBB.copy(this.carMesh.geometry.boundingBox).applyMatrix4(this.carMesh.matrixWorld);
        this.wheel1BB.copy(this.wheelMeshLeftBack.geometry.boundingBox).applyMatrix4(this.wheelMeshLeftBack.matrixWorld);
        this.wheel2BB.copy(this.wheelMeshLeftFront.geometry.boundingBox).applyMatrix4(this.wheelMeshLeftFront.matrixWorld);
        this.wheel3BB.copy(this.wheelMeshRightBack.geometry.boundingBox).applyMatrix4(this.wheelMeshRightBack.matrixWorld);
        this.wheel4BB.copy(this.wheelMeshRightFront.geometry.boundingBox).applyMatrix4(this.wheelMeshRightFront.matrixWorld);

        this.velocity *= 0.2;

    }

    update(time, velocity) {
        if(this.shouldStop)
            this.stop(velocity)

        if(this.outOfTrack)
            this.velocity = 0.07*this.maxVelocity;

        // calculate the distance that the car should move
        let timeVariation = time - this.scene.previousTime;
        let dist = this.velocity * timeVariation * 0.005 * this.directionForward;

        this.updatePosition(dist)
        this.updateRotation()
        this.updateWheelRotation(dist, false)

        this.carMesh.updateMatrixWorld();
        this.wheels.forEach(wheel => {
            wheel.updateMatrixWorld();
        })

        // update the bounding box positions
        this.carBB.copy(this.carMesh.geometry.boundingBox).applyMatrix4(this.carMesh.matrixWorld);
        this.wheel1BB.copy(this.wheelMeshLeftBack.geometry.boundingBox).applyMatrix4(this.wheelMeshLeftBack.matrixWorld);
        this.wheel2BB.copy(this.wheelMeshLeftFront.geometry.boundingBox).applyMatrix4(this.wheelMeshLeftFront.matrixWorld);
        this.wheel3BB.copy(this.wheelMeshRightBack.geometry.boundingBox).applyMatrix4(this.wheelMeshRightBack.matrixWorld);
        this.wheel4BB.copy(this.wheelMeshRightFront.geometry.boundingBox).applyMatrix4(this.wheelMeshRightFront.matrixWorld);
    }

    updatePosition(dist){
        this.position.x -= dist * Math.cos(this.carOrientation);
        this.position.z -= dist * Math.sin(-this.carOrientation);
    }

    updateRotation(){
        let noise = 0;

        // if the car is slipping it will rotate randomly
        if(this.slipping){
            // controls the amplitude of the angle
            const slippingEffect = 0.6; 
            // controls the frequency of the rotation
            noise = Math.sin(Date.now() * 0.0025) * slippingEffect;
        }

        // car rotation
        this.rotation.y = this.carOrientation + noise;

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

    updateWheelRotation(dist, autonomous){
        // all wheels rotate on themselves
        let wheelTurnAngle = Math.sin(dist);
        if(autonomous)
            wheelTurnAngle = Math.abs(wheelTurnAngle);

        this.wheels.forEach(wheel => {
            wheel.rotateOnAxis(new THREE.Vector3(0, 1, 0), wheelTurnAngle);
        });
    }

    accelerate(velocity) {
        if (this.velocity + velocity < this.maxVelocity && !this.outOfTrack && !this.collidedCar)  
            this.velocity += velocity/3;
    }

    decelerate(velocity) {
        if (this.velocity + velocity > 0)  
            this.velocity -= velocity/3;
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
        if(this.directionForward === 1)
            this.directionForward = -1;
        else if (this.directionForward === -1)
            this.directionForward = 1;
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
        this.outOfTrack = false;
        this.allCarOutOfTrack = false;
        this.slipping = false;
        this.speeding = false;
        this.shield = false;
        this.collidedCar = false;
        this.collidedCarStarted = false;
        this.position.x = this.initialPosition[0];
        this.position.y = this.initialPosition[1];
        this.position.z = this.initialPosition[2];

        //reset wheel rotations
        this.wheels.forEach(wheel => {
            wheel.rotation.set(0, Math.PI / 2, Math.PI / 2);
        });
    }

    detectCollisionsSphere (otherObject) {
        return this.carBB.intersectsSphere(otherObject) || this.wheel1BB.intersectsSphere(otherObject) || this.wheel2BB.intersectsSphere(otherObject) || this.wheel3BB.intersectsSphere(otherObject) || this.wheel4BB.intersectsSphere(otherObject)
    }

    detectCollisionsVehicles (otherVehicle) {
        return this.carBB.intersectsBox(otherVehicle.carBB) || this.wheel1BB.intersectsBox(otherVehicle.carBB) || this.wheel2BB.intersectsBox(otherVehicle.carBB) || this.wheel3BB.intersectsBox(otherVehicle.carBB) || this.wheel4BB.intersectsBox(otherVehicle.carBB)
         || this.carBB.intersectsBox(otherVehicle.wheel1BB) || this.wheel1BB.intersectsBox(otherVehicle.wheel1BB) || this.wheel2BB.intersectsBox(otherVehicle.wheel1BB) || this.wheel3BB.intersectsBox(otherVehicle.wheel1BB) || this.wheel4BB.intersectsBox(otherVehicle.wheel1BB)
         || this.carBB.intersectsBox(otherVehicle.wheel2BB) || this.wheel1BB.intersectsBox(otherVehicle.wheel2BB) || this.wheel2BB.intersectsBox(otherVehicle.wheel2BB) || this.wheel3BB.intersectsBox(otherVehicle.wheel2BB) || this.wheel4BB.intersectsBox(otherVehicle.wheel2BB)
         || this.carBB.intersectsBox(otherVehicle.wheel3BB) || this.wheel1BB.intersectsBox(otherVehicle.wheel3BB) || this.wheel2BB.intersectsBox(otherVehicle.wheel3BB) || this.wheel3BB.intersectsBox(otherVehicle.wheel3BB) || this.wheel4BB.intersectsBox(otherVehicle.wheel3BB)
         || this.carBB.intersectsBox(otherVehicle.wheel4BB) || this.wheel1BB.intersectsBox(otherVehicle.wheel4BB) || this.wheel2BB.intersectsBox(otherVehicle.wheel4BB) || this.wheel3BB.intersectsBox(otherVehicle.wheel4BB) || this.wheel4BB.intersectsBox(otherVehicle.wheel4BB);
    }

    detectOutOfTrack (track) {
        let positionWheel1 = this.position.clone().add(this.wheelMeshLeftBack.position);
        let positionWheel2 = this.position.clone().add(this.wheelMeshLeftFront.position);
        let positionWheel3 = this.position.clone().add(this.wheelMeshRightBack.position);
        let positionWheel4 = this.position.clone().add(this.wheelMeshRightFront.position);

        const verticalVector = new THREE.Vector3(0, -1, 0);

        //raycaster for each wheel
        const raycaster1 = new THREE.Raycaster(positionWheel1, verticalVector);
        const intersections1 = raycaster1.intersectObject(track);

        const raycaster2 = new THREE.Raycaster(positionWheel2, verticalVector);
        const intersections2 = raycaster2.intersectObject(track);

        const raycaster3 = new THREE.Raycaster(positionWheel3, verticalVector);
        const intersections3 = raycaster3.intersectObject(track);
        
        const raycaster4 = new THREE.Raycaster(positionWheel4, verticalVector);
        const intersections4 = raycaster4.intersectObject(track);
        
        // return true if any of the wheels is out of the track (0 intersections)
        if(intersections1.length === 0 && intersections2.length === 0 && intersections3.length === 0 && intersections4.length === 0){
            this.allCarOutOfTrack = true;
            return true;
        }
        this.allCarOutOfTrack = false;
        return intersections1.length === 0 || intersections2.length === 0 || intersections3.length === 0 || intersections4.length === 0;
    }

    stopModifier(vehicle) {
        vehicle.collidedCar = false;
        vehicle.collidedCarStarted = false;
    }
}


MyVehicle.prototype.isGroup = true;
export { MyVehicle };
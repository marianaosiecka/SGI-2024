import * as THREE from 'three';

class MyVehicle extends THREE.Object3D {

  /**
    * Creates the mesh, the line and the wireframe used to visualize the curve
    * @param {MyApp} app The application object
    * @param {wheelsRatio} wheelsRatio The distance between the front and back wheels
    * @param {width} width The width of the car
    * @param {height} height The height of the car
    * @param {depth} depth The depth of the car
    * @param {maxVelocity} maxVelocity The maximum velocity of the car
    * @param {initialPosition} initialPosition The initial position of the car
    */
  constructor(scene, wheelsRatio, width, height, depth, maxVelocity, initialPosition) {
    super();
    this.scene = scene;
    this.type = 'Group';

    this.wheelsRatio = wheelsRatio;
    this.width = width;
    this.depth = depth;
    this.maxVelocity = maxVelocity;
    this.position.x = initialPosition[0];
    this.position.y = initialPosition[1];
    this.position.z = initialPosition[2] - depth/2; //so that the rotation pivot is in the rear axle
    this.initialPosition = initialPosition;

    // car properties
    this.carOrientation = 0;
    this.wheelOrientation = 0;
    this.directionForward = 1;
    this.velocity = 0;
    this.previousVelocity = 0;
    this.initialWheelTurnAngle = Math.PI/2;
    this.turnAngle = 0;
    this.isReverse = false;
    
    // modifier flags
    this.shouldStop = false;
    this.rotationAdjusted = false;
    this.previousTurnAngle = null;
    this.shield = false;
    this.slipping = false;
    this.speeding = false;
    this.outOfTrack = false;
    this.outOfTrackStarted = false;
    this.collidedCar = false;
    this.collidedCarStarted = false;
    this.allCarOutOfTrack = false;

    // car geometry
    let geometry = new THREE.BoxGeometry(depth, height, width);

    // car mesh
    this.carMesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0x0000ff }));
    this.carMesh.position.y = height/3;

    // bounding box
    this.carBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    this.carBB.setFromObject(this.carMesh);

    this.add(this.carMesh);

    // wheel properties
    this.wheelHeight = height/8;
    this.xWheels = depth/3;
    }

    /**
     * Sets the car model
     * @param {*} model 
     */
    setModel(model) {
        this.carMesh.visible = false;
        this.add(model);
        this.position.set(this.initialPosition[0], this.initialPosition[1], this.initialPosition[2]);
    }

    /**
     * Sets the wheel model
     * @param {*} model
     */
    setWheelModel(model) {
        this.wheelLeftFrontGroup = model.clone();
        this.wheelRightFrontGroup = model.clone();
        this.wheelLeftBackGroup = model.clone();
        this.wheelRightBackGroup = model.clone();

        // wheel positions
        this.wheelLeftFrontGroup.rotation.y = Math.PI/2;
        this.wheelLeftFrontGroup.position.x = -this.xWheels + this.wheelHeight;
        this.wheelLeftFrontGroup.position.z = this.width / 2 * 1.35 - this.wheelHeight / 3;

        this.wheelRightFrontGroup.rotation.y = -Math.PI/2;
        this.wheelRightFrontGroup.position.x = -this.xWheels  + this.wheelHeight;
        this.wheelRightFrontGroup.position.z = -1/0.4 + this.wheelHeight / 3;

        this.wheelLeftBackGroup.rotation.y = Math.PI/2;
        this.wheelLeftBackGroup.position.x = this.xWheels / this.wheelsRatio - this.wheelHeight;
        this.wheelLeftBackGroup.position.z = this.width / 2 * 1.3 - this.wheelHeight / 3;

        this.wheelRightBackGroup.rotation.y = -Math.PI / 2;
        this.wheelRightBackGroup.position.x = this.xWheels / this.wheelsRatio - this.wheelHeight;
        this.wheelRightBackGroup.position.z = -1/0.4 + this.wheelHeight / 3;

        // wheel groups
        this.add(this.wheelLeftBackGroup);
        this.add(this.wheelLeftFrontGroup);
        this.add(this.wheelRightBackGroup);
        this.add(this.wheelRightFrontGroup);
        this.wheels = [this.wheelLeftBackGroup, this.wheelLeftFrontGroup, this.wheelRightBackGroup, this.wheelRightFrontGroup];

        // bounding boxes
        this.wheel1BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
        this.wheel1BB.setFromObject(this.wheelLeftFrontGroup.children[0]);
        this.wheel2BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
        this.wheel2BB.setFromObject(this.wheelRightFrontGroup.children[0]);
        this.wheel3BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
        this.wheel3BB.setFromObject(this.wheelRightBackGroup.children[0]);
        this.wheel4BB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
        this.wheel4BB.setFromObject(this.wheelLeftBackGroup.children[0]);
        this.wheelsBB = [this.wheel1BB, this.wheel2BB, this.wheel3BB, this.wheel4BB];
    }

    /**
     * returns the car velocity
     * @returns {number} velocity
     */
    getVelocity() {
        return this.velocity*this.directionForward;
    }

    /**
     * updates the bounding boxes
     */
    updateBoundingBoxes() {
        this.carMesh.updateMatrixWorld();
        
        //update the bounding box positions
        this.carBB.copy(this.carMesh.geometry.boundingBox).applyMatrix4(this.carMesh.matrixWorld);
        
        if(this.wheels !== undefined){
            this.wheels.forEach(wheel => {
                wheel.updateMatrixWorld();
            });

            this.wheelsBB.forEach((wheelBB, index) => {
                wheelBB.copy(this.wheels[index].children[0].geometry.boundingBox).applyMatrix4(this.wheels[index].children[0].matrixWorld);
            });
        }
    }

    /**
     * updates the autonomous car position
     * @param {number} velocity
     * @param {array} point
     * @param {number} orientation
     */
    updateAutonomous(velocity, point, orientation, wheelOrientation) {
        this.position.set(...point);
    
        if(this.wheels !== undefined){
            this.updateWheelRotation(velocity, true)
            this.updateAutonomousRotation(orientation, wheelOrientation)
        }

        //console.log(Math.sin(velocity))
        // update the bounding box positions
        this.updateBoundingBoxes();
    }

    /**
     * sets the car position when finishing the shortcut animation
     * @param {array} position
     */
    setPos(position) {
        this.position.set(...position);

        // update the bounding box positions
        this.updateBoundingBoxes();
        this.velocity *= 0.2;
    }

    /**
     * updates the car position
     * @param {number} time
     * @param {number} velocity
     */
    update(time, velocity) {
        if(this.shouldStop)
            this.stop(velocity)

        // calculate the distance that the car should move
        let timeVariation = time - this.scene.previousTime;
        let dist = this.velocity * timeVariation * 0.005 * this.directionForward;

        this.updatePosition(dist)
        if(this.wheels !== undefined){
            this.updateRotation()
            this.updateWheelRotation(dist, false)
        }
        this.updateBoundingBoxes();
    }

    /**
     * updates the car position
     * @param {number} dist distance that the car should move
     */
    updatePosition(dist){
        this.position.x -= dist * Math.cos(this.carOrientation);
        this.position.z -= dist * Math.sin(-this.carOrientation);
    }

    /**
     * updates the autonomous car rotation
     * @param {number} quaternation
     */
    updateAutonomousRotation(quaternation, wheelOrientation){
        // car rotation
        this.setRotationFromQuaternion(quaternation);
        this.carOrientation = this.rotation.y;

        let rotationAngle = wheelOrientation;

        // front wheels rotation
        if(wheelOrientation !== 0) {
            const normalizedAngle = wheelOrientation % (2 * Math.PI) * this.directionForward;
            const maxRotationAngle = Math.PI / 6; //max wheel rotation angle

            if (normalizedAngle > maxRotationAngle) {
                rotationAngle = maxRotationAngle;
            } 
            else if (normalizedAngle < -maxRotationAngle) {
                rotationAngle = -maxRotationAngle;
            }

            this.wheelLeftFrontGroup.rotation.y = this.initialWheelTurnAngle + rotationAngle;
            this.wheelRightFrontGroup.rotation.y = -this.initialWheelTurnAngle + rotationAngle;
        }
        else{
            this.wheelLeftFrontGroup.rotation.y = this.initialWheelTurnAngle;
            this.wheelRightFrontGroup.rotation.y = -this.initialWheelTurnAngle;
        }
    }

    /**
     * updates the car rotation
     */
    updateRotation(){
        let noise = 0;
        // if the car is slipping it will rotate randomly
        if(this.slipping){
            // controls the amplitude of the angle
            const slippingEffect = 0.3; 
            // controls the frequency of the rotation
            noise = Math.sin(Date.now() * 0.0025) * slippingEffect;
        }

        // car rotation
        this.rotation.y = this.carOrientation + noise;

        // front wheels rotation
        if(this.wheelOrientation !== 0 && this.needsRotationAdjusted) {
            let rotationAngle = this.wheelOrientation + noise;

            const normalizedAngle = (this.wheelOrientation % (2 * Math.PI) + noise) * this.directionForward;
            const maxRotationAngle = Math.PI / 6; //max wheel rotation angle

            if (normalizedAngle > maxRotationAngle) {
                rotationAngle = maxRotationAngle;
            } 
            else if (normalizedAngle < -maxRotationAngle) {
                rotationAngle = -maxRotationAngle;
            }

            // apply rotation
            this.wheelLeftFrontGroup.rotation.y = this.initialWheelTurnAngle + rotationAngle;
            this.wheelRightFrontGroup.rotation.y = -this.initialWheelTurnAngle + rotationAngle;
            this.needsRotationAdjusted = false;
        }
        else if (!this.needsRotationAdjusted){
            this.wheelLeftFrontGroup.rotation.y = this.initialWheelTurnAngle + noise;
            this.wheelRightFrontGroup.rotation.y = -this.initialWheelTurnAngle + noise;
        }

    }

    /**
     * updates the wheel rotation
     * @param {number} dist distance that the car should move
     * @param {boolean} autonomous is the autonomous car
     */
    updateWheelRotation(dist, autonomous){
        // all wheels rotate on themselves
        let wheelTurnAngle = Math.sin(dist);
        if(autonomous)
            wheelTurnAngle = -Math.abs(wheelTurnAngle);

        this.wheelRightFrontGroup.children[0].rotateOnAxis(new THREE.Vector3(1, 0, 0), wheelTurnAngle);
        this.wheelRightBackGroup.children[0].rotateOnAxis(new THREE.Vector3(1, 0, 0), wheelTurnAngle);
        this.wheelLeftBackGroup.children[0].rotateOnAxis(new THREE.Vector3(-1, 0, 0), wheelTurnAngle);
        this.wheelLeftFrontGroup.children[0].rotateOnAxis(new THREE.Vector3(-1, 0, 0), wheelTurnAngle);
    }

    /**
     * accelarates the car velocity
     * @param {number} velocity
     */
    accelerate(velocity) {
        if (this.velocity + velocity < this.maxVelocity && !this.collidedCar)  
            this.velocity += velocity/3;
        if (this.velocity + velocity >= this.maxVelocity && !this.collidedCar) 
            this.velocity = this.maxVelocity; 
    }

    /**
     * decelarates the car velocity
     * @param {number} velocity
     */
    decelerate(velocity) {
        if (this.velocity - velocity/3 >= 0)  
            this.velocity -= velocity/3;
    }

    /**
     * stops the car
     * @param {number} velocity the velocity to decelarate the car until it stops
     */
    stop(velocity) {
        if(this.velocity > 0){
            this.accelerate(-velocity/3)
        }
        if(this.velocity <= 0){
            this.velocity = 0;
            this.shouldStop = false;
        }
    }

    /**
     * updates the car direction to backwards
     */
    reverse () {
        if(this.directionForward === 1)
            this.directionForward = -1;
        else if (this.directionForward === -1)
            this.directionForward = 1;
    }

    /**
     * updates the car orientation
     * @param {*} turningRate 
     */
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
        this.outOfTrackStarted = false;
        this.allCarOutOfTrack = false;
        this.slipping = false;
        this.speeding = false;
        this.shield = false;
        this.collidedCar = false;
        this.collidedCarStarted = false;
        this.position.x = this.initialPosition[0];
        this.position.y = this.initialPosition[1];
        this.position.z = this.initialPosition[2];

    }

    /**
     * detects collisions with other objects used for modifiers
     * @param {*} otherObject
     */
    detectCollisionsBox (otherObject) {
        return this.carBB.intersectsBox(otherObject) || this.wheel1BB.intersectsBox(otherObject) || this.wheel2BB.intersectsBox(otherObject) || this.wheel3BB.intersectsBox(otherObject) || this.wheel4BB.intersectsBox(otherObject)
    }

    /**
     * detects collisions with the other vehicle
     * @param {*} otherVehicle 
     * @returns 
     */
    detectCollisionsVehicles (otherVehicle) {
        return this.carBB.intersectsBox(otherVehicle.carBB) || this.wheel1BB.intersectsBox(otherVehicle.carBB) || this.wheel2BB.intersectsBox(otherVehicle.carBB) || this.wheel3BB.intersectsBox(otherVehicle.carBB) || this.wheel4BB.intersectsBox(otherVehicle.carBB)
         || this.carBB.intersectsBox(otherVehicle.wheel1BB) || this.wheel1BB.intersectsBox(otherVehicle.wheel1BB) || this.wheel2BB.intersectsBox(otherVehicle.wheel1BB) || this.wheel3BB.intersectsBox(otherVehicle.wheel1BB) || this.wheel4BB.intersectsBox(otherVehicle.wheel1BB)
         || this.carBB.intersectsBox(otherVehicle.wheel2BB) || this.wheel1BB.intersectsBox(otherVehicle.wheel2BB) || this.wheel2BB.intersectsBox(otherVehicle.wheel2BB) || this.wheel3BB.intersectsBox(otherVehicle.wheel2BB) || this.wheel4BB.intersectsBox(otherVehicle.wheel2BB)
         || this.carBB.intersectsBox(otherVehicle.wheel3BB) || this.wheel1BB.intersectsBox(otherVehicle.wheel3BB) || this.wheel2BB.intersectsBox(otherVehicle.wheel3BB) || this.wheel3BB.intersectsBox(otherVehicle.wheel3BB) || this.wheel4BB.intersectsBox(otherVehicle.wheel3BB)
         || this.carBB.intersectsBox(otherVehicle.wheel4BB) || this.wheel1BB.intersectsBox(otherVehicle.wheel4BB) || this.wheel2BB.intersectsBox(otherVehicle.wheel4BB) || this.wheel3BB.intersectsBox(otherVehicle.wheel4BB) || this.wheel4BB.intersectsBox(otherVehicle.wheel4BB);
    }

    /**
     * detects collisions with the track and check point lines
     * @param {*} object 
     * @param {*} isTrack if the object is the track or the check point lines
     * @returns if the object is track then returns true if the car is out of the track, otherwise returns true if the car is in the track
     *          if the object is the check point lines then returns true if the car is in the check point lines, otherwise returns false
     */
    detectCollisionsObject (object, isTrack) {
        let positionWheel1 = this.position.clone().add(this.wheelLeftFrontGroup.position);
        let positionWheel2 = this.position.clone().add(this.wheelRightFrontGroup.position);
        let positionWheel3 = this.position.clone().add(this.wheelRightBackGroup.position);
        let positionWheel4 = this.position.clone().add(this.wheelLeftBackGroup.position);

        const verticalVector = new THREE.Vector3(0, -1, 0);

        //raycaster for each wheel
        const raycaster1 = new THREE.Raycaster(positionWheel1, verticalVector);
        const intersections1 = raycaster1.intersectObject(object);

        const raycaster2 = new THREE.Raycaster(positionWheel2, verticalVector);
        const intersections2 = raycaster2.intersectObject(object);

        const raycaster3 = new THREE.Raycaster(positionWheel3, verticalVector);
        const intersections3 = raycaster3.intersectObject(object);
        
        const raycaster4 = new THREE.Raycaster(positionWheel4, verticalVector);
        const intersections4 = raycaster4.intersectObject(object);
        
        if(isTrack){
            // if all wheels are out of the track 
            if(intersections1.length === 0 && intersections2.length === 0 && intersections3.length === 0 && intersections4.length === 0){
                this.allCarOutOfTrack = true;
                return true;
            }
            this.allCarOutOfTrack = false;

            // return true if any of the wheels is out of the track (0 intersections)
            return intersections1.length === 0 || intersections2.length === 0 || intersections3.length === 0 || intersections4.length === 0;
        }

        return intersections1.length !== 0 || intersections2.length !== 0 || intersections3.length !== 0 || intersections4.length !== 0;

    }

    /**
     * stops the collision of the other vehicle
     * @param {*} vehicle 
     */
    stopModifier(vehicle) {
        vehicle.collidedCar = false;
        vehicle.collidedCarStarted = false;
    }
}


MyVehicle.prototype.isGroup = true;
export { MyVehicle };
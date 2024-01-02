import * as THREE from 'three';

class MyRoute extends THREE.Object3D {
    constructor(app, keyPoints, timeInterval, object, offsetPos, offsetRot, visualRepresentation = false) {
        super();
        this.type = 'Group';
        this.app = app;
        this.keyPoints = keyPoints;

        // if 
        if(visualRepresentation) this.debugKeyFrames();

        const times = keyPoints.map((_, i) => i * timeInterval);

        const positionKF = new THREE.VectorKeyframeTrack(
            '.position', 
            times,
            keyPoints.map(kp => [kp.x + offsetPos.x, kp.y + offsetPos.y, kp.z + offsetPos.z, 0]).flat(),
            THREE.InterpolateSmooth
        );


        const yAxis = new THREE.Vector3(0, 1, 0)

        const q0 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(0))
        this.q_list = []
        for (let i = 0; i < keyPoints.length - 1; i++) {
            const p1_x = keyPoints[i].x
            const p1_z = keyPoints[i].z
            const p2_x = keyPoints[i + 1].x
            const p2_z = keyPoints[i + 1].z
            const dx = p1_x - p2_x
            const dz = p1_z - p2_z
            const angle = Math.atan2(dz, dx)
            const q1 = new THREE.Quaternion().setFromAxisAngle(yAxis, -angle + offsetRot)
            this.q_list.push(q1)
        }
        this.q_list.push(q0)

        const quaternionKF = new THREE.QuaternionKeyframeTrack(
            '.quaternion', 
            times,
            this.q_list.map(q => [...q]).flat()
        );

        this.animationMaxDuration = times[times.length - 1];

        const positionClip = new THREE.AnimationClip('positionAnimation', this.animationMaxDuration, [positionKF])
        const rotationClip = new THREE.AnimationClip('rotationAnimation', this.animationMaxDuration, [quaternionKF])

        this.mixer = new THREE.AnimationMixer(object)

        const positionAction = this.mixer.clipAction(positionClip)
        const rotationAction = this.mixer.clipAction(rotationClip)

        positionAction.play()
        rotationAction.play()
    }

    debugKeyFrames() {
        let spline = new THREE.CatmullRomCurve3([...this.keyPoints])

        for (let i = 0; i < this.keyPoints.length; i++) {
            const geometry = new THREE.SphereGeometry(5, 32, 32)
            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
            const sphere = new THREE.Mesh(geometry, material)
            sphere.scale.set(0.2, 0.2, 0.2)
            sphere.position.set(... this.keyPoints[i])
            sphere.position.y += 0.5

            this.app.scene.add(sphere)
        }

        const tubeGeometry = new THREE.TubeGeometry(spline, 100, 0.05, 10, false)
        const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial)

        this.app.scene.add(tubeMesh)
    }

    updateBoundingBox(autonomousVehicle) {
        const carPosition = new THREE.Vector3();
        const carQuaternion = new THREE.Quaternion();
        const vehicle = this.mixer.getRoot();
        
        vehicle.getWorldPosition(carPosition);
        vehicle.getWorldQuaternion(carQuaternion);

        const currentTime = this.mixer.time;
        const currentIndex = Math.floor(currentTime / this.animationMaxDuration * (this.keyPoints.length - 1));

        let velocity = new THREE.Vector3();

        if (currentIndex < this.keyPoints.length - 1) {
            const currentKeyPoint = this.keyPoints[currentIndex];
            const nextKeyPoint = this.keyPoints[currentIndex + 1];

            const displacement = nextKeyPoint.clone().add(carPosition).sub(currentKeyPoint);
            velocity = displacement.divideScalar(currentTime);
        }

        // begging of the program
        if(velocity.z === Infinity) velocity.z = 0;
        
        autonomousVehicle.updateAutonomous(velocity.z, carPosition, carQuaternion);
    }

}

MyRoute.prototype.isGroup = true;
export { MyRoute };
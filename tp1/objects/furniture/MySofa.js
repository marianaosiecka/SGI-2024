import * as THREE from 'three';


class MySofa extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
       @param {number} radius The radius of the upper backrest
       @param {number} height The height of the sofa
       @param {number} floorHeight The height of the floor (for positioning)
       @param {color} color The color of the sofa
    */ 
    constructor(app, radius, height, floorHeight, color) {      
        super();
        this.app = app;
        this.type = 'Group';
        
        this.radius = radius;
        this.height = height;
        //floorHeight é a altura do tapete
        this.floorHeight = floorHeight;
        
        this.sofaMaterial = new THREE.MeshPhongMaterial({ color: color , specular:"#777777", shininess:2});
        
        this.upperBack = new THREE.CylinderGeometry(radius, radius, height, 50, 50, false, 0, Math.PI);         
        this.upperBackMesh = new THREE.Mesh(this.upperBack, this.sofaMaterial);
        this.upperBackMesh.rotation.z = Math.PI/2;
        this.upperBackMesh.position.y = radius;
        this.add(this.upperBackMesh);

        this.legSize = radius/3;
        this.seatWidth = radius*1.35;
        this.seatHeight = radius/2.2;
        this.seatDepth = 2*radius;

        this.lowerBack = new THREE.BoxGeometry(height, radius + floorHeight/2, this.seatDepth);         
        this.lowerBackMesh = new THREE.Mesh(this.lowerBack, this.sofaMaterial);
        this.lowerBackMesh.position.y = (this.radius/2 + this.floorHeight/2);
        this.add(this.lowerBackMesh);

        this.seat = new THREE.BoxGeometry(this.seatWidth, this.seatHeight, this.seatDepth);         
        this.seatMesh = new THREE.Mesh(this.seat, this.sofaMaterial);
        this.seatMesh.position.x = this.seatWidth/2;
        this.seatMesh.position.y = this.floorHeight + this.legSize + radius/4.4;
        this.add(this.seatMesh);

        this.leg = new THREE.BoxGeometry(radius/4, this.legSize, radius/4);         
        this.leg1Mesh = new THREE.Mesh(this.leg, this.sofaMaterial);
        this.leg1Mesh.position.x = this.seatWidth - radius/8;
        this.leg1Mesh.position.z = this.seatDepth/2 - radius/8;
        this.leg1Mesh.position.y = this.floorHeight + this.legSize/2;
        this.add(this.leg1Mesh);

        this.leg2Mesh = new THREE.Mesh(this.leg, this.sofaMaterial);
        this.leg2Mesh.position.x = this.seatWidth - radius/8;
        this.leg2Mesh.position.z = this.seatWidth - radius/4 - this.seatDepth + 0.025;
        this.leg2Mesh.position.y = this.floorHeight + this.legSize/2;
        this.add(this.leg2Mesh);

        this.arm = new THREE.BoxGeometry(radius/5, height, this.seatDepth/1.75); 
        this.arm1Mesh = new THREE.Mesh(this.arm, this.sofaMaterial);
        this.arm1Mesh.rotation.y = Math.PI/2;
        this.arm1Mesh.position.x = this.seatMesh.position.x + 0.1;
        this.arm1Mesh.position.z = 0.9;
        this.arm1Mesh.position.y = radius;
        this.add(this.arm1Mesh);

        this.arm2Mesh = new THREE.Mesh(this.arm, this.sofaMaterial);
        this.arm2Mesh.rotation.y = Math.PI/2;
        this.arm2Mesh.position.x = this.seatMesh.position.x + 0.1;
        this.arm2Mesh.position.z = -0.9;
        this.arm2Mesh.position.y = radius;
        this.add(this.arm2Mesh);
    }

    /**
     * Set the position and add a pillow to the sofa
     * @param {THREE.Object3D} pillow The pillow to be added
     * @param {number} distanceFromBack The distance from the backrest to the pillow
     * @param {number} pillowHeight The height of the pillow
     * @param {number} distance The distance of the pillow from the initial position
     */
    setPillow(pillow, distanceFromBack, pillowHeight, distance) {
        pillow.position.x = this.height + 0.1 - distanceFromBack;
        pillow.position.y = this.seatMesh.position.y + this.seatHeight/2 + pillowHeight/2;
        pillow.position.z = this.position.z + distance;
        this.add(pillow);
    }
}


MySofa.prototype.isGroup = true;
export { MySofa };
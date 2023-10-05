import * as THREE from 'three';


class MySofa extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, radius, height, floorHeight, color) {      
        super();
        this.app = app;
        this.type = 'Group';
        
        this.radius = radius;
        this.height = height;
        //floorHeight é a altura do tapete
        this.floorHeight = floorHeight;
        
        this.sofaMaterial = new THREE.MeshPhongMaterial({ color: color , specular:"#FFFFFF", shininess:1});
        
        this.upperBack = new THREE.CylinderGeometry(radius, radius, height, 50, 50, false, 0, Math.PI);         
        this.upperBackMesh = new THREE.Mesh(this.upperBack, this.sofaMaterial);
        this.upperBackMesh.rotation.z = Math.PI/2;
        this.upperBackMesh.position.y = radius;
        this.add(this.upperBackMesh);

        this.lowerBack = new THREE.BoxGeometry(height, radius + floorHeight/2, 2*radius);         
        this.lowerBackMesh = new THREE.Mesh(this.lowerBack, this.sofaMaterial);
        this.lowerBackMesh.position.y = (this.radius/2 + this.floorHeight/2);
        this.add(this.lowerBackMesh);

        /*
        this.seat = new THREE.CylinderGeometry(radius, radius, radius/2 + floorHeight/2, 50, 50, false, 0, Math.PI);         
        this.seatMesh = new THREE.Mesh(this.seat, this.sofaMaterial);
        this.seatMesh.position.x = this.height/2;
        this.seatMesh.position.y = this.radius/2 + this.floorHeight/2;
        this.add(this.seatMesh);
        */

        const legSize = this.radius/3;
        const seatWidth = radius*1.35;
        const seatDepth = radius*1.6;

        this.seat = new THREE.BoxGeometry(seatWidth, radius/2.2,  seatDepth);         
        this.seatMesh = new THREE.Mesh(this.seat, this.sofaMaterial);
        this.seatMesh.position.x = seatWidth/2;
        this.seatMesh.position.y = this.floorHeight + legSize + radius/4.4;
        this.add(this.seatMesh);

        this.leg = new THREE.BoxGeometry(radius/4, legSize, radius/4);         
        this.leg1Mesh = new THREE.Mesh(this.leg, this.sofaMaterial);
        this.leg1Mesh.position.x = seatWidth - radius/8;
        this.leg1Mesh.position.z = seatDepth/2 - radius/8;
        this.leg1Mesh.position.y = this.floorHeight + legSize/2;
        this.add(this.leg1Mesh);

        this.leg2Mesh = new THREE.Mesh(this.leg, this.sofaMaterial);
        this.leg2Mesh.position.x = seatWidth - radius/8;
        this.leg2Mesh.position.z = seatDepth/2 - radius/8 - seatWidth;
        this.leg2Mesh.position.y = this.floorHeight + legSize/2;
        this.add(this.leg2Mesh);

        this.arm = new THREE.BoxGeometry(seatDepth/1.5, height, radius/4); 
        this.arm1Mesh = new THREE.Mesh(this.arm, this.sofaMaterial);
        this.arm1Mesh.position.x = //seatWidth - radius/8;
        this.arm1Mesh.position.z = //seatDepth/2 - radius/8 - seatWidth;
        this.arm1Mesh.position.y = 1//this.floorHeight + legSize/2;
        this.add(this.arm1Mesh);


        /*
        this.leg2 = new THREE.BoxGeometry(height, radius + floorHeight/2, 2*radius);         
        this.leg2BackMesh = new THREE.Mesh(this.leg2, this.sofaMaterial);
        this.leg2BackMesh.position.y = (this.radius/2 + this.floorHeight/2);
        this.add(this.leg2BackMesh);
        */
    }

    setPillow(pillow, pillowHeight, distance) {
        pillow.position.x = this.height + 0.1;
        pillow.position.y = this.seatMesh.position.y + pillowHeight;
        pillow.position.z = this.position.z + distance;
        this.add(pillow);
    }
}


MySofa.prototype.isGroup = true;
export { MySofa };
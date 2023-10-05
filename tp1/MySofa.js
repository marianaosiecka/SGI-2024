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
        this.lowerBackMesh.position.y = (this.height + this.floorHeight/2);
        this.add(this.lowerBackMesh);

        this.seat = new THREE.CylinderGeometry(radius, radius, radius + floorHeight/2, 50, 50, false, 0, Math.PI);         
        this.seatMesh = new THREE.Mesh(this.seat, this.sofaMaterial);
        this.seatMesh.position.x = this.height/2;
        this.seatMesh.position.y = (this.height + this.floorHeight/2);
        this.add(this.seatMesh);
    }

    setPillow(pillow, pillowHeight, distance) {
        pillow.position.x = this.height;
        pillow.position.y = this.seatMesh.position.y + (this.radius + this.floorHeight/2)/2 + pillowHeight/2;
        pillow.position.z = this.position.z + distance;
        this.add(pillow);
    }
}


MySofa.prototype.isGroup = true;
export { MySofa };
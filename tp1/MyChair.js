import * as THREE from 'three';

class MyChair extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, width, height, depth, xPos, yPos, zPos, rotation, color) {
        super();
        this.app = app;
        this.type = 'Group';
        
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.xPos = xPos;
        this.yPos = yPos;
        this.zPos = zPos;
        this.rot = rotation;
        this.color = color;

        //tampo da mesa     
        this.seat = new THREE.BoxGeometry(width, height, depth); 
        this.chairMaterial = new THREE.MeshPhongMaterial({ color: this.color});
        this.seatMesh = new THREE.Mesh(this.seat, this.chairMaterial);
        this.seatMesh.rotation.x = rotation;
        this.seatMesh.position.x = xPos;
        this.seatMesh.position.y = yPos;
        this.seatMesh.position.z = zPos;
        this.add(this.seatMesh);

        this.legPositions = [
            [this.xPos + this.width/3, this.yPos/2, this.zPos - this.width/3], 
            [this.xPos - this.width/3, this.yPos/2, this.zPos +  this.width/3], 
            [this.xPos + this.width/3, this.yPos/2, this.zPos +  this.width/3], 
            [this.xPos - this.width/3, this.yPos/2, this.zPos -  this.width/3]
        ]
    }

    buildLegs (width, height, depth, color) {
        for(let i=0; i<4; i++) {
            this.leg = new THREE.BoxGeometry(width, height, depth);         
            this.legMaterial = new THREE.MeshPhongMaterial({ color: color });
            this.legMesh = new THREE.Mesh(this.leg, this.legMaterial);
            this.legMesh.rotation.x = this.rot;
            this.legMesh.position.x = this.legPositions[i][0];
            this.legMesh.position.y = this.legPositions[i][1];
            this.legMesh.position.z = this.legPositions[i][2];
            this.add(this.legMesh);
        }
    }

    buildBackRest (width, height, depth, color) {
        this.back = new THREE.BoxGeometry(width, height, depth); 
        this.backMaterial = new THREE.MeshPhongMaterial({ color: color});
        this.backMesh = new THREE.Mesh(this.back, this.backMaterial);
        this.backMesh.position.x = this.xPos;
        this.backMesh.position.y = this.yPos + height/2;
        this.backMesh.position.z = this.zPos + this.width/2;
        this.add(this.backMesh);
    }

    flipChair() {
        this.backMesh.position.z = this.zPos - this.width/2;
    }

    changeColorSeat(color) {
        this.seatMesh.material.color = new THREE.Color(color);
    }

    changeColorBack(color) {
        this.backMesh.material.color = new THREE.Color(color);
    }
}


MyChair.prototype.isGroup = true;
export { MyChair };
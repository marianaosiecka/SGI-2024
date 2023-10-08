import * as THREE from 'three';

class MyChair extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, widthSeat, heightSeat, depthSeat, heightChair, color) {
        super();
        this.app = app;
        this.type = 'Group';
        
        this.heightSeat = heightSeat;
        this.widthSeat = widthSeat;
        this.depthSeat = depthSeat;
        this.heightChair = heightChair;
        this.color = color;

        this.chairMaterial = new THREE.MeshPhongMaterial({ color: this.color, specular:this.color, shininess:5});
     
        this.seat = new THREE.BoxGeometry(widthSeat, heightSeat, depthSeat); 
        this.seatMesh = new THREE.Mesh(this.seat, this.chairMaterial);
        this.seatMesh.position.y = heightChair;
        this.add(this.seatMesh);

        this.legPositions = [
            [this.depthSeat/3, this.heightChair/2, -this.widthSeat/3], 
            [-this.depthSeat/3, this.heightChair/2, this.widthSeat/3], 
            [this.depthSeat/3, this.heightChair/2, this.widthSeat/3], 
            [-this.depthSeat/3, this.heightChair/2, -this.widthSeat/3]
        ]
    }

    buildLegs (width, height, depth, color) {
        this.leg = new THREE.BoxGeometry(width, height, depth);         
        this.legMaterial = new THREE.MeshPhongMaterial({ color: color , specular:color, shininess:3});
        for(let i=0; i<4; i++) {
            this.legMesh = new THREE.Mesh(this.leg, this.legMaterial);
            this.legMesh.position.x = this.legPositions[i][0];
            this.legMesh.position.y = this.legPositions[i][1];
            this.legMesh.position.z = this.legPositions[i][2];
            this.add(this.legMesh);
        }
    }

    buildBackRest (width, height, depth, color) {
        this.back = new THREE.BoxGeometry(width, height, depth); 
        this.backMaterial = new THREE.MeshPhongMaterial({ color: color , specular:color, shininess:3});
        this.backMesh = new THREE.Mesh(this.back, this.backMaterial);
        this.backMesh.position.y = this.heightChair + height/2 + this.heightSeat/2;
        this.backMesh.position.x = -this.widthSeat/2 + 0.05;
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
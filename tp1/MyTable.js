import * as THREE from 'three';

class MyTable extends THREE.Object3D  {

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
        this.color = color;

        //tampo da mesa     
        this.top = new THREE.BoxGeometry(width, height, depth); 
        this.topMaterial = new THREE.MeshPhongMaterial({ color: this.color, 
            specular: "#000000", emissive: "#000000", shininess: 90 });
        this.topMesh = new THREE.Mesh(this.top, this.topMaterial);
        this.topMesh.rotation.x = rotation;
        this.topMesh.position.x = xPos;
        this.topMesh.position.y = yPos;
        this.topMesh.position.z = zPos;
        this.add(this.topMesh);

        this.legPositions = [
            [this.xPos + this.height/2, this.yPos/2, this.zPos + this.width/2 - 0.7], 
            [this.xPos - this.height/2, this.yPos/2, this.zPos + this.width/2 - 0.7], 
            [this.xPos + this.height/2, this.yPos/2, this.zPos - (this.width/2 - 0.7)], 
            [this.xPos -this.height/2, this.yPos/2, this.zPos - (this.width/2 - 0.7)]
        ]
    }

    
    buildLegs (radiusTop, radiusBottom, radialSegments) {
        for(let i=0; i<4; i++) {
            this.leg = new THREE.CylinderGeometry(radiusTop, radiusBottom, this.yPos, radialSegments);         
            this.legMaterial = new THREE.MeshBasicMaterial({ color: this.color });
            this.legMesh = new THREE.Mesh(this.leg, this.legMaterial);
            this.legMesh.position.x = this.legPositions[i][0];
            this.legMesh.position.y = this.legPositions[i][1];
            this.legMesh.position.z = this.legPositions[i][2];
            this.add(this.legMesh);
        }
    }

    changeColorTop(color) {
        this.topMesh.material.color = new THREE.Color(color);
    }
}


MyTable.prototype.isGroup = true;
export { MyTable };
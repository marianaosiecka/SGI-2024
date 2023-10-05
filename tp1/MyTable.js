import * as THREE from 'three';

class MyTable extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, width, height, depth, xPos, yPos, zPos, rotation, topTexture) {
        super();
        this.app = app;
        this.type = 'Group';
        
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.xPos = xPos;
        this.yPos = yPos;
        this.zPos = zPos;
        this.topTexture = topTexture;
        this.topTexture.wrapS = THREE.RepeatWrapping;
        this.topTexture.wrapT = THREE.RepeatWrapping;
        
        //tampo da mesa     
        this.top = new THREE.BoxGeometry(width, height, depth); 
        this.tableMaterial = new THREE.MeshPhongMaterial({ color: "#FFFFFF", specular:"#71381D", shininess: 8, map: this.topTexture });
        this.topMesh = new THREE.Mesh(this.top, this.tableMaterial);
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

    
    buildLegs (radiusTop, radiusBottom, radialSegments, legColor) {
        this.leg = new THREE.CylinderGeometry(radiusTop, radiusBottom, this.yPos, radialSegments);         
        this.legMaterial = new THREE.MeshPhongMaterial({ color: legColor, specular:"#7777777", shininess:10});
        for(let i=0; i<4; i++) {
            this.legMesh = new THREE.Mesh(this.leg, this.legMaterial);
            this.legMesh.position.x = this.legPositions[i][0];
            this.legMesh.position.y = this.legPositions[i][1];
            this.legMesh.position.z = this.legPositions[i][2];
            this.add(this.legMesh);
        }
    }

}


MyTable.prototype.isGroup = true;
export { MyTable };
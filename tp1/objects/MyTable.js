import * as THREE from 'three';

class MyTable extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, widthTop, heightTop, depthTop, heightTable, topTexture) {
        super();
        this.app = app;
        this.type = 'Group';
        
        this.heightTop = heightTop;
        this.widthTop = widthTop;
        this.depthTop = depthTop;
        this.heightTable = heightTable;

        this.topTexture = topTexture;
        this.topTexture.wrapS = THREE.RepeatWrapping;
        this.topTexture.wrapT = THREE.RepeatWrapping;

        this.tableMaterial = new THREE.MeshPhongMaterial({ color: "#FFFFFF", specular:"#71381D", shininess: 8, map: this.topTexture });
        
        //tampo da mesa     
        this.top = new THREE.BoxGeometry(this.widthTop, this.heightTop, this.depthTop); 
        this.topMesh = new THREE.Mesh(this.top, this.tableMaterial);
        this.topMesh.position.y = this.heightTable;
        this.add(this.topMesh);

        const distanceLegToEdge = 0.5;

        this.legPositions = [
            [this.widthTop/2 - distanceLegToEdge, this.heightTable/2, this.depthTop/2 - distanceLegToEdge], 
            [-this.widthTop/2 + distanceLegToEdge, this.heightTable/2, this.depthTop/2 - distanceLegToEdge], 
            [this.widthTop/2 - distanceLegToEdge, this.heightTable/2, -this.depthTop/2 + distanceLegToEdge], 
            [-this.widthTop/2 + distanceLegToEdge, this.heightTable/2, -this.depthTop/2 + distanceLegToEdge]
        ]

    }

    
    buildLegs (radiusTop, radiusBottom, radialSegments, legColor) {
        this.leg = new THREE.CylinderGeometry(radiusTop, radiusBottom, this.heightTable, radialSegments);         
        this.legMaterial = new THREE.MeshPhongMaterial({ color: legColor, specular:"#777777", shininess:10});
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
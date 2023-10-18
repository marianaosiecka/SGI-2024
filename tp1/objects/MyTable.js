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

        let topUVRate = widthTop / depthTop;
        let textureUVRate = 2000 / 1333; // image dimensions
        let textureRepeatU = 1;
        let textureRepeatV = textureRepeatU * topUVRate * textureUVRate;
        this.topTexture = topTexture;
        this.topTexture.wrapS = THREE.RepeatWrapping;
        this.topTexture.wrapT = THREE.RepeatWrapping;
        this.topTexture.repeat.set(textureRepeatU, textureRepeatV );
        this.topTexture.offset = new THREE.Vector2(0,0);

        this.tableMaterial = new THREE.MeshPhongMaterial({ color: "#FFFFFF", specular:"#71381D", shininess: 8, map: this.topTexture });
        
        //tampo da mesa     
        this.top = new THREE.BoxGeometry(this.widthTop, this.heightTop, this.depthTop); 
        this.topMesh = new THREE.Mesh(this.top, this.tableMaterial);
        this.topMesh.position.y = this.heightTable;
        this.topMesh.castShadow = true;
        this.topMesh.receiveShadow = true;
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
            this.legMesh.castShadow = true;
            this.legMesh.receiveShadow = true;
            this.add(this.legMesh);
        }
    }

}


MyTable.prototype.isGroup = true;
export { MyTable };
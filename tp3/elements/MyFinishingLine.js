import * as THREE from 'three';

class MyFinishingLine extends THREE.Object3D {
    /**
     * constructor for MyFinishingLine class
     * @param startingPoint point where the race starts
     * @param trackWidth width of the track
     */
    constructor(startingPoint, trackWidth) {
        super();

        let pillarGeo = new THREE.CylinderGeometry( 0.3, 0.3, 16.2, 32 );
        let pillarMat = new THREE.MeshPhongMaterial( {color: "#000000", shininess: 5} );
        
        let pillarRight = new THREE.Mesh( pillarGeo, pillarMat );
        pillarRight.position.set(startingPoint.x - 10, startingPoint.y + 7.15, startingPoint.z - trackWidth*1.25);
        
        let pillarLeft = new THREE.Mesh( pillarGeo, pillarMat );
        pillarLeft.position.set(startingPoint.x - 10, startingPoint.y + 7.15, startingPoint.z + trackWidth*2.05);
        
        let panelGeo = new THREE.BoxGeometry(0.4, 3.5 ,trackWidth*3.25);
        let texture1 = new THREE.TextureLoader().load("textures/checkers.jpg")
        texture1.repeat.set(2, 0.5)
        texture1.wrapS = THREE.RepeatWrapping;
        texture1.wrapT = THREE.RepeatWrapping;
        let panelMat = new THREE.MeshPhongMaterial( {map:texture1} );
        let panel = new THREE.Mesh( panelGeo, panelMat );
        panel.position.set(startingPoint.x - 10, startingPoint.y + 13.5, startingPoint.z + trackWidth/2.5);
        
        let texture2 = new THREE.TextureLoader().load("textures/checkers.jpg")
        texture2.repeat.set(0.17, 2)
        texture2.wrapS = THREE.RepeatWrapping;
        texture2.wrapT = THREE.RepeatWrapping;
        let lineMat = new THREE.MeshPhongMaterial( {map:texture2} );

        let finishingLineGeo = new THREE.BoxGeometry(1.2, 0.05, trackWidth*3.25)
        this.finishingLine = new THREE.Mesh( finishingLineGeo, lineMat );
        this.finishingLine.position.set(startingPoint.x - 10, startingPoint.y-0.75, startingPoint.z + trackWidth/2.5);

        this.add(pillarRight);
        this.add(pillarLeft);
        this.add(panel);
        this.add(this.finishingLine);
    }

}

MyFinishingLine.prototype.isGroup = true;
export { MyFinishingLine };
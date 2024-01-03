import * as THREE from 'three';

/**
 * MySkyscraper
 * @constructor
 * @param app
 * @param parkingLotLines - If the skyscraper has parking lot lines
 * @param height - Height of the skyscraper
 * @param width - Width of the skyscraper
 * @param numSides - Number of sides of the skyscraper
 * @param colorBulding - Color of the skyscraper
 * @param windowHeight - Height of the windows
 * @param colorWindows - Color of the windows
 * @param numParkingLotSpaces - Number of parking lot spaces
 * @param offset - Offset of the parking lot lines
 * @extends THREE.Object3D
 */
class MySkyscraper extends THREE.Object3D {
    constructor(app, parkingLotLines, height, width, numSides, colorBulding, windowHeight, colorWindows, numParkingLotSpaces, offset = 0) {
        super();
        this.app = app;
        this.height = height;
        this.width = width;
        this.numParkingLotSpaces = numParkingLotSpaces;

        let geometry = new THREE.CylinderGeometry( width, width, height, numSides );
        let material = new THREE.MeshPhongMaterial( {color: colorBulding} );
        this.building = new THREE.Mesh( geometry, material );
        this.building.position.y = -(height - 5) + height / 2; 
        this.add(this.building);

        let sideWidth = width * Math.sin(Math.PI / numSides) * 2;

        let windowWidth = sideWidth / 2; // put 2 windows per side
        const windowSideBorder = windowWidth / 10
        windowWidth -= 3 * windowSideBorder;
        const windowTopBorder = windowHeight / 4;

        // create windows
        let windows = new THREE.Object3D();
        let windowMaterial = new THREE.MeshPhongMaterial( {color: colorWindows} );
        let windowGeometry1 = new THREE.BoxGeometry( windowWidth, windowHeight, 0.1 );
        let windowGeometry2 = new THREE.BoxGeometry( windowWidth, windowHeight, 0.1 );
        let windowMesh1 = new THREE.Mesh( windowGeometry1, windowMaterial );
        windowMesh1.position.x = windowWidth / 2 + windowSideBorder;
        let windowMesh2 = new THREE.Mesh( windowGeometry2, windowMaterial );
        windowMesh2.position.x = -windowWidth / 2 - windowSideBorder;
        windows.add(windowMesh1);
        windows.add(windowMesh2);

        for(let i = 0; i < numSides; i++){
            let angle = i * 2 * Math.PI / numSides;
            angle -= Math.PI / numSides;
            for(let j = 0; j < height - windowHeight - windowTopBorder; j += windowHeight + windowTopBorder){
                let window = windows.clone();
                window.rotation.y = angle;
                window.position.x = (width + windowWidth + offset) / 2 * Math.sin(angle)
                window.position.y -= j
                window.position.z = (width + windowWidth + offset) / 2 * Math.cos(angle);
                this.add(window);
            }
        }

        // add parking lot
        const parkingLotTexture = new THREE.TextureLoader().load('textures/parking_lot_texture.png');
        const parkingLotBumpTexture = new THREE.TextureLoader().load('textures/parking_lot_bump_texture.jpg');
        parkingLotTexture.wrapS = THREE.RepeatWrapping;
        parkingLotTexture.wrapT = THREE.RepeatWrapping;
        parkingLotTexture.repeat.set(width, width);

        const parkingLotGeometry = new THREE.CylinderGeometry( width, width, 0.01, numSides );
        const parkingLotMaterial = new THREE.MeshPhongMaterial({ map:parkingLotTexture, bumpMap:parkingLotBumpTexture, bumpScale:2, side: THREE.DoubleSide });
        const parkingLot = new THREE.Mesh(parkingLotGeometry, parkingLotMaterial);
        parkingLot.position.y = 5.2;
        this.add(parkingLot);

        if(parkingLotLines){
            this.lineWidth = width*1.2;

            this.turnParkingLot = (numParkingLotSpaces === 2) ? Math.PI/4 : 0;

            let horizontalLineGeo = new THREE.PlaneGeometry( 0.5, this.lineWidth );
            let lineMat = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
            this.horizontalLine = new THREE.Mesh( horizontalLineGeo, lineMat );
            this.horizontalLine.rotation.x = -Math.PI / 2;
            this.horizontalLine.rotation.z = this.turnParkingLot;
            this.horizontalLine.position.y = 5.3;
            if(numParkingLotSpaces !== 2) {
                this.horizontalLine.position.x = -width / 2 + 1;
            }
            else {
                this.horizontalLine.position.z = 5;
                this.horizontalLine.position.x = -5;
            }
            this.add(this.horizontalLine);

            let verticalLineGeo = new THREE.PlaneGeometry( 0.5, width/1.8 );

            if(numParkingLotSpaces === 2) {
                for (let i = 0; i < numParkingLotSpaces + 1; i++) {
                    let verticalLine = new THREE.Mesh( verticalLineGeo, lineMat );
                    verticalLine.rotation.x = -Math.PI / 2;
                    verticalLine.rotation.z = -Math.PI / 2 + this.turnParkingLot;
                    verticalLine.position.x = (-this.lineWidth/2 + i * (this.lineWidth / numParkingLotSpaces))/1.5;
                    verticalLine.position.z = (-this.lineWidth/2 + i * (this.lineWidth / numParkingLotSpaces))/1.5;
                    verticalLine.position.y = 5.3;
                    this.add(verticalLine);
                }
            }
            else{
                for (let i = 0; i < numParkingLotSpaces + 1; i++) {
                    let verticalLine = new THREE.Mesh( verticalLineGeo, lineMat );
                    verticalLine.rotation.x = -Math.PI / 2;
                    verticalLine.rotation.z = -Math.PI / 2 + this.turnParkingLot;
                    verticalLine.position.x = -3;
                    verticalLine.position.z = -this.lineWidth/2 + i * (this.lineWidth / numParkingLotSpaces);
                    verticalLine.position.y = 5.3;
                    this.add(verticalLine);
                }
            }
        }
        this.app.scene.add(this)
    }

    /**
     * adds an object to the skyscraper top
     * @param object - Object to add
     * @param rotation - Rotation of the object
     * @param y - Y position of the object
     * @param offset - Offset of the object
     */
    setObject(object, rotation, y, offset) {
        object.rotation.y = Math.PI + Math.PI/2 - rotation - this.turnParkingLot;
        object.position.y = y;
        if(this.numParkingLotSpaces !== 2){
            object.position.x = this.position.x - this.lineWidth/8;
            object.position.z = this.position.z - this.width/2 + 1.5 + offset;
        }
        else{
            object.rotation.z = rotation;
            object.position.x = this.position.x - this.lineWidth/8 + offset - 3.5;
            object.position.z = this.position.z - this.width/2 + 1.5 + offset + 3.5;
        }
        this.app.scene.add(object);
    }
}

export { MySkyscraper}
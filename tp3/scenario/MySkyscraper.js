import * as THREE from 'three';

class MySkyscraper extends THREE.Object3D {
    constructor(app, height, width, numSides, colorBulding, windowHeight, colorWindows, layer, ups = 0) {
        super();
        this.app = app;
        this.height = height;
        this.width = width;

        let geometry = new THREE.CylinderGeometry( width, width, height, numSides );
        let material = new THREE.MeshPhongMaterial( {color: colorBulding} );
        this.building = new THREE.Mesh( geometry, material );
        this.building.position.y = -(height - 5) + height / 2;
        this.add(this.building);

        let sideWidth = width * Math.sin(Math.PI / numSides) * 2;

        let windowWidth = sideWidth / 2;
        const windowSideBorder = windowWidth / 10
        windowWidth -= 3 * windowSideBorder;
        const windowTopBorder = windowHeight / 4;

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
                window.position.x = (width + windowWidth + ups) / 2 * Math.sin(angle)
                window.position.y -= j
                window.position.z = (width + windowWidth + ups) / 2 * Math.cos(angle);
                this.add(window);
            }
        }
    
        const parkingLotTexture = new THREE.TextureLoader().load('textures/parking_lot_texture.png');
        const parkingLotBumpTexture = new THREE.TextureLoader().load('textures/parking_lot_bump_texture.jpg');
        parkingLotTexture.wrapS = THREE.RepeatWrapping;
        parkingLotTexture.wrapT = THREE.RepeatWrapping;
        parkingLotTexture.repeat.set(width, width);

        const parkingLotGeometry = new THREE.CylinderGeometry( width, width, 0.01, numSides );
        const parkingLotMaterial = new THREE.MeshPhongMaterial({ map:parkingLotTexture, bumpMap:parkingLotBumpTexture, bumpScale:2, side: THREE.DoubleSide });
        const parkingLot = new THREE.Mesh(parkingLotGeometry, parkingLotMaterial);
        parkingLot.position.y = 5.15;
        this.add(parkingLot);

        this.lineWidth = width*1.2;

        let horizontalLineGeo = new THREE.PlaneGeometry( 0.5, this.lineWidth );
        let lineMat = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
        let horizontalLine = new THREE.Mesh( horizontalLineGeo, lineMat );
        horizontalLine.rotation.x = -Math.PI / 2;
        horizontalLine.position.x = -width / 2 + 1;
        horizontalLine.position.y = 5.25;

        let verticalLineGeo = new THREE.PlaneGeometry( 0.5, width/1.8 );
        let verticalLine1 = new THREE.Mesh( verticalLineGeo, lineMat );
        verticalLine1.rotation.x = -Math.PI / 2;
        verticalLine1.rotation.z = -Math.PI / 2;
        verticalLine1.position.x = -3;
        verticalLine1.position.y = 5.25;

        let verticalLine2 = new THREE.Mesh( verticalLineGeo, lineMat );
        verticalLine2.rotation.x = -Math.PI / 2;
        verticalLine2.rotation.z = -Math.PI / 2;
        verticalLine2.position.x = -3;
        verticalLine2.position.z = -this.lineWidth/4;
        verticalLine2.position.y = 5.25;

        let verticalLine3 = new THREE.Mesh( verticalLineGeo, lineMat );
        verticalLine3.rotation.x = -Math.PI / 2;
        verticalLine3.rotation.z = -Math.PI / 2;
        verticalLine3.position.x = -3;
        verticalLine3.position.z = -this.lineWidth/2;
        verticalLine3.position.y = 5.25;

        let verticalLine4 = new THREE.Mesh( verticalLineGeo, lineMat );
        verticalLine4.rotation.x = -Math.PI / 2;
        verticalLine4.rotation.z = -Math.PI / 2;
        verticalLine4.position.x = -3;
        verticalLine4.position.z = this.lineWidth/4;
        verticalLine4.position.y = 5.25;

        let verticalLine5 = new THREE.Mesh( verticalLineGeo, lineMat );
        verticalLine5.rotation.x = -Math.PI / 2;
        verticalLine5.rotation.z = -Math.PI / 2;
        verticalLine5.position.x = -3;
        verticalLine5.position.z = this.lineWidth/2;
        verticalLine5.position.y = 5.25;

        this.add(horizontalLine);
        this.add(verticalLine1);
        this.add(verticalLine2);
        this.add(verticalLine3);
        this.add(verticalLine4);
        this.add(verticalLine5);

        this.app.scene.add(this)
    }

    setVehicle(vehicle, rotation, y, offset) {
        vehicle.rotation.y = Math.PI + Math.PI/2 - rotation;
        vehicle.position.x = this.position.x - this.lineWidth/8;
        vehicle.position.y = y;
        vehicle.position.z = this.position.z - this.width/2 + 1.5 + offset;
        this.app.scene.add(vehicle);
    }
}

export { MySkyscraper}
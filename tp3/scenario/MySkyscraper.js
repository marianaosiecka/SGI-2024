import * as THREE from 'three';

class MySkyscraper {
    constructor(app, height, width, numSides, colorBulding, windowHeight, colorWindows, layer, ups = 0) {
        this.app = app;
        this.skyscraper = new THREE.Object3D();

        let geometry = new THREE.CylinderGeometry( width, width, height, numSides );
        let material = new THREE.MeshPhongMaterial( {color: colorBulding} );
        this.building = new THREE.Mesh( geometry, material );
        this.building.position.y = -(height - 5) + height / 2;
        this.skyscraper.add(this.building);

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
                this.skyscraper.add(window);
            }
        }
    
       this.app.scene.add(this.skyscraper)
    }
}

export { MySkyscraper}
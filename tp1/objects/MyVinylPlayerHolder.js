import * as THREE from 'three';

class MyVinylPlayerHolder extends THREE.Object3D  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app, width, height, depth, color) {
        super();
        this.app = app;
        this.type = 'Group';

        this.width = width;
        this.height = height;
        this.depth = depth;

        // FURNITURE
        this.furnitureMaterial = new THREE.MeshPhongMaterial({ color: color });

        const border = depth/10;
        this.border = border;
        const squareHeight = height/2;
        this.squareHeight = squareHeight
        const legsHeight = height/2;
        const squareY = (legsHeight + height) / 2;
        this.squareY = squareY

        this.upDown = new THREE.BoxGeometry(depth, border, width);
        this.upMesh = new THREE.Mesh(this.upDown, this.furnitureMaterial);
        this.upMesh.position.y = height
        this.downMesh = new THREE.Mesh(this.upDown, this.furnitureMaterial);
        this.downMesh.position.y = legsHeight;
        this.downMesh.castShadow = true
        this.downMesh.receiveShadow = true

        this.sides = new THREE.BoxGeometry(depth, squareHeight + border, border);
        this.leftMesh = new THREE.Mesh(this.sides, this.furnitureMaterial);
        this.leftMesh.position.y = this.squareY
        this.leftMesh.position.z = width/2;
        this.rightMesh = new THREE.Mesh(this.sides, this.furnitureMaterial);
        this.rightMesh.position.y = this.squareY
        this.rightMesh.position.z = -width/2;

        // LEGS
        this.leg = new THREE.CylinderGeometry(depth/20, depth/20, height/2);
        this.frontLeftLegMesh = new THREE.Mesh(this.leg, this.furnitureMaterial);
        this.frontLeftLegMesh.rotation.x = - Math.PI/6
        this.frontLeftLegMesh.position.y = legsHeight/2;
        this.frontLeftLegMesh.position.x = depth/4;
        this.frontLeftLegMesh.position.z = width/3

        this.backLeftLegMesh = new THREE.Mesh(this.leg, this.furnitureMaterial);
        this.backLeftLegMesh.rotation.x = - Math.PI/6;
        this.backLeftLegMesh.position.y = legsHeight/2;
        this.backLeftLegMesh.position.x = -depth/4;
        this.backLeftLegMesh.position.z = width/3;

        this.leg = new THREE.CylinderGeometry(depth/20, depth/20, height/2);
        this.frontRightLegMesh = new THREE.Mesh(this.leg, this.furnitureMaterial);
        this.frontRightLegMesh.rotation.x = Math.PI/6
        this.frontRightLegMesh.position.y = legsHeight/2;
        this.frontRightLegMesh.position.x = depth/4;
        this.frontRightLegMesh.position.z = -width/3

        this.backRightLegMesh = new THREE.Mesh(this.leg, this.furnitureMaterial);
        this.backRightLegMesh.rotation.x = Math.PI/6;
        this.backRightLegMesh.position.y = legsHeight/2;
        this.backRightLegMesh.position.x = -depth/4;
        this.backRightLegMesh.position.z = -width/3;

        
        this.add(this.upMesh)
        this.add(this.downMesh)
        this.add(this.leftMesh);
        this.add(this.rightMesh);
        this.add(this.frontLeftLegMesh);
        this.add(this.backLeftLegMesh);
        this.add(this.frontRightLegMesh);
        this.add(this.backRightLegMesh);
    }

    buildPlayer(colorBox, colorCenterVinyl){
        let playerWidth = this.depth - this.width/10;
        const playerHeight = this.height/8;
        const playerDepth = playerWidth + playerWidth/3;

        this.blackMaterial = new THREE.MeshBasicMaterial({color: 0x000000})


        // BOX
        this.playerBox = new THREE.BoxGeometry(playerWidth, playerHeight, playerDepth);
        this.playerMaterial = new THREE.MeshPhongMaterial({ color: colorBox});
        this.playerBoxMesh = new THREE.Mesh(this.playerBox, this.playerMaterial);
        const playerBoxY = this.height + playerHeight/2 + 0.09;
        this.playerBoxMesh.position.y = playerBoxY;

        // LEGS
        this.playerLeg = new THREE.SphereGeometry(0.09, 10, 10)
        this.playerFrontLeftLegMesh = new THREE.Mesh(this.playerLeg, this.blackMaterial)
        this.playerFrontLeftLegMesh.position.y = this.height + this.border/2 + 0.09;
        this.playerFrontLeftLegMesh.position.z = 3*(playerDepth/2)/4;
        this.playerFrontLeftLegMesh.position.x = 3*(playerWidth/2)/4;

        this.playerBackLeftLegMesh = new THREE.Mesh(this.playerLeg, this.blackMaterial)
        this.playerBackLeftLegMesh.position.y = this.height + this.border/2 + 0.09;
        this.playerBackLeftLegMesh.position.z = 3*(playerDepth/2)/4;
        this.playerBackLeftLegMesh.position.x = -3*(playerWidth/2)/4;

        this.playerFrontRightLegMesh = new THREE.Mesh(this.playerLeg, this.blackMaterial)
        this.playerFrontRightLegMesh.position.y = this.height + this.border/2 + 0.09;
        this.playerFrontRightLegMesh.position.z = -3*(playerDepth/2)/4;
        this.playerFrontRightLegMesh.position.x = 3*(playerWidth/2)/4;

        this.playerBackRightLegMesh = new THREE.Mesh(this.playerLeg, this.blackMaterial)
        this.playerBackRightLegMesh.position.y = this.height + this.border/2 + 0.09;
        this.playerBackRightLegMesh.position.z = -3*(playerDepth/2)/4;
        this.playerBackRightLegMesh.position.x = -3*(playerWidth/2)/4;


        // VINYL
        let vinylShape = new THREE.Shape();
        vinylShape.absarc(0, 0, playerWidth/2 + playerWidth/10, 0, Math.PI*2, false)
        this.vinyl = new THREE.ShapeGeometry(vinylShape);
        this.vinylMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, specular: 0x000000, shininess: 100 })
        this.vinylMesh = new THREE.Mesh(this.vinyl, this.vinylMaterial)
        this.vinylMesh.rotation.x = -Math.PI/2
        this.vinylMesh.position.y = playerBoxY + playerHeight/2 + 0.06;
        this.vinylMesh.position.x = playerWidth/9;
        this.vinylMesh.position.z = playerWidth/9;
        
        let vinylCenterShape = new THREE.Shape();
        vinylCenterShape.absarc(0, 0, (playerWidth/2 + playerWidth/10)/3, 0, Math.PI*2, false)
        this.vinylCenter = new THREE.ShapeGeometry(vinylCenterShape);
        this.vinylCenterMaterial = new THREE.MeshBasicMaterial({ color: colorCenterVinyl })
        this.vinyCenterMesh = new THREE.Mesh(this.vinylCenter, this.vinylCenterMaterial)
        this.vinyCenterMesh.rotation.x = -Math.PI/2
        this.vinyCenterMesh.position.y = playerBoxY + playerHeight/2 + 0.06 + 0.01;
        this.vinyCenterMesh.position.x = playerWidth/9;
        this.vinyCenterMesh.position.z = playerWidth/9;

        // VOLUME
        this.volume = new THREE.CylinderGeometry(playerWidth/16, playerWidth/16, playerHeight/3)
        this.volumeMesh = new THREE.Mesh(this.volume, this.blackMaterial);
        this.volumeMesh.position.y = playerBoxY + playerHeight/2 + playerHeight/8
        this.volumeMesh.position.x = playerWidth/3
        this.volumeMesh.position.z = -4*playerDepth/10

        // PLAY
        const downCylinderHeight = 2*playerHeight/3
        this.downCylinder = new THREE.CylinderGeometry(playerDepth/25, playerDepth/25, downCylinderHeight);
        this.downCylinderMesh = new THREE.Mesh(this.downCylinder, this.blackMaterial);
        const downCylinderY = playerBoxY + playerHeight/2 + playerHeight/3
        this.downCylinderMesh.position.y = downCylinderY
        this.downCylinderMesh.position.x = -playerWidth/3
        this.downCylinderMesh.position.z = -4*playerDepth/10

        this.upCylinder = new THREE.CylinderGeometry(0.01, 0.01, playerWidth)
        this.upCylinderMesh = new THREE.Mesh(this.upCylinder, this.blackMaterial)
        this.upCylinderMesh.rotation.x = Math.PI/2
        this.upCylinderMesh.rotation.z = - Math.PI / 3
        this.upCylinderMesh.position.y = downCylinderY + downCylinderHeight/2 + 0.01
        this.upCylinderMesh.position.x = -playerWidth/3 - Math.sin(- Math.PI/3) * playerWidth/2
        this.upCylinderMesh.position.z = -4*playerDepth/10 + Math.cos(-Math.PI/3) * playerWidth/2


        this.add(this.playerBoxMesh)
        this.add(this.playerFrontLeftLegMesh)
        this.add(this.playerBackLeftLegMesh);
        this.add(this.playerFrontRightLegMesh)
        this.add(this.playerBackRightLegMesh)
        this.add(this.vinylMesh)
        this.add(this.vinyCenterMesh)
        this.add(this.volumeMesh)
        this.add(this.downCylinderMesh)
        this.add(this.upCylinderMesh)

    }

    buildCovers(coverColors){
        this.coverHeight = this.squareHeight - this.border/2
        this.cover = new THREE.BoxGeometry(0.05, this.squareHeight - this.border/2, this.squareHeight - this.border/2);
        const coverSpacing = 0.06;
        for(let i = 0; i < coverColors.length-1; i++){
            this.coverMaterial = new THREE.MeshBasicMaterial({ color: coverColors[i] })
            this.coverMesh = new THREE.Mesh(this.cover, this.coverMaterial);
            this.coverMesh.rotation.y = Math.PI / 2;
            this.coverMesh.position.y = this.squareY;
            this.coverMesh.position.z = this.width/2 - this.border/2 - 0.04 - (i*coverSpacing);
            this.add(this.coverMesh)
        }

        this.lastCoverMaterial = new THREE.MeshBasicMaterial({ color: coverColors[coverColors.length-1] });
        this.lastCoverMesh = new THREE.Mesh(this.cover, this.lastCoverMaterial);
        this.lastCoverMesh.rotation.y = Math.PI/2;
        this.lastCoverMesh.rotation.x = Math.PI/8
        this.lastCoverMesh.position.y = this.squareY;
        this.lastCoverMesh.position.z = this.width/2 - this.border/2 - 0.08 - (coverColors.length)*coverSpacing
        this.lastCoverMesh.castShadow = true;
        this.lastCoverMesh.receiveShadow = true;
        this.add(this.lastCoverMesh)
    }

    buildNowPlayingShelf(color, coverTexture){
        this.shelf1 = new THREE.BoxGeometry(0.3, 0.03, 0.9);
        this.shelfMaterial = new THREE.MeshPhongMaterial({ color: color })
        this.shelf1Mesh = new THREE.Mesh(this.shelf1, this.shelfMaterial);
        this.shelfY = this.squareY + this.squareHeight + 0.5;
        this.shelf1Mesh.position.y = this.shelfY
        this.shelf1Mesh.position.x = -0.6

        this.coverMaterial = new THREE.MeshBasicMaterial({ map: coverTexture });
        this.coverMesh = new THREE.Mesh(this.cover, this.coverMaterial);
        this.coverMesh.position.y = this.shelfY + 0.015 + this.coverHeight/2
        this.coverMesh.position.x = -0.6
        this.coverMesh.rotation.z = Math.PI / 14
        this.coverMesh.castShadow = true;
        this.coverMesh.receiveShadow = true;

        this.add(this.coverMesh)
        this.add(this.shelf1Mesh)
    }

    changeColor(color) {
        this.window.material.color = new THREE.Color(color);
    }
}


MyVinylPlayerHolder.prototype.isGroup = true;
export { MyVinylPlayerHolder };
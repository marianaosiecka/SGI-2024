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


        
        this.add( this.upMesh )
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

    buildCovers(coversTextures){
        this.cover = new THREE.BoxGeometry(0.05, this.squareHeight - this.border/2, this.squareHeight - this.border/2);
        this.cover1Material = new THREE.MeshBasicMaterial({ map: coversTextures[0] });
        this.cover1Mesh = new THREE.Mesh(this.cover, this.cover1Material);
        this.cover1Mesh.rotation.y = Math.PI/2;
        this.cover1Mesh.position.y = this.squareY;
        this.cover1Mesh.position.z = this.width/2 - this.border/2 - 0.04

        this.cover2Material = new THREE.MeshBasicMaterial({ map: coversTextures[1] });
        this.cover2Mesh = new THREE.Mesh(this.cover, this.cover2Material);
        this.cover2Mesh.rotation.y = Math.PI/2;
        this.cover2Mesh.position.y = this.squareY;
        this.cover2Mesh.position.z = this.width/2 - this.border/2 - 0.1

        this.cover3Material = new THREE.MeshBasicMaterial({ map: coversTextures[2] });
        this.cover3Mesh = new THREE.Mesh(this.cover, this.cover3Material);
        this.cover3Mesh.rotation.y = Math.PI/2;
        this.cover3Mesh.position.y = this.squareY;
        this.cover3Mesh.position.z = this.width/2 - this.border/2 - 0.16

        this.cover4Material = new THREE.MeshBasicMaterial({ map: coversTextures[3] });
        this.cover4Mesh = new THREE.Mesh(this.cover, this.cover4Material);
        this.cover4Mesh.rotation.y = Math.PI/2;
        this.cover4Mesh.position.y = this.squareY;
        this.cover4Mesh.position.z = this.width/2 - this.border/2 - 0.22

        this.cover5Material = new THREE.MeshBasicMaterial({ map: coversTextures[4] });
        this.cover5Mesh = new THREE.Mesh(this.cover, this.cover5Material);
        this.cover5Mesh.rotation.y = Math.PI/2;
        this.cover5Mesh.position.y = this.squareY;
        this.cover5Mesh.position.z = this.width/2 - this.border/2 - 0.28

        this.cover6Material = new THREE.MeshBasicMaterial({ map: coversTextures[5] });
        this.cover6Mesh = new THREE.Mesh(this.cover, this.cover6Material);
        this.cover6Mesh.rotation.y = Math.PI/2;
        this.cover6Mesh.position.y = this.squareY;
        this.cover6Mesh.position.z = this.width/2 - this.border/2 - 0.34

        this.cover7Mesh = new THREE.Mesh(this.cover, this.cover1Material);
        this.cover7Mesh.rotation.y = Math.PI/2;
        this.cover7Mesh.rotation.x = Math.PI/8
        this.cover7Mesh.position.y = this.squareY;
        this.cover7Mesh.position.z = this.width/2 - this.border/2 - 0.48

        this.add(this.cover1Mesh)
        this.add(this.cover2Mesh)
        this.add(this.cover3Mesh)
        this.add(this.cover4Mesh)
        this.add(this.cover5Mesh)
        this.add(this.cover6Mesh)
        this.add(this.cover7Mesh)
    }

    changeColor(color) {
        this.window.material.color = new THREE.Color(color);
    }
}


MyVinylPlayerHolder.prototype.isGroup = true;
export { MyVinylPlayerHolder };
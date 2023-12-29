import * as THREE from 'three';

class MyHUD extends THREE.Object3D {
    constructor(app) {
        super();

        this.app = app;
        this.asciiMap = {};
        this.spritesheet = null;
        this.initHUD();
    }

    initHUD() {
        const planeGeometry = new THREE.PlaneGeometry(10, 2);
        const textTexture = new THREE.TextureLoader().load('textures/HUD_text.png');
        textTexture.wrapS = THREE.RepeatWrapping;
        textTexture.wrapT = THREE.RepeatWrapping;
        textTexture.repeat.set(1, 1);
        const planeMaterial = new THREE.MeshBasicMaterial({ map:textTexture, transparent: true, side: THREE.DoubleSide});
        const HUD = new THREE.Mesh(planeGeometry, planeMaterial);
        
        /*const spritesheetTex = new THREE.TextureLoader().load('spritesheets/spritesheetpng.png');
        spritesheetTex.wrapS = THREE.RepeatWrapping;
        spritesheetTex.wrapT = THREE.RepeatWrapping;
        spritesheetTex.repeat.set(1, 1);
        const spitesheetMat = new THREE.MeshBasicMaterial({ map:spritesheetTex, transparent: true, side: THREE.DoubleSide});
        this.spritesheet = new THREE.Mesh(planeGeometry, spitesheetMat);
        this.spritesheet.position.z = 0.1;
*/
        this.add(HUD); 
        //this.add(this.spritesheet);       
        //this.initASCIIMap();
    }

    drawText(context, text, x, y) {
        const charWidth = 0.1;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            if (this.asciiMap[char]) {
                const { u, v, u2, v2 } = this.asciiMap[char];
                context.drawImage(
                    this.HUD.material.map.image,
                    u * context.canvas.width, v * context.canvas.height,
                    (u2 - u) * context.canvas.width, (v2 - v) * context.canvas.height,
                    x + i * charWidth * context.canvas.width, y,
                    charWidth * context.canvas.width, context.canvas.height
                );
            }
        }
    }

    update(totalLaps, playerLaps, timeLimit, playerTime, maxVelocity, velocity, appliedModifiers, appliedModifiersStartTime){
        //remove duplicates from appliedModifiers
        let appliedModifiersCopy = appliedModifiers;
        const appliedModifiersDict = {};

        for (let i = 0; i < appliedModifiersCopy.length; i++){
            if (!(appliedModifiersCopy[i] in appliedModifiersDict)) {
                appliedModifiersDict[appliedModifiersCopy[i]] = appliedModifiersStartTime[i];
            }
        }
        
        appliedModifiersCopy = appliedModifiersCopy.filter((v, i, a) => a.indexOf(v) === i);
        
        //console.log(this.spritesheet.material.map)
        /*const context = this.spritesheet.material.map.image.getContext('2d');
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        let offset = 8;
        for(let i = 0; i < appliedModifiersCopy.length; i++){
            let modifier = appliedModifiers[i];
            let modifierTime = 3000 - Math.floor(appliedModifiersDict[modifier]);
            let modifierGeo = new THREE.PlaneGeometry(2, 2);
            let modifierMat = new THREE.MeshBasicMaterial({ map: modifier.texture, transparent: true});
            let modifierMesh = new THREE.Mesh(modifierGeo, modifierMat);
            this.add(modifierMesh);
            modifierMesh.position.z = offset;
            offset += 2;

            this.drawText(context, `${modifierTime/1000}`, 10, 150);
        }

    
        this.drawText(context, `${Math.floor(playerTime)/1000}/${timeLimit/1000}`, 10, 30);
        this.drawText(context, `${playerLaps}/${totalLaps}`, 10, 120);
        this.drawText(context, `${Math.round(maxVelocity * 10) / 10}`, 10, 90);
        this.drawText(context, `${Math.round(velocity * 10) / 10}`, 10, 60);

        this.spritesheet.material.map.needsUpdate = true;*/
    }

}

export { MyHUD };

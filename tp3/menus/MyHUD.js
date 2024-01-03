import * as THREE from 'three';
import { MyVehicle } from '../elements/MyVehicle.js';

class MyHUD extends THREE.Object3D {
    constructor(app, spritesheet) {
        super();

        this.app = app;
        this.spritesheet = spritesheet;
        this.runningTexture = new THREE.TextureLoader().load('textures/HUD_running.png');
        this.runningTexture.wrapS = THREE.RepeatWrapping;
        this.runningTexture.wrapT = THREE.RepeatWrapping;
        this.runningTexture.repeat.set(1, 1);
        this.pausedTexture = new THREE.TextureLoader().load('textures/HUD_paused.png');
        this.pausedTexture.wrapS = THREE.RepeatWrapping;
        this.pausedTexture.wrapT = THREE.RepeatWrapping;
        this.pausedTexture.repeat.set(1, 1);
        this.modifiers = [];

        this.initHUD();
    }

    initHUD() {
        const planeGeometry = new THREE.PlaneGeometry(6, 1);
        const planeMaterial = new THREE.MeshBasicMaterial({ map:new THREE.TextureLoader().load("textures/HUD_text.png"), transparent: true, side: THREE.DoubleSide});
        const velocityBox = new THREE.Mesh(planeGeometry, planeMaterial);
        velocityBox.name = "velocityBox";
        const aspect = window.innerWidth / window.innerHeight;
        velocityBox.position.x += aspect/ 2 - 12.5;
        velocityBox.position.y -= 13;
        this.add(velocityBox);
    }

    setPause() {
        this.children.forEach(child => {
            if(child.name === "running"){
                this.remove(child);
            }
        });

        const planeGeometry = new THREE.PlaneGeometry(0.8, 0.8);
        const planeMaterial = new THREE.MeshBasicMaterial({ map:this.pausedTexture, transparent: true, side: THREE.DoubleSide});
        const pausedMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        const aspect = window.innerWidth / window.innerHeight;
        pausedMesh.position.x += -aspect*7;
        pausedMesh.position.y += -1; 
        this.add(pausedMesh);
    }

    update(running, totalLaps, playerLaps, timeLimit, playerTime, maxVelocity, velocity, appliedModifiers, appliedModifiersStartTime){
        this.children.forEach(child => {
            if(child.name === undefined || child.name !== "velocityBox"){
                this.remove(child);
            }
            this.modifiers = [];
        });

        const time = Date.now();

        if(running){
            const planeGeometry = new THREE.PlaneGeometry(0.8, 0.8);
            const planeMaterial = new THREE.MeshBasicMaterial({ map:this.runningTexture, transparent: true, side: THREE.DoubleSide});
            const runningMesh = new THREE.Mesh(planeGeometry, planeMaterial);
            runningMesh.name = 'running';

            const aspect = window.innerWidth / window.innerHeight;

            runningMesh.position.x += -aspect*7;
            runningMesh.position.y += -1; 
            this.add(runningMesh); 
        }
    
        //remove duplicates from appliedModifiers
        let appliedModifiersCopy = appliedModifiers;
        const appliedModifiersDict = {};

        for (let i = 0; i < appliedModifiersCopy.length; i++){
            if (!(this.checkModifierInDict(appliedModifiersCopy[i], appliedModifiersDict))) {
                appliedModifiersDict[appliedModifiersCopy[i]] = appliedModifiersStartTime[i];
            }
        }
        
        appliedModifiersCopy = appliedModifiersCopy.filter((v, i, a) => a.indexOf(v) === i);

        let offset = 0;
        for(let i = 0; i < appliedModifiersCopy.length; i++){
            let modifier = appliedModifiers[i];
            if(modifier instanceof MyVehicle || this.modifiers.includes(modifier))
                continue;

            let modifierTime = 0;
            if(modifier.type === 'shortcut'){
                modifierTime = (4000 - (time-Math.floor(appliedModifiersDict[modifier])))/1000;
            }
            else
                modifierTime = (7000 - (time-Math.floor(appliedModifiersDict[modifier])))/1000;

            this.modifiers.push(modifier)

            // modifier texture
            let modifierGeo = new THREE.PlaneGeometry(1.2, 1.2);
            let modifierMat = new THREE.MeshBasicMaterial({ map: modifier.texture, transparent: true});
            let modifierTextMesh = new THREE.Mesh(modifierGeo, modifierMat);
            this.add(modifierTextMesh);
            modifierTextMesh.position.x += 10.75 + offset;
            modifierTextMesh.position.y -= 11.98;
            modifierTextMesh.position.z += 0.1;

            // modifier time count down
            let modifierTimeMesh = this.spritesheet.getText(Math.floor(modifierTime));
            this.add(modifierTimeMesh)
            modifierTimeMesh.scale.set(1.1, 1.1, 1.1);
            modifierTimeMesh.position.x += 10.58 + offset;
            modifierTimeMesh.position.y -= 13;
            modifierTimeMesh.position.z += 0.3;

            offset += 1.5;
        }

        let playerTimeString = (Math.floor(Math.floor(playerTime)/1000)).toString() + "/" + (timeLimit/1000).toString() + "s";
        let playerLapsString = "LAP " + playerLaps + "/" + totalLaps;
        let playerString = playerTimeString + " | " + playerLapsString;
        let playerMesh = this.spritesheet.getText(playerString);
    
        const aspect = window.innerWidth / window.innerHeight;
        playerMesh.scale.set(1.2, 1.2, 1.2);
        playerMesh.position.x += aspect/ 2;
        playerMesh.position.z += 0.3;
        playerMesh.position.y -= 0.5;
        this.add(playerMesh)

        let maxVelocityString = Math.round(maxVelocity * 10)/10 + " m/s";
        let speedMesh = this.spritesheet.getText("SPEED");
        let maxSpeedMesh = this.spritesheet.getText("MAX SPEED");
        speedMesh.scale.set(0.7, 0.7, 0.7);
        maxSpeedMesh.scale.set(0.7, 0.7, 0.7);
        speedMesh.position.x = aspect/ 2 - 2.1 - 12;
        speedMesh.position.y -= 12.1;
        maxSpeedMesh.position.x = aspect/ 2 + 0.9 - 12;
        maxSpeedMesh.position.y -= 12.1;
        this.add(speedMesh);
        this.add(maxSpeedMesh);

        let velocityString = Math.round(velocity * 10)/10 + " m/s" + " | " + maxVelocityString;
        let velocityMesh = this.spritesheet.getText(velocityString);
        velocityMesh.scale.set(0.75, 0.75, 0.75);
        velocityMesh.position.x = aspect/ 2 - 12;
        velocityMesh.position.y -= 12.85;
        velocityMesh.position.z += 0.3;
        this.add(velocityMesh)
    }

    checkModifierInDict(modifier, dict){
        for(let i = 0; i < dict.length; i++){
            if(modifier.type === dict[i].type){
                return true;
            }
        }
        return false;
    }

}

export { MyHUD };

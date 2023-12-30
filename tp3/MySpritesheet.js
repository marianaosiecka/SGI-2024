import * as THREE from "three";

class MySpritesheet {
    constructor(path, numberOfColumns, numberOfRows){
        this.texture = new THREE.TextureLoader().load(path);
        this.numberOfColumns = numberOfColumns;
        this.numberOfRows = numberOfRows;
        this.characterWidth = 1 / this.numberOfColumns;
        this.characterHeight = 1 / this.numberOfRows;
    }

    getCharacter(character){
        const asciiCode = character.charCodeAt(0);
        const asciiCodeOffset = 32;
        const column = (asciiCode - asciiCodeOffset ) % this.numberOfColumns;
        const row = Math.floor((asciiCode - asciiCodeOffset) / this.numberOfRows) + 1;
        const geometry = new THREE.PlaneGeometry(1, 1);
        const uv = geometry.attributes.uv;
        
        uv.setXY(
            0, 
            column * this.characterWidth,
            1 - row * this.characterHeight
        );

        uv.setXY(
            1, 
            column * this.characterWidth + this.characterWidth,
            1 - row * this.characterHeight
        );

        uv.setXY(
            2, 
            column * this.characterWidth,
            1 - row * this.characterHeight + this.characterHeight
        );

        uv.setXY(
            3, 
            column * this.characterWidth + this.characterWidth,
            1 - row * this.characterHeight + this.characterHeight
        );

        const material = new THREE.MeshBasicMaterial({map: this.texture, side: THREE.DoubleSide, transparent: true});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = Math.PI;
        
        return mesh;
    }

    getText(text){
        const group = new THREE.Group();
        const characters = text.split("");
        const numCharacters = characters.length;
        const totalWidth = numCharacters * this.characterWidth + 0.4 * (numCharacters - 1);
        let x = -totalWidth / 2 + this.characterWidth / 2;


        characters.forEach(character => {
            const mesh = this.getCharacter(character);
            mesh.position.x = x;
            group.add(mesh);
            x += 0.4 + this.characterWidth / 2;
        });

        return group;
    }
}

export {MySpritesheet}
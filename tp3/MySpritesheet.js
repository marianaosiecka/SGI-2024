import * as THREE from "three";

/**
 * MySpritesheet
 * @constructor
 * @param path - Path to the spritesheet
 * @param numberOfColumns - Number of columns of the spritesheet
 * @param numberOfRows - Number of rows of the spritesheet
 */
class MySpritesheet {
    constructor(path, numberOfColumns, numberOfRows){
        this.texture = new THREE.TextureLoader().load(path);
        this.numberOfColumns = numberOfColumns;
        this.numberOfRows = numberOfRows;
        this.characterWidth = 1 / this.numberOfColumns;
        this.characterHeight = 1 / this.numberOfRows;
    }

    /**
     * get the character mesh from the spritesheet
     * @param character - Character to get
     * @returns {THREE.Mesh} - Character mesh
     */
    getCharacter(character){
        const asciiCode = character.charCodeAt(0); // get ascii code of character
        const asciiCodeOffset = 32; // offset of ascii code (first character is space)
        // get column and row of character
        const column = (asciiCode - asciiCodeOffset ) % this.numberOfColumns; 
        const row = Math.floor((asciiCode - asciiCodeOffset) / this.numberOfRows);

        const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

        const uv = geometry.attributes.uv;
        uv.setXY(
            0, 
            column * this.characterWidth,
            1 - (row * this.characterHeight)
        );

        uv.setXY(
            1, 
            (column + 1) * this.characterWidth,
            1 - (row * this.characterHeight)
        );

        uv.setXY(
            2, 
            column * this.characterWidth,
            1 - ((row + 1) * this.characterHeight)
        );

        uv.setXY(
            3, 
            (column + 1) * this.characterWidth,
            1 - ((row + 1) * this.characterHeight)
        );

        const material = new THREE.MeshBasicMaterial({map: this.texture, side: THREE.DoubleSide, transparent: true});
        const mesh = new THREE.Mesh(geometry, material);
        
        return mesh;
    }

    /**
     * get the text mesh from the spritesheet
     * @param text - Text to get
     * @param distanceX - Distance between characters
     * @returns {THREE.Group} - Text mesh
     */
    getText(text, distanceX = 0.4){
        text = text.toString();

        const group = new THREE.Group();
        const characters = text.split(""); // split text into characters
        const numCharacters = characters.length;
        const totalWidth = numCharacters * this.characterWidth + distanceX * (numCharacters - 1);
        let x = -totalWidth / 2 + this.characterWidth / 2;
        let z = 0;
        let i = 0;

        // create a mesh for each character and ajust its position
        characters.forEach(character => {
            const mesh = this.getCharacter(character);
            mesh.position.x = x;
            group.add(mesh);
            x += distanceX + this.characterWidth / 2;

            if(i % 2 == 0) {
                z += 0.08;
            } else {
                z -= 0.08;
            }
            i++;
        });

        return group;
    }
}

export {MySpritesheet}
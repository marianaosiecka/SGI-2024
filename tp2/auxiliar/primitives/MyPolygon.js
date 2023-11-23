import * as THREE from 'three';

class MyPolygon {
     
    /**
     * Constructor for MyPolygon class.
     *
     * @param {Object} polygonData - The polygon properties data.
    */
    constructor(polygonData) {
        this.stacks = polygonData.stacks;
        this.slices = polygonData.slices;
        this.color_c = polygonData.color_c;
        this.color_p = polygonData.color_p;
        const radius = polygonData.radius;

        this.geometry = new THREE.BufferGeometry();
        const vertices = [];
        const normals = [];
        const colors = [];
        const uvs = []; 

        for (let stack = 0; stack <= this.stacks; stack++) {         //along the vertical axis
            const verticalAngle = (stack/this.stacks) * Math.PI;     //stack/stacks -> normalizes the value between 0 and 1 | * Math.PI -> normalizes the value to be an angle in radians between 0 and Math.PI
            const sinVerticalAngle = Math.sin(verticalAngle);
            const cosVerticalAngle = Math.cos(verticalAngle);
    
            for (let slice = 0; slice <= this.slices; slice++) {     //along the horizontal axis
                const horizontalAngle = (slice/this.slices) * Math.PI * 2;  //slice/slices -> normalizes the value between 0 and 1 | * Math.PI * 2 -> normalizes the value to be an angle in radians between 0 and 2*Math.PI
                const sinHorizontalAngle = Math.sin(horizontalAngle);
                const cosHorizontalAngle = Math.cos(horizontalAngle);
    
                const x = radius*cosHorizontalAngle*sinVerticalAngle;
                const y = radius*sinHorizontalAngle*sinVerticalAngle;
                const z = radius*cosVerticalAngle;

                const u = slice / this.slices;  
                const v = stack / this.stacks; 
    
                const color = new THREE.Color();
                // interpolating the colors
                color.lerpColors(this.color_c, this.color_p, slice/this.slices);
    
                vertices.push(x, y, z);
                normals.push(cosHorizontalAngle*sinVerticalAngle, sinHorizontalAngle*sinVerticalAngle, cosVerticalAngle);
                colors.push(color.r, color.g, color.b);
                uvs.push(u, v);  
            }
        }
    
        const indices = [];
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const first = (stack * (this.slices+1)) + slice;
                const second = first+this.slices+1;
    
                // indices for two triangles forming a square
                indices.push(first+1, second, first);
                indices.push(first+1, second+1, second);
            }
        }
    
        this.geometry.setIndex(indices);
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        this.geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        this.geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); 
    }

    /**
     * Creates a new colors array for the geometry's color attribute
     *
     * @param {THREE.Color} color - The new color.
     * @param {Boolean} isColor_c - To know which color has change to make a new interpolation.
    */
    updateColor(color, isColor_c) {
        if (isColor_c)
            this.color_c = color;
        else
            this.color_p = color;
        const colors = []
        for (let stack = 0; stack <= this.stacks; stack++) {         //along the vertical axis
            for (let slice = 0; slice <= this.slices; slice++) {     //along the horizontal axis
                const color = new THREE.Color();
                // interpolating the colors
                color.lerpColors(this.color_c, this.color_p, slice/this.slices);
                colors.push(color.r, color.g, color.b);
            }
        }
        return colors;
    }
}

export {MyPolygon};

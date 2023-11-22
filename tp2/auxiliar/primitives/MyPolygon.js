import * as THREE from 'three';

class MyPolygon {
     
    /**
     * Constructor for MyPolygon class.
     *
     * @param {Object} polygonData - The polygon properties data.
    */
    constructor(polygonData) {
        const radius = polygonData.radius;
        const stacks = polygonData.stacks;
        const slices = polygonData.slices;
        const color_c = polygonData.color_c;
        const color_p = polygonData.color_p;

        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const normals = [];
        const colors = [];
        const uvs = []; 

        for (let stack = 0; stack <= stacks; stack++) {         //along the vertical axis
            const verticalAngle = (stack/stacks) * Math.PI;     //stack/stacks -> normalizes the value between 0 and 1 | * Math.PI -> normalizes the value to be an angle in radians between 0 and Math.PI
            const sinVerticalAngle = Math.sin(verticalAngle);
            const cosVerticalAngle = Math.cos(verticalAngle);
    
            for (let slice = 0; slice <= slices; slice++) {     //along the horizontal axis
                const horizontalAngle = (slice/slices) * Math.PI * 2;  //slice/slices -> normalizes the value between 0 and 1 | * Math.PI * 2 -> normalizes the value to be an angle in radians between 0 and 2*Math.PI
                const sinHorizontalAngle = Math.sin(horizontalAngle);
                const cosHorizontalAngle = Math.cos(horizontalAngle);
    
                const x = radius*cosHorizontalAngle*sinVerticalAngle;
                const y = radius*sinHorizontalAngle*sinVerticalAngle;
                const z = radius*cosVerticalAngle;

                const u = slice / slices;  
                const v = stack / stacks; 
    
                const color = new THREE.Color();
                // interpolating the colors
                color.lerpColors(color_c, color_p, slice/slices);
    
                vertices.push(x, y, z);
                normals.push(cosHorizontalAngle*sinVerticalAngle, sinHorizontalAngle*sinVerticalAngle, cosVerticalAngle);
                colors.push(color.r, color.g, color.b);
                uvs.push(u, v);  
            }
        }
    
        const indices = [];
        for (let stack = 0; stack < stacks; stack++) {
            for (let slice = 0; slice < slices; slice++) {
                const first = (stack * (slices+1)) + slice;
                const second = first+slices+1;
    
                // indices for two triangles forming a square
                indices.push(first+1, second, first);
                indices.push(first+1, second+1, second);
            }
        }
    
        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); 

        return geometry;
    }
}

export {MyPolygon};

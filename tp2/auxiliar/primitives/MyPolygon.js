import * as THREE from 'three';

class MyPolygon{
     
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

        for (let stack = 0; stack <= stacks; stack++) {
            const verticalAngle = (stack/stacks) * Math.PI; 
            const sinVerticalAngle = Math.sin(verticalAngle);
            const cosVerticalAngle = Math.cos(verticalAngle);
    
            for (let slice = 0; slice <= slices; slice++) {
                const horizontalAngle = (slice/slices) * Math.PI * 2; 
                const sinHorizontalAngle = Math.sin(horizontalAngle);
                const cosHorizontalAngle = Math.cos(horizontalAngle);
    
                const x = radius*cosHorizontalAngle*sinVerticalAngle;
                const y = radius*sinHorizontalAngle*sinVerticalAngle;
                const z = radius*cosVerticalAngle;
    
                const color = new THREE.Color();
                color.lerpColors(color_c, color_p, slice/slices);
    
                vertices.push(x, y, z);
                normals.push(cosHorizontalAngle*sinVerticalAngle, sinHorizontalAngle*sinVerticalAngle, cosVerticalAngle);
                colors.push(color.r, color.g, color.b);
            }
        }
    
        const indices = [];
        for (let stack = 0; stack < stacks; stack++) {
            for (let slice = 0; slice < slices; slice++) {
                const first = (stack * (slices+1)) + slice;
                const second = first+slices+1;
    
                indices.push(first+1, second, first);
                indices.push(first+1, second+1, second);
            }
        }
    
        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        return geometry;
    }
}

export {MyPolygon};

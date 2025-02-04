import * as THREE from 'three';

class MyTriangle extends THREE.BufferGeometry {

	/**
     * Constructor for MyTriangle class.
     *
     * @param {Object} triangleData - The triangle properties data.
    */
	constructor(triangleData) {
		super();

        this.p1 = new THREE.Vector3(triangleData.xyz1[0], triangleData.xyz1[1], triangleData.xyz1[2])
		this.p2 = new THREE.Vector3(triangleData.xyz2[0], triangleData.xyz2[1], triangleData.xyz2[2])
		this.p3 = new THREE.Vector3(triangleData.xyz3[0], triangleData.xyz3[1], triangleData.xyz3[2])

        this.initBuffers();
	}

	/**
     * Initializes the buffers.
     *
    */
	initBuffers() {
        // calculating normals
        var vectorAx = this.p2.x - this.p1.x
		var vectorAy = this.p2.y - this.p1.y
		var vectorAz = this.p2.z - this.p1.z

		var vectorBx = this.p3.x - this.p1.x
		var vectorBy = this.p3.y - this.p1.y
		var vectorBz = this.p3.z - this.p1.z

		var crossProductX = vectorAy * vectorBz - vectorBy * vectorAz
		var crossProductY = vectorBx * vectorAz - vectorAx * vectorBz
		var crossProductZ = vectorAx * vectorBy - vectorBx * vectorAy
		
		var normal = new THREE.Vector3(crossProductX, crossProductY, crossProductZ)
        normal.normalize()

        // texture coordinates
		let a = this.p1.distanceTo(this.p2);
		let b = this.p2.distanceTo(this.p3);
		let c = this.p1.distanceTo(this.p3);


		let cos_ac = (a * a - b * b + c * c) / (2 * a * c)
		let sin_ac = Math.sqrt(1 - cos_ac * cos_ac)
		const vertices = new Float32Array( [
            ...this.p1.toArray(),	//0
			...this.p2.toArray(),	//1
			...this.p3.toArray(),	//2

        ] );
		
		const indices = [
            0, 1, 2
        ];
		
		const normals = [
			...normal.toArray(),
			...normal.toArray(),
			...normal.toArray(),
		];

		const uvs = [
			0, 0,
			1 , 0,
			1 * cos_ac, 1 * sin_ac
		]

        this.setIndex( indices );
        this.setAttribute('position', new THREE.Float32BufferAttribute( vertices, 3 ));
        this.setAttribute('normal', new THREE.Float32BufferAttribute( normals, 3 ));
        this.setAttribute('uv', new THREE.Float32BufferAttribute( uvs, 2));

	}

}


export { MyTriangle };
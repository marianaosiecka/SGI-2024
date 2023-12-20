import * as THREE from 'three';

class MyVehicle extends THREE.Object3D {

  /**
    * Creates the mesh, the line and the wireframe used to visualize the curve
    * @param {MyApp} app The application object
    * @param {width} width The width of the car
    * @param {height} height The height of the car
    * @param {depth} depth The depth of the car
    */
  constructor(width, height, depth) {
    super();
    this.type = 'Group';

    // car geometry
    let geometry = new THREE.BoxGeometry(depth, height, width);

    // wheel geometry
    let wheelHeight = height/3;
    let wheelGeometry = new THREE.CylinderGeometry(wheelHeight, wheelHeight, wheelHeight, 32);
    
    // materials
    let wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    // meshes
    let carMesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xffd700 }));
    let wheelMeshLeftBack = new THREE.Mesh(wheelGeometry, wheelMaterial);
    let wheelMeshLeftFront = new THREE.Mesh(wheelGeometry, wheelMaterial);
    let wheelMeshRightBack = new THREE.Mesh(wheelGeometry, wheelMaterial);
    let wheelMeshRightFront = new THREE.Mesh(wheelGeometry, wheelMaterial);

    // wheel positions
    wheelMeshLeftBack.rotation.set(0, Math.PI / 2, Math.PI / 2);
    wheelMeshLeftBack.position.x = -depth / 2 + wheelHeight;
    wheelMeshLeftBack.position.y = -height / 2;
    wheelMeshLeftBack.position.z = width / 2 - wheelHeight / 2.1;

    wheelMeshLeftFront.rotation.set(0, Math.PI / 2, Math.PI / 2);
    wheelMeshLeftFront.position.x = -depth / 2 + wheelHeight;
    wheelMeshLeftFront.position.y = -height / 2;
    wheelMeshLeftFront.position.z = -width / 2 + wheelHeight / 2.1;

    wheelMeshRightBack.rotation.set(0, Math.PI / 2, Math.PI / 2);
    wheelMeshRightBack.position.x = depth / 2 - wheelHeight;
    wheelMeshRightBack.position.y = -height / 2;
    wheelMeshRightBack.position.z = width / 2 - wheelHeight / 2.1;

    wheelMeshRightFront.rotation.set(0, Math.PI / 2, Math.PI / 2);
    wheelMeshRightFront.position.x = depth / 2 - wheelHeight;
    wheelMeshRightFront.position.y = -height / 2;
    wheelMeshRightFront.position.z = -width / 2 + wheelHeight / 2.1;


    this.add(carMesh);
    this.add(wheelMeshLeftBack);
    this.add(wheelMeshLeftFront);
    this.add(wheelMeshRightBack);
    this.add(wheelMeshRightFront);

  }

}


MyVehicle.prototype.isGroup = true;
export { MyVehicle };
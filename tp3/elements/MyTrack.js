import * as THREE from 'three';

class MyTrack extends THREE.Object3D {

  /**
    * Creates the mesh, the line and the wireframe used to visualize the curve
    * @param {MyApp} app The application object
    * @param {segments} segments The number of segments in the tube geometry
    * @param {width} width The width of the track
    * @param {path} path The points that define the path of the track
    */
  constructor(app, segments, width, path, layer) {
    super();
    this.type = 'Group';
    this.app = app;
    this.name == "track";

    // track geometry
    let geometry = new THREE.TubeGeometry(
        path,
        segments,
        width,
        3,
        true
    );

    // textures
    let texture = new THREE.TextureLoader().load('textures/road.jpg');
    let bumpMap = new THREE.TextureLoader().load('textures/road_bump_texture.png');

    // main track material
    let material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: bumpMap, bumpScale: 0.1 });
    material.map.repeat.set(12, 3);
    material.map.wrapS = THREE.RepeatWrapping;
    material.map.wrapT = THREE.RepeatWrapping;

    // wireframe material
    let wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.3,
      wireframe: true,
      transparent: true,
    });

    // track center line material
    let lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.layers.enable(layer);
    this.wireframe = new THREE.Mesh(geometry, wireframeMaterial);
    this.wireframe.visible = false;

    let points = path.getPoints(segments);
    let bufferGeometry = new THREE.BufferGeometry().setFromPoints(points);
    this.line = new THREE.Line(bufferGeometry, lineMaterial);
    this.line.visible = false;

    this.mesh.name = "track";
    this.add(this.mesh);
    this.add(this.wireframe);
    this.add(this.line);

    this.line.position.y -= 2;
    this.rotateZ(Math.PI);
    this.scale.set(2.5,0.2,2); 

  }

}


MyTrack.prototype.isGroup = true;
export { MyTrack };
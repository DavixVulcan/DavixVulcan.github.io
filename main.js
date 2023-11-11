import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshNormalMaterial;
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function move_to(pos_x, poz_y, pos_z, rot_x, rot_y, rot_z){
	let coords_rots = { 
		x: camera.position.x, y: camera.position.y, z: camera.position.z, 
		xr: camera.rotation.x, yr: camera.rotation.y, zr: camera.rotation.z
	};
	new TWEEN.Tween(coords_rots).to(
		{x: pos_x, y: poz_y, z: pos_z, xr: rot_x, yr: rot_y, zr: rot_z}
	).onUpdate(() => {
		camera.position.set(coords_rots.x, coords_rots.y, coords_rots.z);
		camera.rotation.set(coords_rots.xr, coords_rots.yr, coords_rots.zr);
		console.log("HAH")
	}
	).easing(TWEEN.Easing.Cubic.InOut).start();
}	

function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
	TWEEN.update();
}

move_to(1,1,5, 0,0,0);
animate();

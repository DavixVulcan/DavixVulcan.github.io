import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

// Setting the scene constants
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Setting the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.insertBefore( renderer.domElement, document.body.firstChild);

// Test cube
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshNormalMaterial;
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// Test camera position
camera.position.z = 5;

// Function that returns a camera position-rotation object (Holding the values)
function camera_composition(pos_x, pos_y, pos_z, rot_x, rot_y, rot_z){
	this.x = pos_x;
	this.y = pos_y;
	this.z = pos_z;
	this.xr = rot_x;
	this.yr = rot_y;
	this.zr = rot_z;
}

// My map of locations and rotations for the camera
const positions = new Map([
	["Start", new camera_composition(1,1,5,0,0,0)]
])

// This function takes in a camera_allocator object, that extracts
// the position and rotation, and tweens to it
function move_to(p){
	let coords_rots = { 
		x: camera.position.x, y: camera.position.y, z: camera.position.z, 
		xr: camera.rotation.x, yr: camera.rotation.y, zr: camera.rotation.z
	};
	new TWEEN.Tween(coords_rots).to(
		{x: p.x, y: p.y, z: p.z, xr: p.xr, yr: p.yr, zr: p.zr}
	).onUpdate(() => {
		camera.position.set(coords_rots.x, coords_rots.y, coords_rots.z);
		camera.rotation.set(coords_rots.xr, coords_rots.yr, coords_rots.zr);
		// console.log("HAH");
	}
	).easing(TWEEN.Easing.Cubic.InOut).start();
}	

function drop_down_toggle(){

}

// Animation loop
function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
	TWEEN.update();
}

move_to(positions.get("Start"));
animate();
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

// Setting the scene constants
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 33, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Setting the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.insertBefore( renderer.domElement, document.body.firstChild);

// Test cube
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshNormalMaterial;
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// Materials
const materials = new Set();
const warpfeld = new Set();
const slideshow = new Set();
let iswarpav = false;

let mixer, clock;


// Load our main scene
const loader = new GLTFLoader();
const loadedData = await loader.load("/Environment/scene.gltf",
	function(gltf){
		scene.add(gltf.scene);
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

		// Animation handlers
		mixer = new THREE.AnimationMixer(gltf.scene);
		gltf.animations.forEach((clip)=> {
			mixer.clipAction(clip).play();
		})
		clock = new THREE.Clock();

		// List All Scenes
		scene.traverse(function(object){
			if (object.material) materials.add(object.material);
		});
		console.log(materials);
		for(const item of materials){
			if (item.name === "WarpField"){
				// console.log(item.map.name);
				item.map.wrapS = THREE.RepeatWrapping;
				item.map.wrapT = THREE.RepeatWrapping;
				warpfeld.add(item);
			
			} else if (item.name === "Slideshow"){
				item.map.wrapS = THREE.RepeatWrapping;
				item.map.wrapT = THREE.RepeatWrapping;
				slideshow.add(item);
			}
		}
		console.log(warpfeld);
		iswarpav = true;
	}
);


// Load our "hdri"
scene.background = new THREE.CubeTextureLoader().setPath("/Environment/").load(
	['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ]
);


// Test camera position
camera.position.z = 5;

// Adding sun
const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
scene.add( directionalLight );

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
	["About", new camera_composition(0,15,0,0,0,0)],
	["RAUL\'S DIGITAL SPACE", new camera_composition(9.29,2.02,71.62, 0.09, 0.29, 0)],
	["Projects", new camera_composition(0,2.5,3, 1.57, 1.39, -1.57)],
	["Ludwig Myth Room Decor", new camera_composition(-45.6,5.37,6.37, -2.93, 0.28, 3.14)],
	["HackUTA 2023", new camera_composition(-66,5.37,8, -2.93, -0.23, 3.14)], 
	["Ludwig Game Jam 2023", new camera_composition(-78,5.37,8, -2.93, 0.28, 3.14)], 
	["Habromania", new camera_composition(-49.6,7.37,-2, 0, 0, 0)],
	["Skills", new camera_composition(18.97,3.69,-0.32,0.09, 0.29, 0)]
])

// Map of descriptions
const descriptions = new Map([
	["About", `<b><u>Raul Salas</u+></b><BR/>
	<b>Currently Working:</b> UTA Libraries (2021-Present)<BR/>
	<b>Position:</b> Virtual Production Student Lead<BR/>
	<BR/>
	Website built using Three.js and Tween.js
	`],
	["RAUL\'S DIGITAL SPACE", "Hello, welcome to the space. Look around, take a gander at what I've worked on. "],
	["Projects", "Take a look at what I've worked on/ am currently working on."],
	["Ludwig Myth Room Decor", `<b>ROLE:</b> 3D Modeler<BR/>
	<b>TOOLS USED:</b> Blender, ThreeJS<BR/>
	<b>LINK:</b> <a href='https://www.youtube.com/watch?v=auH703P_HFg' target="_blank">Youtube Video</a><BR/>
	Modeled web-optimized 3D models to be used in an interactive website representing a room decoration simulation. 
	Utilized 3D software such as Blender and ThreeJS in order to optimize their presentation on the web. 
	The website was then used to vote for item placement in the room by placing them in the virtual room.</BR>
	</BR>
	Hint: Look at the upper right corner in the video, those were my 3D models from the website!`],
	["HackUTA 2023", `<b>ROLE:</b> Programmer<BR/>
	<b>TOOLS USED:</b> Python, ReplicateAPI<BR/>
	<b>LINK:</b> <a href='https://github.com/DavixVulcan/HackUTA2023' target="_blank">GitHub Page</a><BR/>
	Implemented a digital photobooth that takes in an image via the Raspberry Pi camera, returning 
	an AI stylized photo to the user. Programmed using python and implemented the Replicate.com API in
	order to achieve the stylization. Photos were then served and hosted via Google Cloud, where
	a QR code would be used to access the photo.
	`],
	["Ludwig Game Jam 2023", `<b>Game:</b> Coots Want to go Home<BR/>
	<b>TOOLS USED:</b> Godot<BR/>
	<b>LINK:</b> <a href='https://github.com/DavixVulcan/LudwigJam2023' target="_blank">GitHub Page</a><BR/>
	Created a game on my own within a week, utilizing the Godot game engine to imlement everything from scratch (Excluding sound
	design)
	`],
	["Habromania", `<b>ROLE:</b> Programmer<BR/>
	<b>TOOLS USED:</b> Godot 4.0<BR/>
	<b>LINK:</b> <a href='https://www.instagram.com/symphony_sonata/' target="_blank">Director's Page</a><BR/>
	Utilized the Godot Game engine to bring the creative direction to fruition. Currently working on the 
	battling system. Working towards getting a demo out soon.
	`],
	["Skills", `<b>C:</b> 3 Years<BR/>
	<b>Python:</b> 2 Years<BR/>
	<b>HTML/CSS/JS:</b> 1 Year<BR/>
	<b>Godot:</b> 3 Years<BR/>
	<b>GitHub:</b> 1 Year<BR/>
	<b>Java:</b> 2 Years<BR/>
	<b>Unreal Engine:</b> 2 Years<BR/>
	<b>Arduino Platform:</b> 3 Years<BR/>
	`]
])

// Map of dates
const dates = new Map ([
	["About", ""],
	["RAUL\'S DIGITAL SPACE", "v0.1.0"],
	["Projects", "as of: OCT 2023"],
	["Ludwig Myth Room Decor", "March 2023"],
	["HackUTA 2023", "Oct 2023"],
	["Ludwig Game Jam 2023", "Feb 2023"],
	["Habromania", "TBD"],
	["Skills", "as of: NOV 2023"]
])


// Toggle drop down
// let dropTog = false;
function drop_down_toggle(open){
	// const menu = document.getElementById("ButtonMenu").children;
	// for (var i = 0; i < menu.length; i++){
	// 	var child = menu[i];
	// 	child.style.textDecoration = "none";
	// }
	// let contentChilds = document.getElementById("ProjectsContent").children;
	// for (var i = 0; i < contentChilds.length; i++){
	// 	var child = contentChilds[i];
	// 	child.style.textDecoration = "none";
	// }
	
	const selectable = document.getElementById("ProjectsButton");
	const content = document.getElementById("ProjectsContent");

	// if(open){
	// 	selectable.innerHTML = "Projects - "
	// 	content.style.maxHeight = content.scrollHeight + "px";
	// 	content.style.padding = "10px";

	// 	const Title = document.getElementById("Title");
	// 	Title.innerHTML = "Projects";
	// 	Title.style.animation = 'none'; 
	// 	Title.offsetHeight;
	// 	Title.style.animation = ''; 
		
	// 	move_to(positions.get("Projects"));
	// 	update_descriptor(descriptions.get("Projects"));
	// 	update_date(dates.get("Projects"));
	// } else {
	// 	content.style.maxHeight = "0px";
	// 	content.style.padding = "0px";
	// 	selectable.innerHTML = "Projects + ";
	// }

	if(content.style.maxHeight !== "0px"){
		content.style.maxHeight = "0px";
		selectable.innerHTML = "Projects + ";
	} else {
		selectable.innerHTML = "Projects - "
		content.style.maxHeight = (content.scrollHeight + 50) + "px";
		// content.style.maxHeight = "auto";
		// console.log("Opening");
	}
}
// Bring it as an onclick function
window.drop_down_toggle = drop_down_toggle;


// Slideshow var loop
let ssvar = 0;

// Animation loop
function animate() {
	requestAnimationFrame( animate );

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;
	ssvar += 2;
	ssvar %= 800;

	// console.log(ssvar);
	if(iswarpav){
		warpfeld.forEach(function(value){
			// console.log(value.map.name);
			value.map.offset.y -= .0025;
		});
		slideshow.forEach(function(value){
			if (ssvar == 0){
				value.map.offset.x += 1/3;
			}
		})

	}

	if(clock){var delta = clock.getDelta();}
	if(mixer) mixer.update(delta);
	renderer.render( scene, camera );
	TWEEN.update();
}

// Update descriptor box
function update_descriptor(flavorText){
	// Get description box and fade out element
	const descriptorbox = document.getElementById("Descriptor");
	const  olddescriptor = descriptorbox.firstElementChild;
	// olddescriptor.setAttribute("class", "fadeDescriptorOut");
	olddescriptor.remove();

	// Make new element to repace it
	const newdescriptor = document.createElement("p");
	newdescriptor.innerHTML = flavorText;
	newdescriptor.setAttribute("class", "newDescription");
	descriptorbox.appendChild(newdescriptor);
}

// This function takes in a camera_allocator object, that extracts
// the position and rotation, and tweens to it
function move_to(p){
	let coords_rots = { 
		x: camera.position.x, y: camera.position.y, z: camera.position.z, 
		xr: camera.rotation.x, yr: camera.rotation.y, zr: camera.rotation.z
	};
	new TWEEN.Tween(coords_rots).to(
		{x: p.x, y: p.y, z: p.z, xr: p.xr, yr: p.yr, zr: p.zr}, 2000
	).onUpdate(() => {
		camera.position.set(coords_rots.x, coords_rots.y, coords_rots.z);
		camera.rotation.set(coords_rots.xr, coords_rots.yr, coords_rots.zr);
	}
	).easing(TWEEN.Easing.Quadratic.InOut).start();
}

// Update dates
function update_date(text){
	const subTitle = document.getElementById("Subtitle");
	subTitle.innerHTML = text;
	subTitle.style.animation = 'none'; 
	subTitle.offsetHeight;
	subTitle.style.animation = ''; 
}

// A wrapper for our onclick function
function selector(text){
	const Title = document.getElementById("Title");
	let new_pos = positions.get(text);
	let new_text = descriptions.get(text);
	let new_date = dates.get(text);
	Title.innerHTML = text;
	Title.style.animation = 'none'; 
	Title.offsetHeight;
	Title.style.animation = ''; 
	move_to(new_pos);
	update_descriptor(new_text);
	update_date(new_date);
	if (text !== "RAUL\'S DIGITAL SPACE" && text !== "Skills" && text !== "About"){
		const menu = document.getElementById("ButtonMenu").children;
		for (var i = 0; i < menu.length; i++){
			var child = menu[i];
			child.style.textDecoration = "none";
		}
		let contentChilds = document.getElementById("ProjectsContent").children;
		for (var i = 0; i < contentChilds.length; i++){
			var child = contentChilds[i];
			child.style.textDecoration = "none";
		}
		
		for (var i = 0; i < contentChilds.length; i++){
			var child = contentChilds[i];
			if (child.innerHTML == text){
				child.style.textDecoration = "underline";
			}
		}
	} else if (text == "RAUL\'S DIGITAL SPACE"){
		// drop_down_toggle(false);
		let contentChilds = document.getElementById("ProjectsContent").children;
		for (var i = 0; i < contentChilds.length; i++){
			var child = contentChilds[i];
			child.style.textDecoration = "none";
		}
		const menu = document.getElementById("ButtonMenu").children;
		for (var i = 0; i < menu.length; i++){
			var child = menu[i];
			child.style.textDecoration = "none";
		}
		for (var i = 0; i < menu.length; i++){
			var child = menu[i];
			if (child.innerHTML == "Home"){
				child.style.textDecoration = "underline white solid 4px";
				child.style.textUnderlineOffset = "6px";
			}
		}

	} else {
		
		// drop_down_toggle(false);
		let contentChilds = document.getElementById("ProjectsContent").children;
		for (var i = 0; i < contentChilds.length; i++){
			var child = contentChilds[i];
			child.style.textDecoration = "none";
		}
		const menu = document.getElementById("ButtonMenu").children;
		for (var i = 0; i < menu.length; i++){
			var child = menu[i];
			child.style.textDecoration = "none";
		}
		for (var i = 0; i < menu.length; i++){
			var child = menu[i];
			if (child.innerHTML == text){
				child.style.textDecoration = "underline white solid 4px";
				child.style.textUnderlineOffset = "6px";
			}
		}
	}
}
// Bring it as an onclick function
window.selector = selector;
move_to(positions.get("RAUL\'S DIGITAL SPACE"));
animate();

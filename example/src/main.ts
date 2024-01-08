/**
 * Example based on the original example of threex.htmlmixer basic demo.
 *
 * @see https://github.com/jeromeetienne/threex.htmlmixer/blob/master/examples/basic.html
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import THREEx from "threex.htmlmixer-continued";

const renderer = new THREE.WebGLRenderer({
	alpha: true,
});
renderer.autoClear = false;
renderer.setClearAlpha(0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const updateFcts: ((delta: number, now: number) => unknown)[] = [];
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.01,
	1000,
);
camera.position.z = 3;

// Create THREEx.HtmlMixer
const mixerContext = new THREEx.htmlMixer.HtmlMixerContext(renderer, camera);

// Handle window resize for mixerContext
window.addEventListener(
	"resize",
	function () {
		mixerContext.rendererCss.setSize(window.innerWidth, window.innerHeight);
	},
	false,
);

// MixerContext configuration and dom attachment

// set up rendererCss
const rendererCss = mixerContext.rendererCss;
rendererCss.setSize(window.innerWidth, window.innerHeight);
// set up rendererWebgl
const rendererWebgl = mixerContext.rendererWebgl;

const css3dElement = rendererCss.domElement;
css3dElement.style.position = "absolute";
css3dElement.style.top = "0px";
css3dElement.style.width = "100%";
css3dElement.style.height = "100%";
document.body.appendChild(css3dElement);

const webglCanvas = rendererWebgl.domElement;
webglCanvas.style.position = "absolute";
webglCanvas.style.top = "0px";
webglCanvas.style.width = "100%";
webglCanvas.style.height = "100%";
webglCanvas.style.pointerEvents = "none";
css3dElement.appendChild(webglCanvas);

// Create a Plane for THREEx.HtmlMixer
// Create the iframe element
const url = "http://threejs.org/";
const domElement = document.createElement("iframe");
domElement.src = url;
domElement.style.border = "none";

// Create the plane
const mixerPlane = new THREEx.htmlMixer.HtmlMixerPlane(
	mixerContext,
	domElement,
);
mixerPlane.object3d.scale.multiplyScalar(2);
scene.add(mixerPlane.object3d);

// Make it move / Update it
updateFcts.push((delta: number) => {
	mixerPlane.object3d.rotation.y += Math.PI * 2 * delta * 0.1;
});

// Add objects in the scene
const material = new THREE.MeshNormalMaterial();

const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5 - 0.125, 0.125);
const torusKnotMesh = new THREE.Mesh(torusKnotGeometry, material);
torusKnotMesh.position.set(+1, 0, +0.5);

const torusKnotGeometry2 = new THREE.TorusKnotGeometry(0.5 - 0.125, 0.125);
const torusKnotGeometry2Mesh = new THREE.Mesh(torusKnotGeometry2, material);
torusKnotGeometry2Mesh.position.set(-1, 0, -0.5);

scene.add(torusKnotMesh, torusKnotGeometry2Mesh);

// Camera Controls
new OrbitControls(camera, rendererCss.domElement);

// Handle resize
function onResize() {
	// notify the renderer of the size change
	renderer.setSize(window.innerWidth, window.innerHeight);
	// update the camera
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

window.addEventListener("resize", onResize, false);

// Render the css3d
updateFcts.push(function () {
	// NOTE: it must be after camera mode
	mixerContext.update();
});

// Render the webgl
updateFcts.push(function () {
	renderer.render(scene, camera);
});

// Loop runner
let lastTimeMsec: null | number = null;
requestAnimationFrame(function animate(nowMsec) {
	// Keep looping
	requestAnimationFrame(animate);
	// Measure time
	lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
	const deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
	lastTimeMsec = nowMsec;
	// Call each update function
	updateFcts.forEach(function (updateFn) {
		updateFn(deltaMsec / 1000, nowMsec / 1000);
	});
});

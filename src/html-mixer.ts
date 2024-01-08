import * as THREE from "three";
import {
	CSS3DObject,
	CSS3DRenderer,
} from "three/examples/jsm/renderers/CSS3DRenderer";

export class HtmlMixerContext {
	public cssFactor: number;
	public rendererCss: CSS3DRenderer;
	public rendererWebgl: THREE.WebGLRenderer | THREE.WebGL1Renderer;
	public cssScene: THREE.Scene;
	public autoUpdateObjects: boolean;
	public updateFcts: (() => unknown)[] = [];

	/**
	 * @param rendererWebgl The renderer in front.
	 * @param camera The camera used.
	 */
	constructor(
		rendererWebgl: THREE.WebGLRenderer | THREE.WebGL1Renderer,
		camera: THREE.PerspectiveCamera,
	) {
		// Build cssFactor to workaround bug due to no display.
		this.cssFactor = 1000;

		// Update Renderer
		this.rendererCss = new CSS3DRenderer();
		this.rendererWebgl = rendererWebgl;

		// Handle Camera
		const cssCamera = new THREE.PerspectiveCamera(
			camera.fov,
			camera.aspect,
			camera.near * this.cssFactor,
			camera.far * this.cssFactor,
		);

		this.updateFcts.push(() => {
			cssCamera.quaternion.copy(camera.quaternion);

			cssCamera.position.copy(camera.position).multiplyScalar(this.cssFactor);
		});

		// Create a new scene to hold CSS.
		this.cssScene = new THREE.Scene();

		// Auto update objects
		this.autoUpdateObjects = true;
		this.updateFcts.push(() => {
			if (this.autoUpdateObjects !== true) return;
			this.cssScene.traverse(function (cssObject) {
				if (cssObject instanceof THREE.Scene) return;
				const mixerPlane = cssObject.userData.mixerPlane as HtmlMixerPlane;
				if (mixerPlane === undefined) return;
				mixerPlane.update();
			});
		});

		// Render CssScene
		this.updateFcts.push(() => {
			this.rendererCss.render(this.cssScene, cssCamera);
		});
	}

	public update() {
		this.updateFcts.forEach((updateFct) => updateFct());
	}
}

export interface HtmlMixerPlaneOpts {
	elementW?: number;
	object3d?: THREE.Mesh<THREE.PlaneGeometry>;
	planeH?: number;
	planeW?: number;
}

/** Define a THREEx Plane. */
export class HtmlMixerPlane {
	public opts: HtmlMixerPlaneOpts;
	public domElement: HTMLElement;
	public object3d: THREE.Mesh<THREE.PlaneGeometry>;
	public cssObject: CSS3DObject;
	public updateFcts: (() => unknown)[] = [];
	public setDomElement: (newDomElement: HTMLElement) => void;

	/**
	 * @param mixerContext context
	 * @param domElement   the dom element to mix
	 * @param opts         options to set
	 */
	constructor(
		mixerContext: HtmlMixerContext,
		domElement: HTMLElement,
		opts?: HtmlMixerPlaneOpts,
	) {
		this.opts = opts || {};
		this.opts.elementW =
			this.opts.elementW !== undefined ? this.opts.elementW : 768;
		this.opts.planeW = this.opts.planeW !== undefined ? this.opts.planeW : 1;
		this.opts.planeH =
			this.opts.planeH !== undefined ? this.opts.planeH : 3 / 4;
		this.domElement = domElement;

		if (!this.opts.object3d) {
			const planeMaterial = new THREE.MeshBasicMaterial({
				opacity: 0,
				color: new THREE.Color("black"),
				blending: THREE.NoBlending,
				side: THREE.DoubleSide,
			});
			const geometry = new THREE.PlaneGeometry(
				this.opts.planeW,
				this.opts.planeH,
			);
			this.object3d = new THREE.Mesh(geometry, planeMaterial);
		} else {
			this.object3d = this.opts.object3d;
		}

		// width of iframe in pixels
		const aspectRatio = this.opts.planeH / this.opts.planeW;
		const elementWidth = this.opts.elementW;
		const elementHeight = elementWidth * aspectRatio;

		this.setDomElement = (newDomElement) => {
			// remove the oldDomElement
			const oldDomElement = domElement;
			if (oldDomElement.parentNode)
				oldDomElement.parentNode.removeChild(oldDomElement);

			// update local constiables
			this.domElement = domElement = newDomElement;
			// update cssObject
			cssObject.element = domElement;
			// reset the size of the domElement
			setDomElementSize();
		};

		function setDomElementSize() {
			domElement.style.width = elementWidth + "px";
			domElement.style.height = elementHeight + "px";
		}

		setDomElementSize();

		// create a CSS3DObject to display element
		const cssObject = new CSS3DObject(domElement);
		this.cssObject = cssObject;
		cssObject.scale
			.set(1, 1, 1)
			.multiplyScalar(
				mixerContext.cssFactor / (elementWidth / this.opts.planeH),
			);

		// Hook cssObhect to mixerPlane.
		cssObject.userData.mixerPlane = this;

		// Hook event so cssObject is attached to cssScene when object3d is added/removed.
		this.object3d.addEventListener("added", () => {
			mixerContext.cssScene.add(cssObject);
		});
		this.object3d.addEventListener("removed", () => {
			mixerContext.cssScene.remove(cssObject);
		});

		this.updateFcts.push(() => {
			// get world position
			this.object3d.updateMatrixWorld();
			const worldMatrix = this.object3d.matrixWorld;

			// get position/quaternion/scale of object3d
			const position = new THREE.Vector3();
			const scale = new THREE.Vector3();
			const quaternion = new THREE.Quaternion();
			worldMatrix.decompose(position, quaternion, scale);

			// handle quaternion
			cssObject.quaternion.copy(quaternion);

			// handle position
			cssObject.position.copy(position).multiplyScalar(mixerContext.cssFactor);
			// handle scale
			const scaleFactor =
				elementWidth / (this.object3d.geometry.parameters.width * scale.x);
			cssObject.scale
				.set(1, 1, 1)
				.multiplyScalar(mixerContext.cssFactor / scaleFactor);
		});
	}

	public update() {
		this.updateFcts.forEach((updateFct) => updateFct());
	}
}

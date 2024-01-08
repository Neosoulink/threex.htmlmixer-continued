# Threex.htmlmixer-continued

`Threex.htmlmixer` is a _ThreeJs extension_ to seamlessly integrate actual dom elements in your ThreeJs app. It uses a clever blending trick to mix CSS3 and Webgl. See details in the ["Mixing HTML Pages Inside Your WebGL"](https://www.25yearsofprogramming.com/threejs-tutorials/mixing-html-pages-inside-your-webgl.html) post on the [25yearsofprogramming.com blog](https://www.25yearsofprogramming.com/). It provides a great way to interact with 2D and 3D.
For example, you can include a YouTube player inside a movie screen. Additionally, you can easily access the content of the whole web and include it in your three.js app.

## 🎈 Motivations

This small library is a continued version of the original one made by @jeromeetienne. And I recommend checking the source repo [📌 here](https://github.com/jeromeetienne/threex.htmlmixer).

Yes! This extension is almost exactly like the original one and works almost the same. But by creating this repo, I'm allowing you to use it more efficiently and conveniently, first by installing it via a package manager like `npm` and providing some good typing support. hope you'll enjoy using it 📦.

## 🛠 Installation

You can install it by using `yarn` or `npm` by entering the following command:

```bash
# With npm
npm install threex.htmlmixer-continued

# With yarn
yarn add threex.htmlmixer-continued
```

## 💻 How to use it

### Importation & instantiation

```ts
// Threex importation
import THREEx from "threex.htmlmixer-continued";

// Create a new context instance.
const mixerContext  = new THREEx.htmlMixer.HtmlMixerContext(
  webglRenderer,
  perspectiveCamera
);
```

💡 See [HtmlMixerContext](./src/html-mixer.ts#L7) class

### Update the context on every frame

```ts
// 🚧 It's important to update the context before the main renderer.
mixerContext.update();
webglRenderer.update();
```

### Create a plane

```ts
// Create a new plane, pass it the above context and a domElement
const mixerPlane = new THREEx.htmlMixer.HtmlMixerPlane(
  mixerContext,
  domElement
);
// Add it to the active scene
scene.add(mixerPlane.object3d);
```

> 💡 [See the example](./example/src//main.ts) for more details

### Tips

There is a helper for iframe as it is a common use case.

```javascript
const url = 'http://threejs.com';
const mixerIframeElement = THREEx.htmlMixerHelper.createIframeDomElement(mixerContext, url);
const mixerPlane = THREEx.HtmlMixer.HtmlMixerPlane(mixerContext, mixerIframeElement);
scene.add(mixerPlane.object3d);
```

## ✨ Credits

A big thanks to @jeromeetienne for the original code source ❤
Check the repo [📌 here](https://github.com/jeromeetienne/threex.htmlmixer) and he's [Github here](https://github.com/jeromeetienne).

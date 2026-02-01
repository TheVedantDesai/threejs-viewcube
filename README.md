# threejs-viewcube

A customizable ViewCube component for Three.js and Potree projects. Provides an intuitive 3D orientation indicator that syncs with your camera and allows users to quickly navigate to standard views.

![ViewCube Demo](https://via.placeholder.com/400x200?text=ViewCube+Demo)

## Features

- 🎯 **Customizable** - Colors, labels, fonts, sizes
- 🔄 **Coordinate Systems** - Supports both Y-up (Three.js) and Z-up (Potree/CAD)
- 🖱️ **Interactive** - Click faces to navigate, drag to rotate
- 📦 **Lightweight** - Pure ES modules, no build step required
- 🎨 **Stylish** - Dashed edges, hover effects, smooth rendering

## Installation

```bash
npm install threejs-viewcube
```

Or copy the `src` folder directly into your project.

## Examples

Check out the [examples folder](https://github.com/TheVedantDesai/threejs-viewcube/tree/main/examples) for complete implementations:

- [Basic Three.js Integration](https://github.com/TheVedantDesai/threejs-viewcube/blob/main/examples/threejs-basic.html)
- [Potree Integration](https://github.com/TheVedantDesai/threejs-viewcube/blob/main/examples/potree-integration.html)

To run examples locally:

```bash
git clone https://github.com/TheVedantDesai/threejs-viewcube.git
cd threejs-viewcube
npm install
npm run example
```

## Quick Start

```javascript
import * as THREE from 'three';
import { ViewCube, FACES } from 'threejs-viewcube';

// Create your Three.js scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create ViewCube
const viewCube = new ViewCube({
  container: document.getElementById('canvas-container'),
  coordinateSystem: 'Y-up', // or 'Z-up' for Potree
  size: 120,
  position: 'top-right'
});

// Handle face clicks - animate your camera to the new position
viewCube.on('faceClick', (faceId, config) => {
  console.log('Navigate to:', faceId);
  // config contains: { position, up, lookAt }
  // Use these to animate your camera:
  // camera.position.copy(config.position);
  // camera.up.set(config.up.x, config.up.y, config.up.z);
  // camera.lookAt(0, 0, 0);
});

// Handle drag rotation
viewCube.on('drag', (deltaX, deltaY) => {
  // Rotate your scene or orbit controls
  console.log('Drag:', deltaX, deltaY);
});

// In your animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update ViewCube to match camera orientation
  viewCube.update(camera);
  
  renderer.render(scene, camera);
}
animate();

// Cleanup when done
// viewCube.dispose();
```

## API Reference

### Constructor Options

```javascript
new ViewCube({
  // Required
  container: HTMLElement,      // Container element
  
  // Layout
  size: 120,                   // Overlay size in pixels
  position: 'top-right',       // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  
  // Coordinate System
  coordinateSystem: 'Z-up',    // 'Y-up' | 'Z-up'
  cameraDistance: 100,         // Distance for camera positions
  
  // Cube Dimensions
  cubeSize: 30,                // 3D cube size
  edgeSize: 5,                 // Edge/corner region size
  
  // Appearance
  colors: {
    main: 0xDDDDDD,            // Main face color
    hover: 0x87CEEB,           // Hover highlight (sky blue)
    outline: 0x666666          // Edge outline color
  },
  
  // Labels
  labels: {
    top: 'TOP',
    bottom: 'BOTTOM',
    front: 'FRONT',
    back: 'BACK',
    left: 'LEFT',
    right: 'RIGHT'
  },
  
  // Font
  font: {
    family: 'Arial Narrow, sans-serif',
    size: 45
  },
  
  // Features
  showOutline: true,           // Show dashed edge lines
  showEdges: true,             // Show clickable edges
  showCorners: true            // Show clickable corners
});
```

### Methods

| Method | Description |
|--------|-------------|
| `update(camera)` | Sync ViewCube with camera orientation. Call in animation loop. |
| `on(event, callback)` | Add event listener |
| `off(event, callback)` | Remove event listener |
| `getFaceConfig(faceId)` | Get camera config for a face |
| `getAllFaceConfigs()` | Get all face configurations |
| `setSize(pixels)` | Change overlay size |
| `setPosition(position)` | Change corner position |
| `dispose()` | Clean up resources |

### Events

| Event | Callback Arguments | Description |
|-------|-------------------|-------------|
| `faceClick` | `(faceId, config)` | Face/edge/corner clicked |
| `drag` | `(deltaX, deltaY)` | Mouse dragged on cube |

### Face IDs

```javascript
import { FACES } from 'threejs-viewcube';

FACES.TOP    // 1
FACES.FRONT  // 2
FACES.RIGHT  // 3
FACES.BACK   // 4
FACES.LEFT   // 5
FACES.BOTTOM // 6
// Plus edges (7-18) and corners (19-26)
```

## Potree Integration

```javascript
import { ViewCube } from 'threejs-viewcube';

// Create ViewCube for Potree (Z-up coordinate system)
const viewCube = new ViewCube({
  container: document.getElementById('potree_render_area'),
  coordinateSystem: 'Z-up',
  size: 120
});

// Handle face clicks
viewCube.on('faceClick', (faceId, config) => {
  const view = viewer.scene.view;
  const camera = viewer.scene.getActiveCamera();
  
  // Set camera position
  view.position.set(config.position.x, config.position.y, config.position.z);
  camera.up.set(config.up.x, config.up.y, config.up.z);
  view.lookAt(new THREE.Vector3(0, 0, 0));
});

// Handle drag rotation
viewCube.on('drag', (deltaX, deltaY) => {
  // Implement spherical rotation for Potree
  const view = viewer.scene.view;
  // ... rotation logic
});

// In Potree's animation loop
viewer.addEventListener('update', () => {
  const camera = viewer.scene.getActiveCamera();
  viewCube.update(camera);
});
```

## Using ViewCubeMesh Directly

For advanced use cases, you can use the `ViewCubeMesh` class directly:

```javascript
import { ViewCubeMesh } from 'threejs-viewcube';

const cube = new ViewCubeMesh({
  size: 30,
  coordinateSystem: 'Z-up',
  colors: { main: 0xFFFFFF, hover: 0x00FF00 }
});

// Add to your own scene
myScene.add(cube);

// Update orientation
cube.setQuaternion(camera.quaternion);

// Set hover
cube.setHover(FACES.FRONT);
cube.clearHover();
```

## License

MIT

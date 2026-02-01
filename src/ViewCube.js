import * as THREE from 'three';
import { ViewCubeMesh } from './ViewCubeMesh.js';
import { FACES, getFaceConfigs } from './faces.js';

/**
 * ViewCube - A customizable 3D orientation cube for Three.js and Potree
 * 
 * @example
 * const viewCube = new ViewCube({
 *   container: document.getElementById('viewcube'),
 *   coordinateSystem: 'Z-up',
 *   size: 120
 * });
 * 
 * // In animation loop
 * viewCube.update(camera);
 * 
 * // Listen for events
 * viewCube.on('faceClick', (faceId, config) => {
 *   // Animate camera to config.position, config.up, config.lookAt
 * });
 */
export class ViewCube {
    /**
     * Create a ViewCube
     * @param {Object} options - Configuration options
     * @param {HTMLElement} options.container - Container element for the cube
     * @param {number} [options.size=120] - Size of the cube overlay in pixels
     * @param {string} [options.position='top-right'] - Position: 'top-right', 'top-left', 'bottom-right', 'bottom-left'
     * @param {string} [options.coordinateSystem='Z-up'] - 'Y-up' or 'Z-up'
     * @param {number} [options.cubeSize=30] - Size of the 3D cube
     * @param {number} [options.edgeSize=5] - Size of edge/corner regions
     * @param {Object} [options.colors] - Color configuration
     * @param {number} [options.colors.main=0xDDDDDD] - Main face color
     * @param {number} [options.colors.hover=0x87CEEB] - Hover highlight color
     * @param {number} [options.colors.outline=0x666666] - Outline color
     * @param {Object} [options.labels] - Custom face labels
     * @param {Object} [options.font] - Font configuration
     * @param {number} [options.cameraDistance=100] - Distance for camera configurations
     */
    constructor(options = {}) {
        this._options = {
            container: options.container,
            size: options.size || 120,
            position: options.position || 'top-right',
            coordinateSystem: options.coordinateSystem || 'Z-up',
            cubeSize: options.cubeSize || 30,
            edgeSize: options.edgeSize || 5,
            colors: options.colors || {},
            labels: options.labels || {},
            font: options.font || {},
            cameraDistance: options.cameraDistance || 100,
            showOutline: options.showOutline !== false,
            showEdges: options.showEdges !== false,
            showCorners: options.showCorners !== false
        };

        this._eventListeners = {};
        this._isDragging = false;
        this._previousMousePosition = { x: 0, y: 0 };

        this._init();
    }

    _init() {
        const { container, size, position } = this._options;

        // Create container div if not provided
        if (!container) {
            throw new Error('ViewCube: container element is required');
        }

        // Create canvas container
        this._containerDiv = document.createElement('div');
        this._containerDiv.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      pointer-events: auto;
      z-index: 1000;
      ${this._getPositionStyle(position)}
    `;
        container.style.position = 'relative';
        container.appendChild(this._containerDiv);

        // Create renderer
        this._renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this._renderer.setSize(size, size);
        this._renderer.setClearColor(0x000000, 0);
        this._containerDiv.appendChild(this._renderer.domElement);

        // Create scene and camera
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        this._camera.position.set(0, 0, 70);
        this._camera.lookAt(0, 0, 0);

        // Create cube mesh
        this._cube = new ViewCubeMesh({
            size: this._options.cubeSize,
            edgeSize: this._options.edgeSize,
            coordinateSystem: this._options.coordinateSystem,
            colors: this._options.colors,
            labels: this._options.labels,
            font: this._options.font,
            showOutline: this._options.showOutline,
            showEdges: this._options.showEdges,
            showCorners: this._options.showCorners
        });
        this._scene.add(this._cube);

        // Get face configurations
        this._faceConfigs = getFaceConfigs(
            this._options.coordinateSystem,
            this._options.cameraDistance
        );

        // Setup event listeners
        this._setupEventListeners();
    }

    _getPositionStyle(position) {
        const margin = '10px';
        switch (position) {
            case 'top-left':
                return `top: ${margin}; left: ${margin};`;
            case 'bottom-right':
                return `bottom: ${margin}; right: ${margin};`;
            case 'bottom-left':
                return `bottom: ${margin}; left: ${margin};`;
            case 'top-right':
            default:
                return `top: ${margin}; right: ${margin};`;
        }
    }

    _setupEventListeners() {
        const canvas = this._renderer.domElement;

        canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
        canvas.addEventListener('click', this._onClick.bind(this));
        canvas.addEventListener('mousedown', this._onMouseDown.bind(this));

        // Document-level listeners for drag continuation
        this._onDocumentMouseMove = this._onDocumentMouseMove.bind(this);
        this._onDocumentMouseUp = this._onDocumentMouseUp.bind(this);
    }

    _getNormalizedCoords(event) {
        const rect = this._renderer.domElement.getBoundingClientRect();
        return {
            x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
            y: -((event.clientY - rect.top) / rect.height) * 2 + 1
        };
    }

    _raycast(coords) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(coords, this._camera);
        return raycaster.intersectObjects(this._cube.children, true);
    }

    _onMouseMove(event) {
        if (this._isDragging) return;

        const coords = this._getNormalizedCoords(event);
        const intersects = this._raycast(coords);

        this._cube.clearHover();

        if (intersects.length > 0) {
            for (const { object } of intersects) {
                if (object.name) {
                    this._cube.setHover(object.name);
                    this._renderer.domElement.style.cursor = 'pointer';
                    return;
                }
            }
        }
        this._renderer.domElement.style.cursor = 'default';
    }

    _onClick(event) {
        if (this._isDragging) return;

        const coords = this._getNormalizedCoords(event);
        const intersects = this._raycast(coords);

        if (intersects.length > 0) {
            for (const { object } of intersects) {
                if (object.name) {
                    const faceId = object.name;
                    const config = this._faceConfigs[faceId];
                    if (config) {
                        this._emit('faceClick', faceId, config);
                    }
                    return;
                }
            }
        }
    }

    _onMouseDown(event) {
        this._isDragging = true;
        this._previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        this._renderer.domElement.style.cursor = 'grabbing';

        document.addEventListener('mousemove', this._onDocumentMouseMove);
        document.addEventListener('mouseup', this._onDocumentMouseUp);
    }

    _onDocumentMouseMove(event) {
        if (!this._isDragging) return;

        const deltaX = event.clientX - this._previousMousePosition.x;
        const deltaY = event.clientY - this._previousMousePosition.y;

        this._emit('drag', deltaX, deltaY);

        this._previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    _onDocumentMouseUp() {
        this._isDragging = false;
        this._renderer.domElement.style.cursor = 'default';

        document.removeEventListener('mousemove', this._onDocumentMouseMove);
        document.removeEventListener('mouseup', this._onDocumentMouseUp);
    }

    /**
     * Update the ViewCube orientation from camera
     * Call this in your animation loop
     * @param {THREE.Camera} camera - The main scene camera
     */
    update(camera) {
        if (camera && camera.quaternion) {
            this._cube.setQuaternion(camera.quaternion);
        }
        this._renderer.render(this._scene, this._camera);
    }

    /**
     * Add event listener
     * @param {string} event - Event name: 'faceClick', 'drag'
     * @param {Function} callback - Event handler
     */
    on(event, callback) {
        if (!this._eventListeners[event]) {
            this._eventListeners[event] = [];
        }
        this._eventListeners[event].push(callback);
        return this;
    }

    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Event handler to remove
     */
    off(event, callback) {
        if (this._eventListeners[event]) {
            this._eventListeners[event] = this._eventListeners[event].filter(cb => cb !== callback);
        }
        return this;
    }

    _emit(event, ...args) {
        if (this._eventListeners[event]) {
            this._eventListeners[event].forEach(cb => cb(...args));
        }
    }

    /**
     * Get face configuration by face ID
     * @param {number} faceId - Face ID from FACES constant
     * @returns {Object} Configuration with position, up, lookAt
     */
    getFaceConfig(faceId) {
        return this._faceConfigs[faceId];
    }

    /**
     * Get all face configurations
     * @returns {Object} All face configurations
     */
    getAllFaceConfigs() {
        return { ...this._faceConfigs };
    }

    /**
     * Set cube size
     * @param {number} size - New size in pixels
     */
    setSize(size) {
        this._options.size = size;
        this._containerDiv.style.width = `${size}px`;
        this._containerDiv.style.height = `${size}px`;
        this._renderer.setSize(size, size);
    }

    /**
     * Set position
     * @param {string} position - 'top-right', 'top-left', 'bottom-right', 'bottom-left'
     */
    setPosition(position) {
        this._options.position = position;
        const style = this._getPositionStyle(position);
        this._containerDiv.style.cssText = `
      position: absolute;
      width: ${this._options.size}px;
      height: ${this._options.size}px;
      pointer-events: auto;
      z-index: 1000;
      ${style}
    `;
    }

    /**
     * Dispose of the ViewCube and clean up resources
     */
    dispose() {
        // Remove event listeners
        document.removeEventListener('mousemove', this._onDocumentMouseMove);
        document.removeEventListener('mouseup', this._onDocumentMouseUp);

        // Dispose Three.js resources
        this._renderer.dispose();
        this._scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (object.material.map) object.material.map.dispose();
                object.material.dispose();
            }
        });

        // Remove DOM elements
        if (this._containerDiv && this._containerDiv.parentNode) {
            this._containerDiv.parentNode.removeChild(this._containerDiv);
        }
    }
}

// Export constants
export { FACES, getFaceConfigs } from './faces.js';

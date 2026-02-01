import * as THREE from 'three';
import { FACES } from './faces.js';
import { createTextTexture } from './utils.js';

const DEG_TO_RAD = Math.PI / 180;

/**
 * ViewCubeMesh - The 3D cube mesh with faces, edges, and corners
 */
export class ViewCubeMesh extends THREE.Object3D {
    constructor(options = {}) {
        super();

        this._options = {
            size: options.size || 30,
            edgeSize: options.edgeSize || 5,
            showOutline: options.showOutline !== false,
            showEdges: options.showEdges !== false,
            showCorners: options.showCorners !== false,
            coordinateSystem: options.coordinateSystem || 'Z-up',
            colors: {
                main: options.colors?.main ?? 0xDDDDDD,
                hover: options.colors?.hover ?? 0x87CEEB,
                outline: options.colors?.outline ?? 0x666666,
                ...options.colors
            },
            labels: {
                top: options.labels?.top ?? 'TOP',
                bottom: options.labels?.bottom ?? 'BOTTOM',
                front: options.labels?.front ?? 'FRONT',
                back: options.labels?.back ?? 'BACK',
                left: options.labels?.left ?? 'LEFT',
                right: options.labels?.right ?? 'RIGHT',
                ...options.labels
            },
            font: {
                family: options.font?.family ?? 'Arial Narrow, sans-serif',
                size: options.font?.size ?? 45,
                ...options.font
            }
        };

        this._bgColor = this._options.colors.main;
        this._hoverColor = this._options.colors.hover;
        this._outlineColor = this._options.colors.outline;

        this._build();
    }

    _build() {
        const { size, edgeSize, coordinateSystem } = this._options;
        const faceSize = size - edgeSize * 2;
        const faceOffset = size / 2;
        const borderSize = edgeSize;

        // Apply coordinate system rotation
        if (coordinateSystem === 'Z-up') {
            this.rotation.x = -Math.PI / 2;
        }

        // Create main faces
        const cubeFaces = this._createCubeFaces(faceSize, faceOffset);
        const faceLabels = this._getFaceLabels();
        for (let [i, props] of faceLabels.entries()) {
            cubeFaces.children[i].name = props.name;
            cubeFaces.children[i].material.color.setHex(this._bgColor);
            cubeFaces.children[i].material.map = props.map;
        }
        this.add(cubeFaces);

        // Create corners
        if (this._options.showCorners) {
            this._createCorners(borderSize, faceOffset);
        }

        // Create edges
        if (this._options.showEdges) {
            this._createEdges(borderSize, faceSize, faceOffset);
        }

        // Create outline
        if (this._options.showOutline) {
            this.add(this._createCubeOutline(size));
        }
    }

    _getFaceLabels() {
        const { labels, font } = this._options;
        const fontOpts = { fontSize: font.size, font: font.family };

        return [
            { name: FACES.FRONT, map: createTextTexture(THREE, labels.front, fontOpts) },
            { name: FACES.RIGHT, map: createTextTexture(THREE, labels.right, fontOpts) },
            { name: FACES.BACK, map: createTextTexture(THREE, labels.back, fontOpts) },
            { name: FACES.LEFT, map: createTextTexture(THREE, labels.left, fontOpts) },
            { name: FACES.TOP, map: createTextTexture(THREE, labels.top, { ...fontOpts, rotation: 180 }) },
            { name: FACES.BOTTOM, map: createTextTexture(THREE, labels.bottom, { ...fontOpts, rotation: 180 }) }
        ];
    }

    _createFace(size, position, { axis = [0, 1, 0], angle = 0, name = "", matProps = {} } = {}) {
        if (!Array.isArray(size)) size = [size, size];
        const material = new THREE.MeshBasicMaterial(matProps);
        const geometry = new THREE.PlaneGeometry(size[0], size[1]);
        const face = new THREE.Mesh(geometry, material);
        face.name = name;
        face.rotateOnAxis(new THREE.Vector3(...axis), angle * DEG_TO_RAD);
        face.position.set(...position);
        return face;
    }

    _createCubeFaces(faceSize, offset) {
        const faces = new THREE.Object3D();
        faces.add(this._createFace(faceSize, [0, 0, offset], { axis: [0, 1, 0], angle: 0 }));
        faces.add(this._createFace(faceSize, [offset, 0, 0], { axis: [0, 1, 0], angle: 90 }));
        faces.add(this._createFace(faceSize, [0, 0, -offset], { axis: [0, 1, 0], angle: 180 }));
        faces.add(this._createFace(faceSize, [-offset, 0, 0], { axis: [0, 1, 0], angle: 270 }));

        // TOP face with 180 deg rotation to fix text orientation
        const topFace = this._createFace(faceSize, [0, offset, 0], { axis: [1, 0, 0], angle: -90 });
        topFace.rotateZ(Math.PI);
        faces.add(topFace);

        // BOTTOM face with 180 deg rotation to fix text orientation
        const bottomFace = this._createFace(faceSize, [0, -offset, 0], { axis: [1, 0, 0], angle: 90 });
        bottomFace.rotateZ(Math.PI);
        faces.add(bottomFace);

        return faces;
    }

    _createCorners(borderSize, faceOffset) {
        const cornerFaces = [
            FACES.TOP_FRONT_RIGHT_CORNER,
            FACES.TOP_BACK_RIGHT_CORNER,
            FACES.TOP_BACK_LEFT_CORNER,
            FACES.TOP_FRONT_LEFT_CORNER,
            FACES.BOTTOM_BACK_RIGHT_CORNER,
            FACES.BOTTOM_FRONT_RIGHT_CORNER,
            FACES.BOTTOM_FRONT_LEFT_CORNER,
            FACES.BOTTOM_BACK_LEFT_CORNER
        ];

        for (let [i, name] of cornerFaces.entries()) {
            const corner = this._createCornerFaces(borderSize, faceOffset, name, { color: this._bgColor });
            corner.rotateOnAxis(new THREE.Vector3(0, 1, 0), (i % 4) * 90 * DEG_TO_RAD);
            if (i >= 4) {
                corner.rotateOnAxis(new THREE.Vector3(1, 0, 0), 180 * DEG_TO_RAD);
            }
            this.add(corner);
        }
    }

    _createCornerFaces(faceSize, offset, name = "", matProps = {}) {
        const corner = new THREE.Object3D();
        const borderOffset = offset - faceSize / 2;
        corner.add(this._createFace(faceSize, [borderOffset, borderOffset, offset], { axis: [0, 1, 0], angle: 0, matProps, name }));
        corner.add(this._createFace(faceSize, [offset, borderOffset, borderOffset], { axis: [0, 1, 0], angle: 90, matProps, name }));
        corner.add(this._createFace(faceSize, [borderOffset, offset, borderOffset], { axis: [1, 0, 0], angle: -90, matProps, name }));
        return corner;
    }

    _createEdges(borderSize, faceSize, faceOffset) {
        // Top edges
        const topEdgeFaces = [
            FACES.TOP_FRONT_EDGE,
            FACES.TOP_RIGHT_EDGE,
            FACES.TOP_BACK_EDGE,
            FACES.TOP_LEFT_EDGE
        ];

        const edges = [];
        for (let [i, name] of topEdgeFaces.entries()) {
            const edge = this._createHorzEdgeFaces(faceSize, borderSize, faceOffset, name, { color: this._bgColor });
            edge.rotateOnAxis(new THREE.Vector3(0, 1, 0), i * 90 * DEG_TO_RAD);
            edges.push(edge);
        }

        const topEdges = new THREE.Group();
        const bottomEdges = new THREE.Group();
        this.add(topEdges.add(...edges.slice(0, 4)));

        // Bottom edges (mirrored)
        const bottomEdgeFaces = [
            FACES.BOTTOM_BACK_EDGE,
            FACES.BOTTOM_RIGHT_EDGE,
            FACES.BOTTOM_FRONT_EDGE,
            FACES.BOTTOM_LEFT_EDGE
        ];

        for (let [i, name] of bottomEdgeFaces.entries()) {
            const edge = this._createHorzEdgeFaces(faceSize, borderSize, faceOffset, name, { color: this._bgColor });
            edge.rotateOnAxis(new THREE.Vector3(0, 1, 0), i * 90 * DEG_TO_RAD);
            bottomEdges.add(edge);
        }
        bottomEdges.rotateOnAxis(new THREE.Vector3(1, 0, 0), 180 * DEG_TO_RAD);
        this.add(bottomEdges);

        // Side edges
        const sideEdgeFaces = [
            FACES.FRONT_RIGHT_EDGE,
            FACES.BACK_RIGHT_EDGE,
            FACES.BACK_LEFT_EDGE,
            FACES.FRONT_LEFT_EDGE
        ];

        const sideEdges = new THREE.Group();
        for (let [i, name] of sideEdgeFaces.entries()) {
            const edge = this._createVertEdgeFaces(borderSize, faceSize, faceOffset, name, { color: this._bgColor });
            edge.rotateOnAxis(new THREE.Vector3(0, 1, 0), i * 90 * DEG_TO_RAD);
            sideEdges.add(edge);
        }
        this.add(sideEdges);
    }

    _createHorzEdgeFaces(w, h, offset, name = "", matProps = {}) {
        const edge = new THREE.Object3D();
        const borderOffset = offset - h / 2;
        edge.add(this._createFace([w, h], [0, borderOffset, offset], { axis: [0, 1, 0], angle: 0, name, matProps }));
        edge.add(this._createFace([w, h], [0, offset, borderOffset], { axis: [1, 0, 0], angle: -90, name, matProps }));
        return edge;
    }

    _createVertEdgeFaces(w, h, offset, name = "", matProps = {}) {
        const edge = new THREE.Object3D();
        const borderOffset = offset - w / 2;
        edge.add(this._createFace([w, h], [borderOffset, 0, offset], { axis: [0, 1, 0], angle: 0, name, matProps }));
        edge.add(this._createFace([w, h], [offset, 0, borderOffset], { axis: [0, 1, 0], angle: 90, name, matProps }));
        return edge;
    }

    _createCubeOutline(size) {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const geo = new THREE.EdgesGeometry(geometry);
        const mat = new THREE.LineDashedMaterial({
            color: this._outlineColor,
            linewidth: 1,
            dashSize: 3,
            gapSize: 2
        });
        const wireframe = new THREE.LineSegments(geo, mat);
        wireframe.computeLineDistances();
        return wireframe;
    }

    /**
     * Set hover state for a face
     */
    setHover(faceId) {
        this.traverse((obj) => {
            if (obj.name) {
                obj.material.color.setHex(obj.name === faceId ? this._hoverColor : this._bgColor);
            }
        });
    }

    /**
     * Clear all hover states
     */
    clearHover() {
        this.traverse((obj) => {
            if (obj.name) {
                obj.material.color.setHex(this._bgColor);
            }
        });
    }

    /**
     * Set cube rotation from quaternion
     */
    setQuaternion(quaternion) {
        const coordinateSystem = this._options.coordinateSystem;

        if (coordinateSystem === 'Z-up') {
            // Convert from Z-up camera quaternion to Y-up ViewCube
            const zUpToYUp = new THREE.Quaternion();
            zUpToYUp.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
            const invertedQuat = quaternion.clone().invert();
            const finalQuat = new THREE.Quaternion();
            finalQuat.multiplyQuaternions(invertedQuat, zUpToYUp);
            this.setRotationFromQuaternion(finalQuat);
        } else {
            // Y-up system - just invert
            const invertedQuat = quaternion.clone().invert();
            this.setRotationFromQuaternion(invertedQuat);
        }
    }
}

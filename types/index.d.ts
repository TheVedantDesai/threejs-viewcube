import * as THREE from 'three';

export interface ViewCubeOptions {
    container: HTMLElement;
    size?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    coordinateSystem?: 'Y-up' | 'Z-up';
    cubeSize?: number;
    edgeSize?: number;
    cameraDistance?: number;
    showOutline?: boolean;
    showEdges?: boolean;
    showCorners?: boolean;
    colors?: {
        main?: number;
        hover?: number;
        outline?: number;
    };
    labels?: {
        top?: string;
        bottom?: string;
        front?: string;
        back?: string;
        left?: string;
        right?: string;
    };
    font?: {
        family?: string;
        size?: number;
    };
}

export interface FaceConfig {
    position: { x: number; y: number; z: number };
    up: { x: number; y: number; z: number };
    lookAt: { x: number; y: number; z: number };
}

export type FaceClickHandler = (faceId: number, config: FaceConfig) => void;
export type DragHandler = (deltaX: number, deltaY: number) => void;

export class ViewCube {
    constructor(options: ViewCubeOptions);

    update(camera: THREE.Camera): void;

    on(event: 'faceClick', callback: FaceClickHandler): this;
    on(event: 'drag', callback: DragHandler): this;

    off(event: 'faceClick', callback: FaceClickHandler): this;
    off(event: 'drag', callback: DragHandler): this;

    getFaceConfig(faceId: number): FaceConfig | undefined;
    getAllFaceConfigs(): Record<number, FaceConfig>;

    setSize(size: number): void;
    setPosition(position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'): void;

    dispose(): void;
}

export interface ViewCubeMeshOptions {
    size?: number;
    edgeSize?: number;
    showOutline?: boolean;
    showEdges?: boolean;
    showCorners?: boolean;
    coordinateSystem?: 'Y-up' | 'Z-up';
    colors?: {
        main?: number;
        hover?: number;
        outline?: number;
    };
    labels?: {
        top?: string;
        bottom?: string;
        front?: string;
        back?: string;
        left?: string;
        right?: string;
    };
    font?: {
        family?: string;
        size?: number;
    };
}

export class ViewCubeMesh extends THREE.Object3D {
    constructor(options?: ViewCubeMeshOptions);

    setHover(faceId: number): void;
    clearHover(): void;
    setQuaternion(quaternion: THREE.Quaternion): void;
}

export const FACES: {
    TOP: 1;
    FRONT: 2;
    RIGHT: 3;
    BACK: 4;
    LEFT: 5;
    BOTTOM: 6;
    TOP_FRONT_EDGE: 7;
    TOP_RIGHT_EDGE: 8;
    TOP_BACK_EDGE: 9;
    TOP_LEFT_EDGE: 10;
    FRONT_RIGHT_EDGE: 11;
    BACK_RIGHT_EDGE: 12;
    BACK_LEFT_EDGE: 13;
    FRONT_LEFT_EDGE: 14;
    BOTTOM_FRONT_EDGE: 15;
    BOTTOM_RIGHT_EDGE: 16;
    BOTTOM_BACK_EDGE: 17;
    BOTTOM_LEFT_EDGE: 18;
    TOP_FRONT_RIGHT_CORNER: 19;
    TOP_BACK_RIGHT_CORNER: 20;
    TOP_BACK_LEFT_CORNER: 21;
    TOP_FRONT_LEFT_CORNER: 22;
    BOTTOM_FRONT_RIGHT_CORNER: 23;
    BOTTOM_BACK_RIGHT_CORNER: 24;
    BOTTOM_BACK_LEFT_CORNER: 25;
    BOTTOM_FRONT_LEFT_CORNER: 26;
};

export function getFaceConfigs(
    coordinateSystem?: 'Y-up' | 'Z-up',
    distance?: number
): Record<number, FaceConfig>;

export function getFaceName(faceId: number): string;

export function easeInOutCubic(t: number): number;
export function lerpAngle(from: number, to: number, t: number): number;
export function cartesianToSpherical(cartesian: THREE.Vector3): { r: number; theta: number; phi: number };
export function sphericalToCartesian(THREE: typeof import('three'), r: number, theta: number, phi: number): THREE.Vector3;

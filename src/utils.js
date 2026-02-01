/**
 * Utility functions for ViewCube
 */

const DEG_TO_RAD = Math.PI / 180;
const TWO_PI = 2 * Math.PI;

/**
 * Calculate shortest angle delta for smooth animation
 */
export function calculateAngleDelta(from, to) {
    const direct = to - from;
    const altA = direct - TWO_PI;
    const altB = direct + TWO_PI;
    if (Math.abs(direct) > Math.abs(altA)) {
        return altA;
    } else if (Math.abs(direct) > Math.abs(altB)) {
        return altB;
    }
    return direct;
}

/**
 * Create a text texture for cube faces
 */
export function createTextTexture(THREE, text, options = {}) {
    const {
        font = 'Arial Narrow, sans-serif',
        fontSize = 45,
        width = 200,
        height = 200,
        rotation = 0,
        bgColor = [255, 255, 255, 1.0],
        fgColor = [0, 0, 0, 1.0]
    } = options;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    // Fill background
    context.fillStyle = `rgba(${bgColor.join(', ')})`;
    context.fillRect(0, 0, width, height);

    // Setup text
    context.font = `bold ${fontSize}px ${font}`;
    const metrics = context.measureText(text);
    const textWidth = metrics.width;

    // Apply rotation if specified
    if (rotation !== 0) {
        context.save();
        context.translate(width / 2, height / 2);
        context.rotate(rotation * DEG_TO_RAD);
        context.fillStyle = `rgba(${fgColor.join(', ')})`;
        context.fillText(text, -textWidth / 2, fontSize / 2 - 2);
        context.restore();
    } else {
        context.fillStyle = `rgba(${fgColor.join(', ')})`;
        context.fillText(text, width / 2 - textWidth / 2, height / 2 + fontSize / 2 - 2);
    }

    const texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
}

/**
 * Easing function for smooth animations (ease-in-out cubic)
 */
export function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Lerp angle with shortest path
 */
export function lerpAngle(from, to, t) {
    let delta = to - from;
    while (delta > Math.PI) delta -= TWO_PI;
    while (delta < -Math.PI) delta += TWO_PI;
    return from + delta * t;
}

/**
 * Convert Cartesian to Spherical coordinates
 */
export function cartesianToSpherical(cartesian) {
    const r = cartesian.length();
    const theta = Math.atan2(cartesian.y, cartesian.x);
    const phi = Math.acos(Math.max(-1, Math.min(1, cartesian.z / r)));
    return { r, theta, phi };
}

/**
 * Convert Spherical to Cartesian coordinates
 */
export function sphericalToCartesian(THREE, r, theta, phi) {
    return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
    );
}

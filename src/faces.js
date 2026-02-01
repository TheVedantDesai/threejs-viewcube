/**
 * ViewCube Face Constants and Configurations
 * Supports both Y-up (standard Three.js) and Z-up (Potree/CAD) coordinate systems
 */

export const FACES = {
    TOP: 1,
    FRONT: 2,
    RIGHT: 3,
    BACK: 4,
    LEFT: 5,
    BOTTOM: 6,

    TOP_FRONT_EDGE: 7,
    TOP_RIGHT_EDGE: 8,
    TOP_BACK_EDGE: 9,
    TOP_LEFT_EDGE: 10,

    FRONT_RIGHT_EDGE: 11,
    BACK_RIGHT_EDGE: 12,
    BACK_LEFT_EDGE: 13,
    FRONT_LEFT_EDGE: 14,

    BOTTOM_FRONT_EDGE: 15,
    BOTTOM_RIGHT_EDGE: 16,
    BOTTOM_BACK_EDGE: 17,
    BOTTOM_LEFT_EDGE: 18,

    TOP_FRONT_RIGHT_CORNER: 19,
    TOP_BACK_RIGHT_CORNER: 20,
    TOP_BACK_LEFT_CORNER: 21,
    TOP_FRONT_LEFT_CORNER: 22,

    BOTTOM_FRONT_RIGHT_CORNER: 23,
    BOTTOM_BACK_RIGHT_CORNER: 24,
    BOTTOM_BACK_LEFT_CORNER: 25,
    BOTTOM_FRONT_LEFT_CORNER: 26
};

/**
 * Get face configurations for the specified coordinate system
 * @param {string} coordinateSystem - 'Y-up' or 'Z-up'
 * @param {number} distance - Camera distance from origin
 * @returns {Object} Face configurations
 */
export function getFaceConfigs(coordinateSystem = 'Z-up', distance = 100) {
    if (coordinateSystem === 'Z-up') {
        return getZUpFaceConfigs(distance);
    }
    return getYUpFaceConfigs(distance);
}

/**
 * Z-up coordinate system (Potree, CAD applications)
 */
function getZUpFaceConfigs(d) {
    return {
        [FACES.TOP]: {
            up: { x: 0, y: 1, z: 0 },
            lookAt: { x: 0, y: 0, z: -1 },
            position: { x: 0, y: 0, z: d }
        },
        [FACES.FRONT]: {
            up: { x: 0, y: 0, z: 1 },
            lookAt: { x: 0, y: 1, z: 0 },
            position: { x: 0, y: -d, z: 0 }
        },
        [FACES.RIGHT]: {
            up: { x: 0, y: 0, z: 1 },
            lookAt: { x: 1, y: 0, z: 0 },
            position: { x: d, y: 0, z: 0 }
        },
        [FACES.BACK]: {
            up: { x: 0, y: 0, z: 1 },
            lookAt: { x: 0, y: -1, z: 0 },
            position: { x: 0, y: d, z: 0 }
        },
        [FACES.LEFT]: {
            up: { x: 0, y: 0, z: 1 },
            lookAt: { x: -1, y: 0, z: 0 },
            position: { x: -d, y: 0, z: 0 }
        },
        [FACES.BOTTOM]: {
            up: { x: 0, y: -1, z: 0 },
            lookAt: { x: 0, y: 0, z: 1 },
            position: { x: 0, y: 0, z: -d }
        },
        // Edges and corners use interpolated values
        ...getEdgeConfigs('Z-up', d),
        ...getCornerConfigs('Z-up', d)
    };
}

/**
 * Y-up coordinate system (standard Three.js)
 */
function getYUpFaceConfigs(d) {
    return {
        [FACES.TOP]: {
            up: { x: 0, y: 0, z: -1 },
            lookAt: { x: 0, y: -1, z: 0 },
            position: { x: 0, y: d, z: 0 }
        },
        [FACES.FRONT]: {
            up: { x: 0, y: 1, z: 0 },
            lookAt: { x: 0, y: 0, z: -1 },
            position: { x: 0, y: 0, z: d }
        },
        [FACES.RIGHT]: {
            up: { x: 0, y: 1, z: 0 },
            lookAt: { x: -1, y: 0, z: 0 },
            position: { x: d, y: 0, z: 0 }
        },
        [FACES.BACK]: {
            up: { x: 0, y: 1, z: 0 },
            lookAt: { x: 0, y: 0, z: 1 },
            position: { x: 0, y: 0, z: -d }
        },
        [FACES.LEFT]: {
            up: { x: 0, y: 1, z: 0 },
            lookAt: { x: 1, y: 0, z: 0 },
            position: { x: -d, y: 0, z: 0 }
        },
        [FACES.BOTTOM]: {
            up: { x: 0, y: 0, z: 1 },
            lookAt: { x: 0, y: 1, z: 0 },
            position: { x: 0, y: -d, z: 0 }
        },
        ...getEdgeConfigs('Y-up', d),
        ...getCornerConfigs('Y-up', d)
    };
}

function getEdgeConfigs(system, d) {
    const e = d * 0.707; // sqrt(2)/2 for 45-degree positions

    if (system === 'Z-up') {
        return {
            [FACES.TOP_FRONT_EDGE]: { up: { x: 0, y: 0, z: 1 }, lookAt: { x: 0, y: 1, z: 0 }, position: { x: 0, y: -e, z: e } },
            [FACES.TOP_RIGHT_EDGE]: { up: { x: 0, y: 0, z: 1 }, lookAt: { x: 1, y: 0, z: 0 }, position: { x: e, y: 0, z: e } },
            [FACES.TOP_BACK_EDGE]: { up: { x: 0, y: 0, z: 1 }, lookAt: { x: 0, y: -1, z: 0 }, position: { x: 0, y: e, z: e } },
            [FACES.TOP_LEFT_EDGE]: { up: { x: 0, y: 0, z: 1 }, lookAt: { x: -1, y: 0, z: 0 }, position: { x: -e, y: 0, z: e } },
            [FACES.FRONT_RIGHT_EDGE]: { up: { x: 0, y: 0, z: 1 }, lookAt: { x: 0, y: 0, z: 0 }, position: { x: e, y: -e, z: 0 } },
            [FACES.BACK_RIGHT_EDGE]: { up: { x: 0, y: 0, z: 1 }, lookAt: { x: 0, y: 0, z: 0 }, position: { x: e, y: e, z: 0 } },
            [FACES.BACK_LEFT_EDGE]: { up: { x: 0, y: 0, z: 1 }, lookAt: { x: 0, y: 0, z: 0 }, position: { x: -e, y: e, z: 0 } },
            [FACES.FRONT_LEFT_EDGE]: { up: { x: 0, y: 0, z: 1 }, lookAt: { x: 0, y: 0, z: 0 }, position: { x: -e, y: -e, z: 0 } },
            [FACES.BOTTOM_FRONT_EDGE]: { up: { x: 0, y: 0, z: 1 }, lookAt: { x: 0, y: 1, z: 0 }, position: { x: 0, y: -e, z: -e } },
            [FACES.BOTTOM_RIGHT_EDGE]: { up: { x: 0, y: 0, z: 1 }, lookAt: { x: 1, y: 0, z: 0 }, position: { x: e, y: 0, z: -e } },
            [FACES.BOTTOM_BACK_EDGE]: { up: { x: 0, y: 0, z: 1 }, lookAt: { x: 0, y: -1, z: 0 }, position: { x: 0, y: e, z: -e } },
            [FACES.BOTTOM_LEFT_EDGE]: { up: { x: 0, y: 0, z: 1 }, lookAt: { x: -1, y: 0, z: 0 }, position: { x: -e, y: 0, z: -e } }
        };
    }

    // Y-up edge configs
    return {
        [FACES.TOP_FRONT_EDGE]: { up: { x: 0, y: 1, z: 0 }, lookAt: { x: 0, y: 0, z: 0 }, position: { x: 0, y: e, z: e } },
        [FACES.TOP_RIGHT_EDGE]: { up: { x: 0, y: 1, z: 0 }, lookAt: { x: 0, y: 0, z: 0 }, position: { x: e, y: e, z: 0 } },
        [FACES.TOP_BACK_EDGE]: { up: { x: 0, y: 1, z: 0 }, lookAt: { x: 0, y: 0, z: 0 }, position: { x: 0, y: e, z: -e } },
        [FACES.TOP_LEFT_EDGE]: { up: { x: 0, y: 1, z: 0 }, lookAt: { x: 0, y: 0, z: 0 }, position: { x: -e, y: e, z: 0 } },
        [FACES.FRONT_RIGHT_EDGE]: { up: { x: 0, y: 1, z: 0 }, lookAt: { x: 0, y: 0, z: 0 }, position: { x: e, y: 0, z: e } },
        [FACES.BACK_RIGHT_EDGE]: { up: { x: 0, y: 1, z: 0 }, lookAt: { x: 0, y: 0, z: 0 }, position: { x: e, y: 0, z: -e } },
        [FACES.BACK_LEFT_EDGE]: { up: { x: 0, y: 1, z: 0 }, lookAt: { x: 0, y: 0, z: 0 }, position: { x: -e, y: 0, z: -e } },
        [FACES.FRONT_LEFT_EDGE]: { up: { x: 0, y: 1, z: 0 }, lookAt: { x: 0, y: 0, z: 0 }, position: { x: -e, y: 0, z: e } },
        [FACES.BOTTOM_FRONT_EDGE]: { up: { x: 0, y: 1, z: 0 }, lookAt: { x: 0, y: 0, z: 0 }, position: { x: 0, y: -e, z: e } },
        [FACES.BOTTOM_RIGHT_EDGE]: { up: { x: 0, y: 1, z: 0 }, lookAt: { x: 0, y: 0, z: 0 }, position: { x: e, y: -e, z: 0 } },
        [FACES.BOTTOM_BACK_EDGE]: { up: { x: 0, y: 1, z: 0 }, lookAt: { x: 0, y: 0, z: 0 }, position: { x: 0, y: -e, z: -e } },
        [FACES.BOTTOM_LEFT_EDGE]: { up: { x: 0, y: 1, z: 0 }, lookAt: { x: 0, y: 0, z: 0 }, position: { x: -e, y: -e, z: 0 } }
    };
}

function getCornerConfigs(system, d) {
    const c = d * 0.577; // 1/sqrt(3) for corner positions
    const up = system === 'Z-up' ? { x: 0, y: 0, z: 1 } : { x: 0, y: 1, z: 0 };

    if (system === 'Z-up') {
        return {
            [FACES.TOP_FRONT_RIGHT_CORNER]: { up, lookAt: { x: 0, y: 0, z: 0 }, position: { x: c, y: -c, z: c } },
            [FACES.TOP_BACK_RIGHT_CORNER]: { up, lookAt: { x: 0, y: 0, z: 0 }, position: { x: c, y: c, z: c } },
            [FACES.TOP_BACK_LEFT_CORNER]: { up, lookAt: { x: 0, y: 0, z: 0 }, position: { x: -c, y: c, z: c } },
            [FACES.TOP_FRONT_LEFT_CORNER]: { up, lookAt: { x: 0, y: 0, z: 0 }, position: { x: -c, y: -c, z: c } },
            [FACES.BOTTOM_FRONT_RIGHT_CORNER]: { up, lookAt: { x: 0, y: 0, z: 0 }, position: { x: c, y: -c, z: -c } },
            [FACES.BOTTOM_BACK_RIGHT_CORNER]: { up, lookAt: { x: 0, y: 0, z: 0 }, position: { x: c, y: c, z: -c } },
            [FACES.BOTTOM_BACK_LEFT_CORNER]: { up, lookAt: { x: 0, y: 0, z: 0 }, position: { x: -c, y: c, z: -c } },
            [FACES.BOTTOM_FRONT_LEFT_CORNER]: { up, lookAt: { x: 0, y: 0, z: 0 }, position: { x: -c, y: -c, z: -c } }
        };
    }

    return {
        [FACES.TOP_FRONT_RIGHT_CORNER]: { up, lookAt: { x: 0, y: 0, z: 0 }, position: { x: c, y: c, z: c } },
        [FACES.TOP_BACK_RIGHT_CORNER]: { up, lookAt: { x: 0, y: 0, z: 0 }, position: { x: c, y: c, z: -c } },
        [FACES.TOP_BACK_LEFT_CORNER]: { up, lookAt: { x: 0, y: 0, z: 0 }, position: { x: -c, y: c, z: -c } },
        [FACES.TOP_FRONT_LEFT_CORNER]: { up, lookAt: { x: 0, y: 0, z: 0 }, position: { x: -c, y: c, z: c } },
        [FACES.BOTTOM_FRONT_RIGHT_CORNER]: { up, lookAt: { x: 0, y: 0, z: 0 }, position: { x: c, y: -c, z: c } },
        [FACES.BOTTOM_BACK_RIGHT_CORNER]: { up, lookAt: { x: 0, y: 0, z: 0 }, position: { x: c, y: -c, z: -c } },
        [FACES.BOTTOM_BACK_LEFT_CORNER]: { up, lookAt: { x: 0, y: 0, z: 0 }, position: { x: -c, y: -c, z: -c } },
        [FACES.BOTTOM_FRONT_LEFT_CORNER]: { up, lookAt: { x: 0, y: 0, z: 0 }, position: { x: -c, y: -c, z: c } }
    };
}

/**
 * Get face name from face ID
 */
export function getFaceName(faceId) {
    return Object.keys(FACES).find(key => FACES[key] === faceId) || 'UNKNOWN';
}

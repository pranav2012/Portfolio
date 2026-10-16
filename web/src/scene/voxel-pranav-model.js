import * as THREE from 'three';

// A voxel Pranav at work: in his desk chair, turned round with a coffee,
// in front of a monitor full of code and a laptop running NomadSafe.
// Units are voxels; x is right, y is up, z faces the viewer.

export const VOXEL = 0.215;
// Height the camera orbits around, in voxels.
export const CENTER_Y = 9;

const C = {
    skin: '#c98d63',
    skinShade: '#b07650',
    hair: '#1d1613',
    hairLight: '#2d231e',
    beard: '#35281f',
    lip: '#8a4f3f',
    eye: '#1a120c',
    frame: '#1c1c20',
    tee: '#22325c',
    teeShade: '#1b2849',
    pants: '#2f3440',
    pantsShade: '#272b35',
    shoe: '#f7f6f2',
    sole: '#b9b4aa',
    watch: '#202024',
    floor: ['#c9a27a', '#bf976e', '#d2ad86'],
    floorEdge: '#8a6a4c',
    desk: '#efe9de',
    metal: '#3b3d44',
    chair: '#2b2d33',
    chairShade: '#22242a',
    bezel: '#1d1f24',
    screen: '#0e1520',
    code: ['#4fd1c5', '#ff63c3', '#f6e05e', '#63b3ed', '#9ae6b4'],
    keys: '#2a2c31',
    mouse: '#e6e6e6',
    laptop: '#c7cbd1',
    globe: '#3b82f6',
    land: '#4ade80',
    pot: '#c66b3d',
    plant: ['#3f9a4a', '#4cab55', '#378a41'],
    rug: '#3f7f86',
    rugEdge: '#2f6369',
    mug: '#f2eee8',
    coffee: '#4a2c1d',
    lamp: '#2b2d33',
    bulb: '#ffd59a',
    eyeWhite: '#f6f3ec',
    brow: '#17110e',
    beardLight: '#45352a',
    lace: '#c9c4ba',
    stripe: '#2dd4bf',
    logo: '#4fd1c5',
    watchFace: '#7dd3fc'
};

// Deterministic noise so the scene looks the same on every load.
const rand = (x, y, z) => {
    const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return s - Math.floor(s);
};
const pick = (list, x, y, z) => list[Math.floor(rand(x, y, z) * list.length)];

class Voxels {
    constructor() {
        this.map = new Map();
    }
    key(x, y, z) {
        return `${x},${y},${z}`;
    }
    set(x, y, z, color) {
        this.map.set(this.key(x, y, z), { x, y, z, color });
    }
    fill(x0, x1, y0, y1, z0, z1, color) {
        for (let x = x0; x <= x1; x++)
            for (let y = y0; y <= y1; y++)
                for (let z = z0; z <= z1; z++)
                    this.set(
                        x,
                        y,
                        z,
                        typeof color === 'function' ? color(x, y, z) : color
                    );
    }
    has(x, y, z) {
        return this.map.has(this.key(x, y, z));
    }
    // Voxels with at least one open face; the rest are never seen.
    visible() {
        return [...this.map.values()].filter(
            ({ x, y, z }) =>
                !(
                    this.has(x + 1, y, z) &&
                    this.has(x - 1, y, z) &&
                    this.has(x, y + 1, z) &&
                    this.has(x, y - 1, z) &&
                    this.has(x, y, z + 1) &&
                    this.has(x, y, z - 1)
                )
        );
    }
}

// The character is built on a grid twice as fine as the scene's. Fine voxel
// j covers [j/2, j/2 + 0.5] in scene voxels, so coarse voxel i is fine 2i-1
// and 2i; `coarse()` fills a box given in scene voxels.
class FineVoxels extends Voxels {
    coarse(x0, x1, y0, y1, z0, z1, color) {
        this.fill(2 * x0 - 1, 2 * x1, 2 * y0 - 1, 2 * y1, 2 * z0 - 1, 2 * z1, color);
    }
}

const geometries = [];
const materials = [];

// Every solid voxel in the scene at rest, in world voxel coordinates, so
// ambient occlusion sees neighbouring parts too.
const world = new Voxels();
const addToWorld = (voxels, [dx, dy, dz] = [0, 0, 0]) => {
    for (const { x, y, z } of voxels.map.values()) world.set(x + dx, y + dy, z + dz, true);
};
// The same, on the character's fine grid: fine parts as they are, coarse
// scenery split into its eight fine cells.
const fineWorld = new Voxels();
const addToFineWorld = (voxels, [dx, dy, dz] = [0, 0, 0], fine = true) => {
    for (const { x, y, z } of voxels.map.values()) {
        if (fine) fineWorld.set(x + dx, y + dy, z + dz, true);
        else
            for (const fx of [2 * x - 1, 2 * x])
                for (const fy of [2 * y - 1, 2 * y])
                    for (const fz of [2 * z - 1, 2 * z]) fineWorld.set(fx + dx, fy + dy, fz + dz, true);
    }
};

const FACES = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1]
];

// How enclosed a voxel's open faces are, 0 (open) to 1 (buried): for each
// open face, the share of the 8 cells ringing the space in front of it that
// are solid. Creases and corners come out darker, like a real render.
const occlusion = (x, y, z, grid = world) => {
    let total = 0;
    let faces = 0;
    for (const [fx, fy, fz] of FACES) {
        const [cx, cy, cz] = [x + fx, y + fy, z + fz];
        if (grid.has(cx, cy, cz)) continue;
        let solid = 0;
        for (let a = -1; a <= 1; a++)
            for (let b = -1; b <= 1; b++) {
                if (!a && !b) continue;
                const [ox, oy, oz] = fx ? [0, a, b] : fy ? [a, 0, b] : [a, b, 0];
                if (grid.has(cx + ox, cy + oy, cz + oz)) solid++;
            }
        total += solid / 8;
        faces++;
    }
    return faces ? total / faces : 1;
};

// One InstancedMesh per part, wrapped in a group whose position is the
// part's pivot (`origin`, in voxels), so parts can be rotated in place.
const toMesh = (
    voxels,
    { origin = [0, 0, 0], size = [1, 1, 1], basic = false, offset, emissive = false } = {}
) => {
    const list = voxels.visible();
    // Fine voxels are half size, and their coordinates map to scene voxels.
    const fine = voxels instanceof FineVoxels;
    const unit = fine ? 0.5 : 1;
    const toScene = n => (fine ? (n + 0.5) / 2 : n);
    const geometry = new THREE.BoxGeometry(
        VOXEL * size[0] * unit,
        VOXEL * size[1] * unit,
        VOXEL * size[2] * unit
    );
    // Screens and bulbs glow at full strength, untouched by tone mapping.
    const material = basic
        ? new THREE.MeshBasicMaterial({ toneMapped: !emissive })
        : new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0 });
    geometries.push(geometry);
    materials.push(material);

    const mesh = new THREE.InstancedMesh(geometry, material, list.length);
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    list.forEach((v, i) => {
        matrix.makeTranslation(
            (toScene(v.x) - origin[0]) * VOXEL,
            (toScene(v.y) - origin[1]) * VOXEL,
            (toScene(v.z) - origin[2]) * VOXEL
        );
        mesh.setMatrixAt(i, matrix);
        color.set(v.color);
        if (offset) {
            const k = fine ? 2 : 1;
            const ao = occlusion(v.x + offset[0] * k, v.y + offset[1] * k, v.z + offset[2] * k, fine ? fineWorld : world);
            color.multiplyScalar(1 - 0.55 * ao);
        }
        mesh.setColorAt(i, color);
    });
    mesh.castShadow = !basic;
    mesh.receiveShadow = !basic;

    const group = new THREE.Group();
    group.position.set(origin[0] * VOXEL, origin[1] * VOXEL, origin[2] * VOXEL);
    group.add(mesh);
    return group;
};

// --- Floor --------------------------------------------------------------------

const floor = () => {
    const v = new Voxels();
    // Floorboards running left to right, on a darker base.
    for (let x = -13; x <= 11; x++) {
        for (let z = -11; z <= 9; z++) {
            v.set(x, -1, z, C.floor[Math.floor(z / 2 + 20) % 3]);
            v.fill(x, x, -3, -2, z, z, C.floorEdge);
        }
    }
    // A plant in the back corner.
    v.fill(-12, -10, 0, 2, -10, -8, C.pot);
    for (let y = 3; y <= 8; y++)
        for (let x = -13; x <= -9; x++)
            for (let z = -11; z <= -7; z++)
                if (
                    !v.has(x, y, z) &&
                    Math.hypot(x + 11, z + 9) < 2.6 - (y - 3) * 0.3 &&
                    rand(x, y, z) > 0.25
                )
                    v.set(x, y, z, pick(C.plant, x, y, z));
    return v;
};

// A thin rug laid on the floor.
const rug = () => {
    const v = new Voxels();
    v.fill(-11, 2, -0.4, -0.4, -3, 7, (x, y, z) =>
        x === -11 || x === 2 || z === -3 || z === 7 ? C.rugEdge : C.rug
    );
    return v;
};

// --- Desk -------------------------------------------------------------------

const desk = () => {
    const v = new Voxels();
    v.fill(-2, 10, 9, 9, -10, -5, C.desk);
    for (const x of [-2, 10])
        for (const z of [-10, -5]) v.fill(x, x, 0, 8, z, z, C.metal);
    // Monitor on a stand.
    v.fill(-1, 6, 12, 17, -9, -9, C.bezel);
    v.fill(2, 3, 10, 11, -9, -9, C.metal);
    v.fill(1, 4, 10, 10, -9, -8, C.metal);
    // Keyboard and mouse.
    v.fill(0, 5, 10, 10, -7, -6, C.keys);
    v.set(7, 10, -6, C.mouse);
    // Laptop, lid up.
    v.fill(7, 10, 10, 10, -8, -6, C.laptop);
    v.fill(7, 10, 10, 13, -9, -9, C.laptop);
    // Cactus at the end of the desk.
    v.set(-1, 10, -6, C.pot);
    v.fill(-1, -1, 11, 12, -6, -6, C.plant[1]);
    return v;
};

// An angled desk lamp at the back corner, leaning over the laptop.
const lamp = () => {
    const v = new Voxels();
    v.fill(9, 10, 10, 10, -10, -10, C.lamp);
    v.fill(10, 10, 11, 17, -10, -10, C.lamp);
    v.fill(8, 9, 18, 18, -10, -10, C.lamp);
    v.fill(6, 8, 17, 17, -10, -9, C.lamp);
    return v;
};

const screens = () => {
    const v = new Voxels();
    const z = -8.45;
    // Monitor: lines of code.
    v.fill(0, 5, 13, 16, z, z, C.screen);
    // Laptop: NomadSafe's globe.
    v.fill(7, 10, 11, 13, z, z, C.screen);
    v.fill(8, 9, 11, 13, z, z, C.globe);
    v.set(8, 12, z, C.land);
    v.set(9, 11, z, C.land);
    return v;
};

// --- Chair ------------------------------------------------------------------

// He sits at x = SEAT_X, left of the desk, facing the viewer.
const SEAT_X = -5;

// Everything seated is drawn on the fine grid (see FineVoxels); boxes given
// in scene voxels use `coarse()`, details use fine `fill()`/`set()`.

// Built around x = 0, like Pranav, so it swivels with him.
const chair = () => {
    const v = new FineVoxels();
    // Star base and gas lift.
    v.coarse(-3, 3, 0, 0, 1, 1, C.chairShade);
    v.coarse(0, 0, 0, 0, -2, 4, C.chairShade);
    v.coarse(0, 0, 1, 4, 1, 1, C.metal);
    // Seat, with a piped edge, and backrest.
    v.coarse(-4, 4, 5, 5, -2, 4, C.chair);
    v.fill(-9, 8, 10, 10, 8, 8, C.chairShade);
    v.coarse(-4, 4, 6, 15, -3, -3, (x, y) => (y >= 29 ? C.chairShade : C.chair));
    return v;
};

// --- Pranav -----------------------------------------------------------------

const body = () => {
    const v = new FineVoxels();
    // Thighs on the seat, shins down, white sneakers.
    for (const x0 of [-4, 2]) {
        v.coarse(x0, x0 + 2, 6, 7, -1, 4, (x, y) => (y <= 12 ? C.pantsShade : C.pants));
        v.coarse(x0, x0 + 2, 2, 5, 3, 4, C.pants);
        // Sneakers: white uppers, laces down the middle, a teal side stripe
        // and a grey sole.
        const [fx0, fx1] = [2 * x0 - 1, 2 * x0 + 4];
        v.fill(fx0, fx1, 1, 3, 5, 12, C.shoe);
        v.fill(fx0, fx1, 0, 0, 5, 12, C.sole);
        v.fill(fx0, fx1, -1, -1, 5, 12, C.lace);
        for (let z = 8; z <= 11; z++) v.set((fx0 + fx1) >> 1, 3, z, z % 2 ? C.lace : C.shoe);
        v.fill(fx0, fx0, 1, 1, 7, 11, C.stripe);
        v.fill(fx1, fx1, 1, 1, 7, 11, C.stripe);
    }
    v.coarse(-1, 1, 7, 7, -1, 1, C.pants);
    // Navy tee, with a shaded hem, a few creases and a small logo.
    v.coarse(-4, 4, 8, 16, -2, 1, (x, y, z) => {
        if (y <= 16) return C.teeShade;
        if (z === 2 && y < 26 && rand(x, y, z) > 0.92) return C.teeShade;
        return C.tee;
    });
    v.fill(3, 4, 26, 27, 2, 2, C.logo);
    // Crew neck and collar.
    v.coarse(-2, 2, 16, 16, -2, 1, C.teeShade);
    v.coarse(-1, 1, 16, 17, -1, 0, C.skinShade);
    return v;
};

// His right arm (viewer's left) rests on his knee. It has a shoulder and an
// elbow so he can wave, swapping the curled hand for an open one.
const WAVE_SHOULDER = [-5.5, 16, -0.5];
const WAVE_ELBOW = [-5.5, 9, -0.5];

const rightUpperArm = () => {
    const v = new FineVoxels();
    v.coarse(-6, -5, 14, 16, -1, 0, (x, y) => (y === 27 ? C.teeShade : C.tee));
    v.coarse(-6, -5, 10, 13, -1, 0, C.skin);
    return v;
};

const rightForearm = () => {
    const v = new FineVoxels();
    v.fill(-13, -10, 17, 18, -3, 6, C.skin);
    return v;
};

// Resting on the knee: the back of the hand up, fingers curled over it.
const restingHand = () => {
    const v = new FineVoxels();
    v.fill(-12, -9, 15, 17, 5, 8, C.skin);
    for (let x = -12; x <= -9; x++) v.fill(x, x, 13, 15, 9, 9, x % 2 ? C.skin : C.skinShade);
    v.fill(-8, -8, 15, 16, 6, 7, C.skin);
    return v;
};

// Open, for waving: a palm, four fingers of different lengths with the
// gaps between them shaded, and the thumb out to the side.
const openHand = () => {
    const v = new FineVoxels();
    v.fill(-13, -10, 17, 18, 7, 10, C.skin);
    const fingers = [
        [-13, 12],
        [-12, 13],
        [-11, 14],
        [-10, 13]
    ];
    for (const [x, tip] of fingers) v.fill(x, x, 17, 18, 11, tip, (fx, fy, fz) => (fz === 11 ? C.skinShade : C.skin));
    v.fill(-9, -9, 17, 18, 8, 10, C.skin);
    v.fill(-8, -8, 17, 18, 10, 11, C.skin);
    return v;
};

// His left arm holds a coffee: an upper arm hinged at the shoulder and a
// forearm hinged at the elbow, so he can bring the mug up to drink.
const MUG_SHOULDER = [5.5, 16, -0.5];
const MUG_ELBOW = [5.5, 11, -0.5];

const upperArm = () => {
    const v = new FineVoxels();
    v.coarse(5, 6, 14, 16, -1, 0, (x, y) => (y === 27 ? C.teeShade : C.tee));
    v.coarse(5, 6, 11, 13, -1, 0, C.skin);
    return v;
};

const forearm = () => {
    const v = new FineVoxels();
    v.fill(9, 12, 21, 22, 1, 6, C.skin);
    // Watch, with a little lit face.
    v.fill(9, 12, 21, 23, 1, 2, C.watch);
    v.set(10, 23, 1, C.watchFace);
    // The mug: a teal band, coffee inside, a handle, and fingers round it.
    v.fill(7, 12, 21, 28, 7, 11, (x, y) => (y === 25 ? C.stripe : C.mug));
    v.fill(8, 11, 28, 28, 8, 10, C.coffee);
    v.fill(13, 13, 22, 27, 9, 9, C.mug);
    v.set(14, 22, 9, C.mug);
    v.set(14, 27, 9, C.mug);
    v.fill(14, 14, 23, 26, 9, 9, C.mug);
    // His hand round the handle: fingers through it, knuckles shaded, thumb
    // resting on top.
    v.fill(12, 15, 22, 26, 7, 10, (x, y) => (x === 15 && y % 2 === 0 ? C.skinShade : C.skin));
    v.fill(12, 14, 27, 27, 8, 9, C.skin);
    return v;
};

const NECK = [0, 17, 0];

// Head on the fine grid: x -7..6 (centre -0.5), y 35..50, face at z = 6.
const head = () => {
    const v = new FineVoxels();
    v.fill(-7, 6, 35, 50, -7, 6, C.skin);
    // A little cheek shading under the eyes.
    v.fill(-7, -6, 39, 41, 6, 6, C.skinShade);
    v.fill(5, 6, 39, 41, 6, 6, C.skinShade);

    // Trimmed beard: jaw, chin (standing a little proud), sideburns,
    // moustache, and the mouth.
    const beard = (x, y, z) => (rand(x, y, z) > 0.7 ? C.beardLight : C.beard);
    v.fill(-7, 6, 35, 36, -5, 6, beard);
    v.fill(-7, -7, 35, 44, -4, 6, beard);
    v.fill(6, 6, 35, 44, -4, 6, beard);
    v.fill(-6, 5, 35, 38, 6, 6, beard);
    v.fill(-6, -5, 35, 40, 6, 6, beard);
    v.fill(4, 5, 35, 40, 6, 6, beard);
    v.fill(-5, 4, 35, 36, 7, 7, beard);
    v.fill(-4, 3, 39, 39, 6, 6, beard);
    v.fill(-2, 1, 37, 37, 6, 6, C.lip);
    v.fill(-1, 0, 38, 38, 6, 6, beard);

    // Nose.
    v.fill(-1, 0, 40, 42, 7, 7, C.skin);
    v.fill(-1, 0, 40, 40, 7, 7, C.skinShade);

    // Eyes, each with a catchlight, and brows.
    v.fill(-5, -4, 42, 43, 6, 6, C.eye);
    v.fill(3, 4, 42, 43, 6, 6, C.eye);
    v.set(-4, 43, 6, C.eyeWhite);
    v.set(4, 43, 6, C.eyeWhite);
    v.fill(-6, -3, 46, 46, 6, 6, C.brow);
    v.fill(2, 5, 46, 46, 6, 6, C.brow);
    v.set(-3, 45, 6, C.brow);
    v.set(2, 45, 6, C.brow);

    // Ears.
    v.fill(-8, -8, 40, 43, -1, 2, C.skinShade);
    v.fill(7, 7, 40, 43, -1, 2, C.skinShade);
    v.set(-8, 41, 1, C.skin);
    v.set(7, 41, 1, C.skin);

    // Hair: close at the back and sides, swept up into a quiff at the front,
    // with lighter strands.
    const hair = (x, y, z) => (rand(x, y, z) > 0.72 ? C.hairLight : C.hair);
    v.fill(-7, 6, 51, 52, -7, 6, hair);
    v.fill(-7, 6, 38, 52, -8, -8, hair);
    v.fill(-8, -8, 45, 52, -7, 2, hair);
    v.fill(7, 7, 45, 52, -7, 2, hair);
    v.fill(-7, 6, 50, 50, 6, 7, hair);
    v.fill(-6, 6, 53, 53, -5, 7, hair);
    v.fill(-4, 5, 54, 54, -1, 7, hair);
    v.fill(-2, 4, 55, 55, 2, 6, hair);
    v.fill(-5, 3, 52, 53, 8, 8, hair);
    return v;
};

// Thin wire-frame glasses on the fine grid: an outline round each eye, a
// bridge, and arms back to the ears.
const glasses = () => {
    const v = new FineVoxels();
    for (const [x0, x1] of [
        [-6, -3],
        [2, 5]
    ]) {
        v.fill(x0, x1, 44, 44, 7, 7, C.frame);
        v.fill(x0, x1, 41, 41, 7, 7, C.frame);
        v.fill(x0, x0, 41, 44, 7, 7, C.frame);
        v.fill(x1, x1, 41, 44, 7, 7, C.frame);
    }
    v.fill(-2, 1, 43, 43, 7, 7, C.frame);
    v.fill(-8, -8, 43, 43, 0, 6, C.frame);
    v.fill(7, 7, 43, 43, 0, 6, C.frame);
    return v;
};

// The code on the monitor: rows of coloured "tokens" typed out one by one.
const CODE_ROWS = [
    [0, 3],
    [1, 4],
    [1, 2],
    [0, 2]
];
const CODE_Z = -8.4;

// Joint angles (radians, three.js XYZ order) at the top of a wave: upper arm
// up and out, forearm upright, palm towards the viewer. Solved numerically.
const WAVE = { shoulder: [-1.714, 0.514, -1.19], elbow: [0.646, -0.047, 1.408] };

// Joint angles (radians) at the top of a sip.
const SIP = { shoulderX: 1.5, shoulderZ: 0, elbowX: -0.8, elbowY: 0.8, head: 0.18 };

export function buildPranav() {
    const root = new THREE.Group();

    // Parts in their rest positions, registered for ambient occlusion before
    // any mesh is built. Everything seated is offset to his chair.
    const seatedOffset = [SEAT_X, 0, 0];
    const parts = {
        floor: floor(),
        rug: rug(),
        desk: desk(),
        lamp: lamp(),
        chair: chair(),
        body: body(),
        rightUpperArm: rightUpperArm(),
        rightForearm: rightForearm(),
        restingHand: restingHand(),
        openHand: openHand(),
        upperArm: upperArm(),
        forearm: forearm(),
        head: head()
    };
    world.map.clear();
    fineWorld.map.clear();
    for (const name of ['floor', 'desk', 'lamp']) {
        addToWorld(parts[name]);
        addToFineWorld(parts[name], [0, 0, 0], false);
    }
    const fineSeatedOffset = seatedOffset.map(n => n * 2);
    for (const name of ['chair', 'body', 'rightUpperArm', 'rightForearm', 'restingHand', 'upperArm', 'forearm', 'head'])
        addToFineWorld(parts[name], fineSeatedOffset);

    const still = [0, 0, 0];
    root.add(toMesh(parts.floor, { offset: still }));
    root.add(toMesh(parts.rug, { size: [1, 0.2, 1] }));
    root.add(toMesh(parts.desk, { offset: still }));
    root.add(toMesh(parts.lamp, { offset: still }));
    root.add(toMesh(screens(), { size: [1, 1, 0.1], basic: true, emissive: true }));

    // The lamp's bulb, lit at night.
    const bulbGeometry = new THREE.BoxGeometry(VOXEL * 1.6, VOXEL * 0.5, VOXEL * 1.2);
    const bulbMaterial = new THREE.MeshBasicMaterial({ color: C.bulb, toneMapped: false });
    geometries.push(bulbGeometry);
    materials.push(bulbMaterial);
    const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    bulb.position.set(7 * VOXEL, 16.6 * VOXEL, -9.5 * VOXEL);
    root.add(bulb);

    // Code typed onto the monitor, one token at a time.
    const tokens = CODE_ROWS.flatMap(([start, end], row) =>
        Array.from({ length: end - start + 1 }, (_, i) => ({ x: start + i, y: 16 - row, color: C.code[(row * 2 + start + i) % C.code.length] }))
    );
    const tokenGeometry = new THREE.BoxGeometry(VOXEL * 0.9, VOXEL * 0.55, VOXEL * 0.1);
    const tokenMaterial = new THREE.MeshBasicMaterial({ toneMapped: false });
    geometries.push(tokenGeometry);
    materials.push(tokenMaterial);
    const code = new THREE.InstancedMesh(tokenGeometry, tokenMaterial, tokens.length);
    const tokenMatrix = new THREE.Matrix4();
    const tokenColor = new THREE.Color();
    tokens.forEach((t, i) => {
        code.setColorAt(i, tokenColor.set(t.color));
        code.setMatrixAt(i, tokenMatrix.makeTranslation(t.x * VOXEL, t.y * VOXEL, CODE_Z * VOXEL));
    });
    root.add(code);
    const hidden = new THREE.Matrix4().makeScale(0, 0, 0);

    // Cursor blinking after the last typed token.
    const cursorGeometry = new THREE.BoxGeometry(VOXEL * 0.35, VOXEL * 0.75, VOXEL * 0.1);
    const cursorMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false });
    geometries.push(cursorGeometry);
    materials.push(cursorMaterial);
    const cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
    root.add(cursor);

    // Chair and Pranav swivel together around the gas lift (z = 1).
    const swivel = new THREE.Group();
    swivel.position.set(SEAT_X * VOXEL, 0, VOXEL);
    root.add(swivel);
    const seated = new THREE.Group();
    seated.position.z = -VOXEL;
    swivel.add(seated);

    seated.add(toMesh(parts.chair, { offset: seatedOffset }));
    seated.add(toMesh(parts.body, { offset: seatedOffset }));
    const waveArm = toMesh(parts.rightUpperArm, { origin: WAVE_SHOULDER, offset: seatedOffset });
    seated.add(waveArm);
    const waveForearm = toMesh(parts.rightForearm, { origin: WAVE_ELBOW, offset: seatedOffset });
    const elbowFromShoulder = WAVE_ELBOW.map((n, i) => (n - WAVE_SHOULDER[i]) * VOXEL);
    waveForearm.position.set(...elbowFromShoulder);
    waveArm.add(waveForearm);
    // Both hands are drawn in the forearm's frame; only one shows at a time.
    const restHand = toMesh(parts.restingHand, { origin: WAVE_ELBOW, offset: seatedOffset });
    const waveHand = toMesh(parts.openHand, { origin: WAVE_ELBOW, offset: seatedOffset });
    for (const hand of [restHand, waveHand]) {
        hand.position.set(0, 0, 0);
        waveForearm.add(hand);
    }
    waveHand.visible = false;
    const arm = toMesh(parts.upperArm, { origin: MUG_SHOULDER, offset: seatedOffset });
    seated.add(arm);
    // The forearm hangs off the upper arm, positioned relative to the shoulder.
    const lowerArm = toMesh(parts.forearm, { origin: MUG_ELBOW, offset: seatedOffset });
    lowerArm.position.set(
        (MUG_ELBOW[0] - MUG_SHOULDER[0]) * VOXEL,
        (MUG_ELBOW[1] - MUG_SHOULDER[1]) * VOXEL,
        (MUG_ELBOW[2] - MUG_SHOULDER[2]) * VOXEL
    );
    arm.add(lowerArm);

    const headGroup = toMesh(parts.head, { origin: NECK, offset: seatedOffset });
    // Glasses ride on the head, slim in depth so they read as wire.
    const frames = toMesh(glasses(), { size: [1, 1, 0.5] });
    frames.position.set(-NECK[0] * VOXEL, -NECK[1] * VOXEL, (-NECK[2] - 0.12) * VOXEL);
    headGroup.add(frames);
    seated.add(headGroup);

    // Steam from the coffee, following the mug.
    const steamGeometry = new THREE.BoxGeometry(VOXEL * 0.6, VOXEL * 0.6, VOXEL * 0.6);
    geometries.push(steamGeometry);
    const steam = [0, 1, 2].map(() => {
        const material = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, depthWrite: false });
        materials.push(material);
        const puff = new THREE.Mesh(steamGeometry, material);
        lowerArm.add(puff);
        return puff;
    });

    // Where the visitor's pointer is, as yaw/pitch for his head; null when
    // they haven't moved it for a while.
    let gaze = null;
    let headYaw = 0;
    let headPitch = 0;
    // Times (in scene seconds) when a wave or a sip was asked for.
    let waveAt = -Infinity;
    let sipAt = -Infinity;
    let now = 0;

    const smooth = (current, target, rate) => current + (target - current) * rate;
    const pulse = (since, length) => {
        const p = (now - since) / length;
        return p < 0 || p > 1 ? 0 : Math.sin(p * Math.PI);
    };

    const update = t => {
        now = t;
        // A lazy swivel in the chair.
        swivel.rotation.y = Math.sin(t * 0.35) * 0.18;

        // Follows the visitor's pointer; otherwise mostly looks at the
        // camera, glancing back at the monitor now and then.
        const glance = Math.max(0, Math.sin(t * 0.3 - 1)) ** 4;
        const yaw = gaze ? gaze.yaw - swivel.rotation.y : glance * 0.9 + Math.sin(t * 0.7) * 0.06;
        const pitch = gaze ? gaze.pitch : Math.sin(t * 0.9) * 0.03;
        headYaw = smooth(headYaw, yaw, 0.12);
        headPitch = smooth(headPitch, pitch, 0.12);
        headGroup.rotation.y = headYaw;
        headGroup.rotation.x = headPitch;

        // Sips every so often, or when asked: the elbow comes up and in, the
        // forearm brings the mug to his mouth and tips it, and he leans his
        // head back.
        const idleSip = Math.max(0, Math.sin(t * 0.5 - 1)) ** 6;
        const sip = Math.max(idleSip, pulse(sipAt, 1.6));
        arm.rotation.set(-SIP.shoulderX * sip, 0, -SIP.shoulderZ * sip);
        lowerArm.rotation.set(-SIP.elbowX * sip, -SIP.elbowY * sip, 0);
        headGroup.rotation.x -= SIP.head * sip;
        headGroup.rotation.y *= 1 - sip;

        // A wave: the arm comes up and out, the forearm stands up with the
        // palm open to the viewer, and the hand waggles from the elbow.
        const wave = Math.min(1, pulse(waveAt, 2.4) * 1.6);
        const waggle = wave ? Math.sin((now - waveAt) * 12) * 0.35 * wave : 0;
        waveArm.rotation.set(WAVE.shoulder[0] * wave, WAVE.shoulder[1] * wave, WAVE.shoulder[2] * wave);
        waveForearm.rotation.set(WAVE.elbow[0] * wave, WAVE.elbow[1] * wave + waggle, WAVE.elbow[2] * wave);
        restHand.visible = wave < 0.2;
        waveHand.visible = !restHand.visible;

        // Types a token every 0.12s, holds the finished screen, then starts
        // over. It starts on a full screen, matching the poster and the
        // reduced-motion still.
        const typing = tokens.length * 0.12;
        const typed = Math.min(tokens.length, Math.floor(((t + typing) % (typing + 2.5)) / 0.12));
        tokens.forEach((token, i) => {
            code.setMatrixAt(i, i < typed ? tokenMatrix.makeTranslation(token.x * VOXEL, token.y * VOXEL, CODE_Z * VOXEL) : hidden);
        });
        code.instanceMatrix.needsUpdate = true;
        const last = tokens[Math.max(0, typed - 1)];
        const next = tokens[typed];
        const at = next ?? { x: last.x + 1, y: last.y };
        cursor.position.set((at.x - 0.3) * VOXEL, at.y * VOXEL, CODE_Z * VOXEL);
        cursor.visible = typed < tokens.length || Math.floor(t * 2) % 2 === 0;

        steam.forEach((puff, i) => {
            const p = (t * 0.35 + i / steam.length) % 1;
            puff.position.set(
                (5 - MUG_ELBOW[0] + Math.sin(t * 2 + i * 2) * 0.3) * VOXEL,
                (15 - MUG_ELBOW[1] + p * 4) * VOXEL,
                (4.5 - MUG_ELBOW[2]) * VOXEL
            );
            puff.material.opacity = 0.5 * (1 - p) * (1 - sip);
            puff.scale.setScalar(0.6 + p * 0.8);
        });
    };

    // Head and torso, for working out whether a click landed on him.
    const person = seated;

    const dispose = () => {
        geometries.forEach(g => g.dispose());
        materials.forEach(m => m.dispose());
        geometries.length = 0;
        materials.length = 0;
    };

    return {
        root,
        update,
        dispose,
        person,
        bulb,
        // Head turn for a pointer at the given screen position (-1..1), or null to idle.
        lookAt: target => {
            gaze = target ? { yaw: target.x * 0.75, pitch: -target.y * 0.35 } : null;
        },
        wave: () => {
            if (now - waveAt > 2.4) waveAt = now;
        },
        sip: () => {
            if (now - sipAt > 1.6) sipAt = now;
        },
        // World positions for the lights that come from the scene itself.
        lights: {
            screen: new THREE.Vector3(2.5 * VOXEL, 14.5 * VOXEL, -6.5 * VOXEL),
            lamp: new THREE.Vector3(7 * VOXEL, 15.8 * VOXEL, -9 * VOXEL)
        }
    };
}

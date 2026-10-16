import * as THREE from 'three';

// A voxel Pranav at work: in his desk chair, turned round with a coffee,
// in front of a monitor full of code and a laptop running NomadSafe.
// Units are voxels; x is right, y is up, z faces the viewer.

export const VOXEL = 0.215;
// Height the camera orbits around, in voxels.
export const CENTER_Y = 12;

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
    coffee: '#4a2c1d'
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

const geometries = [];
const materials = [];

// One InstancedMesh per part, wrapped in a group whose position is the
// part's pivot (`origin`, in voxels), so parts can be rotated in place.
const toMesh = (
    voxels,
    { origin = [0, 0, 0], size = [1, 1, 1], basic = false } = {}
) => {
    const list = voxels.visible();
    const geometry = new THREE.BoxGeometry(
        VOXEL * size[0],
        VOXEL * size[1],
        VOXEL * size[2]
    );
    const material = basic
        ? new THREE.MeshBasicMaterial()
        : new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0 });
    geometries.push(geometry);
    materials.push(material);

    const mesh = new THREE.InstancedMesh(geometry, material, list.length);
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    list.forEach((v, i) => {
        matrix.makeTranslation(
            (v.x - origin[0]) * VOXEL,
            (v.y - origin[1]) * VOXEL,
            (v.z - origin[2]) * VOXEL
        );
        mesh.setMatrixAt(i, matrix);
        mesh.setColorAt(i, color.set(v.color));
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

const screens = () => {
    const v = new Voxels();
    const z = -8.45;
    // Monitor: lines of code.
    v.fill(0, 5, 13, 16, z, z, C.screen);
    [
        [0, 2],
        [1, 3],
        [1, 1],
        [0, 2]
    ].forEach(([start, end], row) => {
        for (let x = start; x <= end; x++)
            v.set(x, 16 - row, z, C.code[(row * 2 + x) % C.code.length]);
    });
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

// Built around x = 0, like Pranav, so it swivels with him.
const chair = () => {
    const v = new Voxels();
    // Star base and gas lift.
    v.fill(-3, 3, 0, 0, 1, 1, C.chairShade);
    v.fill(0, 0, 0, 0, -2, 4, C.chairShade);
    v.fill(0, 0, 1, 4, 1, 1, C.metal);
    // Seat and backrest.
    v.fill(-4, 4, 5, 5, -2, 4, C.chair);
    v.fill(-4, 4, 6, 15, -3, -3, (x, y) => (y === 15 ? C.chairShade : C.chair));
    return v;
};

// --- Pranav -----------------------------------------------------------------

const body = () => {
    const v = new Voxels();
    // Thighs on the seat, shins down, white sneakers.
    for (const x0 of [-4, 2]) {
        v.fill(x0, x0 + 2, 6, 7, -1, 4, (x, y) =>
            y === 6 ? C.pantsShade : C.pants
        );
        v.fill(x0, x0 + 2, 2, 5, 3, 4, C.pants);
        v.fill(x0, x0 + 2, 1, 1, 3, 6, C.shoe);
        v.fill(x0, x0 + 2, 0, 0, 3, 6, C.sole);
    }
    v.fill(-1, 1, 7, 7, -1, 1, C.pants);
    // Navy tee.
    v.fill(-4, 4, 8, 16, -2, 1, (x, y) => (y === 8 ? C.teeShade : C.tee));
    v.fill(-2, 2, 16, 16, -2, 1, C.teeShade);
    v.fill(-1, 1, 16, 17, -1, 0, C.skinShade);
    return v;
};

// His right arm (viewer's left) rests on his knee.
const restingArm = () => {
    const v = new Voxels();
    v.fill(-6, -5, 14, 16, -1, 0, C.tee);
    v.fill(-6, -5, 10, 13, -1, 0, C.skin);
    v.fill(-6, -5, 9, 9, -1, 3, C.skin);
    v.fill(-5, -4, 8, 8, 3, 4, C.skinShade);
    return v;
};

// His left arm holds a coffee. Pivots at the shoulder so he can take a sip.
const MUG_SHOULDER = [5.5, 16, -0.5];

const mugArm = () => {
    const v = new Voxels();
    v.fill(5, 6, 14, 16, -1, 0, C.tee);
    v.fill(5, 6, 11, 13, -1, 0, C.skin);
    v.fill(5, 6, 11, 11, 1, 3, C.skin);
    v.fill(5, 6, 11, 11, 1, 1, C.watch);
    // The mug.
    v.fill(4, 6, 11, 14, 4, 5, C.mug);
    v.fill(5, 5, 14, 14, 4, 5, C.coffee);
    v.set(7, 13, 4, C.mug);
    return v;
};

const NECK = [0, 17, 0];

const head = () => {
    const v = new Voxels();
    // 7 wide, 8 tall, 7 deep; the face is at z = 3.
    v.fill(-3, 3, 18, 25, -3, 3, C.skin);

    // Short trimmed beard along the jaw and chin, and a moustache.
    v.fill(-3, 3, 18, 18, -2, 3, C.beard);
    v.fill(-3, -3, 18, 21, -1, 3, C.beard);
    v.fill(3, 3, 18, 21, -1, 3, C.beard);
    v.fill(-2, 2, 19, 19, 3, 3, C.beard);
    v.fill(-1, 1, 19, 19, 3, 3, C.lip);
    v.fill(-2, 2, 20, 20, 3, 3, C.beard);

    // Nose.
    v.set(0, 21, 4, C.skin);
    v.set(0, 20, 4, C.skinShade);

    // Eyes (the glasses are a separate, thinner mesh) and eyebrows.
    v.set(-2, 22, 3, C.eye);
    v.set(2, 22, 3, C.eye);
    v.fill(-3, -2, 24, 24, 3, 3, C.hair);
    v.fill(2, 3, 24, 24, 3, 3, C.hair);

    // Ears.
    v.fill(-4, -4, 21, 22, 0, 1, C.skinShade);
    v.fill(4, 4, 21, 22, 0, 1, C.skinShade);

    // Hair: short at the sides and back, swept up into a quiff at the front.
    const hair = (x, y, z) => (rand(x, y, z) > 0.65 ? C.hairLight : C.hair);
    v.fill(-3, 3, 26, 26, -3, 3, C.hair);
    v.fill(-4, -4, 24, 26, -3, 1, C.hair);
    v.fill(4, 4, 24, 26, -3, 1, C.hair);
    v.fill(-3, 3, 20, 26, -4, -4, C.hair);
    v.fill(-3, 3, 27, 27, -3, 3, hair);
    v.fill(-2, 3, 28, 28, 0, 3, hair);
    v.fill(-3, -1, 26, 26, 4, 4, C.hair);
    return v;
};

// Thin wire-frame glasses: drawn with skinny boxes so the eyes show through.
const glasses = () => {
    const v = new Voxels();
    for (const x0 of [-3, 1]) {
        v.fill(x0, x0 + 2, 23, 23, 4, 4, C.frame);
        v.fill(x0, x0 + 2, 21, 21, 4, 4, C.frame);
        v.set(x0, 22, 4, C.frame);
        v.set(x0 + 2, 22, 4, C.frame);
    }
    v.set(0, 22, 4, C.frame);
    return v;
};

const temples = () => {
    const v = new Voxels();
    // Hugging the sides of the head (which end at x = ±3.5).
    for (let z = -1; z <= 3; z++) {
        v.set(-3.65, 23, z, C.frame);
        v.set(3.65, 23, z, C.frame);
    }
    return v;
};

export function buildPranav() {
    const root = new THREE.Group();

    root.add(toMesh(floor()));
    root.add(toMesh(rug(), { size: [1, 0.2, 1] }));
    root.add(toMesh(desk()));
    root.add(toMesh(screens(), { size: [1, 1, 0.1], basic: true }));

    // Cursor blinking after the last line of code.
    const cursorGeometry = new THREE.BoxGeometry(
        VOXEL * 0.5,
        VOXEL * 0.8,
        VOXEL * 0.1
    );
    const cursorMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    geometries.push(cursorGeometry);
    materials.push(cursorMaterial);
    const cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
    cursor.position.set(3 * VOXEL, 13 * VOXEL, -8.38 * VOXEL);
    root.add(cursor);

    // Chair and Pranav swivel together around the gas lift (z = 1).
    const swivel = new THREE.Group();
    swivel.position.set(SEAT_X * VOXEL, 0, VOXEL);
    root.add(swivel);
    const seated = new THREE.Group();
    seated.position.z = -VOXEL;
    swivel.add(seated);

    seated.add(toMesh(chair()));
    seated.add(toMesh(body()));
    seated.add(toMesh(restingArm()));
    const arm = toMesh(mugArm(), { origin: MUG_SHOULDER });
    seated.add(arm);

    const headGroup = toMesh(head(), { origin: NECK });
    // Glasses ride on the head; their boxes are thin so they read as wire.
    const frames = toMesh(glasses(), { size: [1, 0.3, 0.3] });
    const sides = toMesh(temples(), { size: [0.3, 0.3, 1] });
    frames.position.set(0, -NECK[1] * VOXEL, -0.3 * VOXEL);
    sides.position.set(0, -NECK[1] * VOXEL, 0);
    headGroup.add(frames, sides);
    seated.add(headGroup);

    // Steam from the coffee, following the mug.
    const steamGeometry = new THREE.BoxGeometry(
        VOXEL * 0.6,
        VOXEL * 0.6,
        VOXEL * 0.6
    );
    geometries.push(steamGeometry);
    const steam = [0, 1, 2].map(() => {
        const material = new THREE.MeshBasicMaterial({
            color: '#ffffff',
            transparent: true,
            depthWrite: false
        });
        materials.push(material);
        const puff = new THREE.Mesh(steamGeometry, material);
        arm.add(puff);
        return puff;
    });

    const update = t => {
        // A lazy swivel in the chair.
        swivel.rotation.y = Math.sin(t * 0.35) * 0.18;
        // Mostly looks at you, glancing back at the monitor now and then.
        const glance = Math.max(0, Math.sin(t * 0.3 - 1)) ** 4;
        headGroup.rotation.y = glance * 0.9 + Math.sin(t * 0.7) * 0.06;
        headGroup.rotation.x = Math.sin(t * 0.9) * 0.03;
        // Lifts the coffee for a sip every so often.
        const sip = Math.max(0, Math.sin(t * 0.5 + 2)) ** 6;
        arm.rotation.x = -sip * 0.5;

        cursor.visible = Math.floor(t * 2) % 2 === 0;

        steam.forEach((puff, i) => {
            const p = (t * 0.35 + i / steam.length) % 1;
            puff.position.set(
                (5 - MUG_SHOULDER[0] + Math.sin(t * 2 + i * 2) * 0.3) * VOXEL,
                (15 - MUG_SHOULDER[1] + p * 4) * VOXEL,
                (4.5 - MUG_SHOULDER[2]) * VOXEL
            );
            puff.material.opacity = 0.5 * (1 - p);
            puff.scale.setScalar(0.6 + p * 0.8);
        });
    };

    const dispose = () => {
        geometries.forEach(g => g.dispose());
        materials.forEach(m => m.dispose());
        geometries.length = 0;
        materials.length = 0;
    };

    return { root, update, dispose };
}

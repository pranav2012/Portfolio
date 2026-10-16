import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// @ts-expect-error: plain JS module
import { buildPranav, VOXEL, CENTER_Y } from './voxel-pranav-model.js';

const easeOutCirc = (x: number) => Math.sqrt(1 - Math.pow(x - 1, 4));

// He sits facing the viewer, so dragging turns the camera across the front
// only, and it settles back at HOME_ANGLE (the poster's angle) afterwards.
const HOME_ANGLE = 0.2 * Math.PI;
const MIN_ANGLE = 0.05 * Math.PI;
const MAX_ANGLE = 0.35 * Math.PI;
const INTRO_FRAMES = 100;

// Light rigs for the site's two themes: warm daylight, and a moonlit room lit
// by the desk lamp and the monitor.
type Rig = {
    exposure: number;
    sky: string;
    ground: string;
    hemi: number;
    sun: string;
    sunIntensity: number;
    fill: number;
    rim: number;
    screen: number;
    lamp: number;
    bulb: string;
};
const RIGS: Record<'light' | 'dark', Rig> = {
    light: {
        exposure: 1.05,
        sky: '#fff6e8',
        ground: '#8a7a6a',
        hemi: 2.1,
        sun: '#fff1dc',
        sunIntensity: 3.2,
        fill: 0.6,
        rim: 0.8,
        screen: 0.5,
        lamp: 0,
        bulb: '#5a5550'
    },
    dark: {
        exposure: 1.3,
        sky: '#8ea2dd',
        ground: '#3a3044',
        hemi: 1.35,
        sun: '#b4c4ff',
        sunIntensity: 1.5,
        fill: 0.35,
        rim: 2.2,
        screen: 7,
        lamp: 16,
        bulb: '#ffe2b0'
    }
};

type Options = {
    // A fixed frustum half-height, so the model scales with the container
    // exactly as a static poster of it would.
    zoom?: number;
    // Start at rest instead of swinging in, to take over seamlessly from a
    // poster image.
    skipIntro?: boolean;
};

// Renders the desk scene into `container`; returns a function that tears it
// down again.
export function mount(container: HTMLElement, { zoom, skipIntro = false }: Options = {}) {
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const still = reduceMotion || skipIntro;
    const target = new THREE.Vector3(0, CENTER_Y * VOXEL, 0);
    const cameraAt = (angle: number) => new THREE.Vector3(20 * Math.sin(angle), 10 + target.y, 20 * Math.cos(angle));

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Sized by the container, not by its own pixel buffer.
    renderer.domElement.classList.add('absolute', 'inset-0', 'size-full');
    container.appendChild(renderer.domElement);

    // The frustum is set by resize().
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 1000);
    camera.position.copy(cameraAt(still ? HOME_ANGLE : HOME_ANGLE + 1.2));
    camera.lookAt(target);

    const scene = new THREE.Scene();
    const model = buildPranav();
    scene.add(model.root);

    const hemi = new THREE.HemisphereLight();
    scene.add(hemi);
    const sun = new THREE.DirectionalLight();
    sun.position.set(5, 12, 9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 9, bottom: -5 });
    sun.shadow.bias = -0.0015;
    sun.shadow.normalBias = 0.02;
    sun.shadow.radius = 4;
    scene.add(sun);
    // The rim light, from behind, pulls him off the background.
    const fill = new THREE.DirectionalLight('#cfe0ff');
    fill.position.set(-8, 5, 6);
    scene.add(fill);
    const rim = new THREE.DirectionalLight('#9fd8ff');
    rim.position.set(-4, 8, -10);
    scene.add(rim);
    const screenGlow = new THREE.PointLight('#5fd4ff', 0, 5, 1.2);
    screenGlow.position.copy(model.lights.screen);
    scene.add(screenGlow);
    const lampLight = new THREE.PointLight('#ffb15c', 0, 6, 1.1);
    lampLight.position.copy(model.lights.lamp);
    scene.add(lampLight);

    // Blends the lights towards the current theme's rig over about a second.
    const theme = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    let rig: Rig = RIGS[theme()];
    const colors = { sky: new THREE.Color(), ground: new THREE.Color(), sun: new THREE.Color(), bulb: new THREE.Color() };
    const applyRig = (blend: number) => {
        const k = reduceMotion ? 1 : blend;
        const mix = (from: number, to: number) => from + (to - from) * k;
        renderer.toneMappingExposure = mix(renderer.toneMappingExposure, rig.exposure);
        hemi.color.lerp(colors.sky.set(rig.sky), k);
        hemi.groundColor.lerp(colors.ground.set(rig.ground), k);
        hemi.intensity = mix(hemi.intensity, rig.hemi);
        sun.color.lerp(colors.sun.set(rig.sun), k);
        sun.intensity = mix(sun.intensity, rig.sunIntensity);
        fill.intensity = mix(fill.intensity, rig.fill);
        rim.intensity = mix(rim.intensity, rig.rim);
        screenGlow.intensity = mix(screenGlow.intensity, rig.screen);
        lampLight.intensity = mix(lampLight.intensity, rig.lamp);
        model.bulb.material.color.lerp(colors.bulb.set(rig.bulb), k);
    };
    applyRig(1);
    const themeWatcher = new MutationObserver(() => (rig = RIGS[theme()]));
    themeWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minAzimuthAngle = MIN_ANGLE;
    controls.maxAzimuthAngle = MAX_ANGLE;
    controls.minPolarAngle = 0.25 * Math.PI;
    controls.maxPolarAngle = 0.42 * Math.PI;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.target = target;

    // A second after a drag ends, the camera eases back to where it started.
    const home = new THREE.Spherical().setFromVector3(cameraAt(HOME_ANGLE).sub(target));
    const spherical = new THREE.Spherical();
    const offset = new THREE.Vector3();
    let returning = false;
    let returnTimer = 0;
    controls.addEventListener('start', () => {
        clearTimeout(returnTimer);
        returning = false;
    });
    controls.addEventListener('end', () => {
        returnTimer = window.setTimeout(() => (returning = true), reduceMotion ? 0 : 1000);
    });

    // He follows the pointer anywhere on the page, and goes back to idling a
    // few seconds after it stops.
    let idleTimer = 0;
    const onPointerMove = (event: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        const x = ((event.clientX - (rect.left + rect.width / 2)) / innerWidth) * 2;
        const y = ((event.clientY - (rect.top + rect.height * 0.35)) / innerHeight) * 2;
        model.lookAt({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
        clearTimeout(idleTimer);
        idleTimer = window.setTimeout(() => model.lookAt(null), 3000);
    };
    addEventListener('pointermove', onPointerMove, { passive: true });

    // A click on him gets a wave; anywhere else in the scene, a sip. Drags
    // (to rotate the camera) don't count.
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downAt: { x: number; y: number } | null = null;
    const onPointerDown = (event: PointerEvent) => (downAt = { x: event.clientX, y: event.clientY });
    const onPointerUp = (event: PointerEvent) => {
        if (!downAt || Math.hypot(event.clientX - downAt.x, event.clientY - downAt.y) > 6) return;
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        if (raycaster.intersectObject(model.person, true).length) model.wave();
        else model.sip();
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const resize = () => {
        const { clientWidth: w, clientHeight: h } = container;
        renderer.setSize(w, h, false);
        // Zoom with the container, as the original site did.
        const scale = zoom ?? h * 0.005 + 4.8;
        const aspect = w / h;
        camera.left = -scale * aspect;
        camera.right = scale * aspect;
        camera.top = scale;
        camera.bottom = -scale;
        camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    // Only animate while the scene is on screen.
    let visible = true;
    const visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
    });
    visibility.observe(container);

    const timer = new THREE.Timer();
    let frame = still ? INTRO_FRAMES : 0;
    let req = 0;
    const animate = () => {
        req = requestAnimationFrame(animate);
        if (!visible) return;
        timer.update();

        if (frame < INTRO_FRAMES) {
            frame++;
            const ease = easeOutCirc(frame / INTRO_FRAMES);
            camera.position.copy(cameraAt(HOME_ANGLE + 1.2 * (1 - ease)));
            camera.lookAt(target);
        } else {
            if (returning) {
                // Exponential ease, so the speed doesn't depend on frame rate.
                const k = reduceMotion ? 1 : 1 - Math.exp(-timer.getDelta() * 5);
                spherical.setFromVector3(offset.copy(camera.position).sub(target));
                spherical.theta += (home.theta - spherical.theta) * k;
                spherical.phi += (home.phi - spherical.phi) * k;
                if (Math.abs(home.theta - spherical.theta) + Math.abs(home.phi - spherical.phi) < 1e-4) {
                    spherical.theta = home.theta;
                    spherical.phi = home.phi;
                    returning = false;
                }
                camera.position.copy(target).add(offset.setFromSpherical(spherical));
                camera.lookAt(target);
            }
            controls.update();
        }

        applyRig(0.06);
        model.update(reduceMotion ? 0 : timer.getElapsed());
        renderer.render(scene, camera);
        if (container.dataset.ready === undefined) container.dataset.ready = '';
    };
    animate();

    return () => {
        cancelAnimationFrame(req);
        clearTimeout(idleTimer);
        clearTimeout(returnTimer);
        removeEventListener('pointermove', onPointerMove);
        themeWatcher.disconnect();
        observer.disconnect();
        visibility.disconnect();
        controls.dispose();
        model.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        delete container.dataset.ready;
    };
}

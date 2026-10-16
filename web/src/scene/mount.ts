import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// @ts-expect-error: plain JS module
import { buildPranav, VOXEL, CENTER_Y } from './voxel-pranav-model.js';

const easeOutCirc = (x: number) => Math.sqrt(1 - Math.pow(x - 1, 4));

// He sits facing the viewer, so the camera sways across the front instead
// of going all the way round.
const HOME_ANGLE = 0.2 * Math.PI;
const MIN_ANGLE = 0.05 * Math.PI;
const MAX_ANGLE = 0.35 * Math.PI;
const INTRO_FRAMES = 100;

// Renders the desk scene into `container`; returns a function that tears it
// down again.
export function mount(container: HTMLElement) {
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = new THREE.Vector3(0, CENTER_Y * VOXEL, 0);
    const cameraAt = (angle: number) =>
        new THREE.Vector3(
            20 * Math.sin(angle),
            10 + target.y,
            20 * Math.cos(angle)
        );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    // Sized by the container, not by its own pixel buffer.
    renderer.domElement.classList.add('absolute', 'inset-0', 'size-full');
    container.appendChild(renderer.domElement);

    // The frustum is set by resize().
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 1000);
    camera.position.copy(
        cameraAt(reduceMotion ? HOME_ANGLE : HOME_ANGLE + 1.2)
    );
    camera.lookAt(target);

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7a6a, 2.2));
    const sun = new THREE.DirectionalLight(0xffffff, 2.4);
    sun.position.set(5, 12, 9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, {
        left: -7,
        right: 7,
        top: 9,
        bottom: -5
    });
    sun.shadow.bias = -0.002;
    sun.shadow.normalBias = 0.02;
    scene.add(sun);

    const model = buildPranav();
    scene.add(model.root);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = !reduceMotion;
    controls.autoRotateSpeed = 0.6;
    controls.minAzimuthAngle = MIN_ANGLE;
    controls.maxAzimuthAngle = MAX_ANGLE;
    controls.minPolarAngle = 0.25 * Math.PI;
    controls.maxPolarAngle = 0.42 * Math.PI;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.target = target;

    const resize = () => {
        const { clientWidth: w, clientHeight: h } = container;
        renderer.setSize(w, h, false);
        // Zoom with the container, as the original site did.
        const scale = h * 0.005 + 4.8;
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
    let frame = reduceMotion ? INTRO_FRAMES : 0;
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
            // Turn back at either end of the arc. (A positive speed
            // decreases the azimuth.)
            const angle = controls.getAzimuthalAngle();
            if (angle >= MAX_ANGLE - 0.01) controls.autoRotateSpeed = 0.6;
            if (angle <= MIN_ANGLE + 0.01) controls.autoRotateSpeed = -0.6;
            controls.update();
        }

        model.update(reduceMotion ? 0 : timer.getElapsed());
        renderer.render(scene, camera);
    };
    animate();
    container.dataset.ready = '';

    return () => {
        cancelAnimationFrame(req);
        observer.disconnect();
        visibility.disconnect();
        controls.dispose();
        model.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        delete container.dataset.ready;
    };
}

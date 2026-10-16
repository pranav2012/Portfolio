import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VoxelSpinner, VoxelContainer } from 'Elements/voxel-loader';
import { buildPranav, VOXEL, CENTER_Y } from 'Utils/voxel-pranav-model';

function easeOutCirc(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 4));
}

// He sits facing the viewer, so the camera sways across the front instead
// of going all the way round.
const HOME_ANGLE = 0.2 * Math.PI;
const MIN_ANGLE = 0.05 * Math.PI;
const MAX_ANGLE = 0.35 * Math.PI;
const INTRO_FRAMES = 100;

const VoxelPranav = () => {
    const refContainer = useRef();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { current: container } = refContainer;
        if (!container) return;

        const scW = container.clientWidth;
        const scH = container.clientHeight;
        const target = new THREE.Vector3(0, CENTER_Y * VOXEL, 0);
        const cameraAt = angle =>
            new THREE.Vector3(
                20 * Math.sin(angle),
                10 + target.y,
                20 * Math.cos(angle)
            );
        const scene = new THREE.Scene();

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(scW, scH);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        container.appendChild(renderer.domElement);

        const scale = scH * 0.005 + 4.8;
        const camera = new THREE.OrthographicCamera(
            -scale,
            scale,
            scale,
            -scale,
            0.01,
            50000
        );
        camera.position.copy(cameraAt(HOME_ANGLE + 1.2));
        camera.lookAt(target);

        scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7a6a, 2.2));
        const sun = new THREE.DirectionalLight(0xffffff, 2.4);
        sun.position.set(5, 12, 9);
        sun.castShadow = true;
        sun.shadow.mapSize.set(1024, 1024);
        sun.shadow.camera.left = -7;
        sun.shadow.camera.right = 7;
        sun.shadow.camera.top = 9;
        sun.shadow.camera.bottom = -5;
        sun.shadow.bias = -0.002;
        sun.shadow.normalBias = 0.02;
        scene.add(sun);

        const model = buildPranav();
        scene.add(model.root);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.6;
        controls.minAzimuthAngle = MIN_ANGLE;
        controls.maxAzimuthAngle = MAX_ANGLE;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.target = target;

        const timer = new THREE.Timer();
        let req = null;
        let frame = 0;
        const animate = () => {
            req = requestAnimationFrame(animate);

            frame = frame <= INTRO_FRAMES ? frame + 1 : frame;

            if (frame <= INTRO_FRAMES) {
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

            timer.update();
            model.update(timer.getElapsed());
            renderer.render(scene, camera);
        };
        animate();
        setLoading(false);

        const handleWindowResize = () => {
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleWindowResize, false);

        return () => {
            window.removeEventListener('resize', handleWindowResize, false);
            cancelAnimationFrame(req);
            controls.dispose();
            model.dispose();
            renderer.dispose();
            container.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <VoxelContainer ref={refContainer}>
            {loading && <VoxelSpinner />}
        </VoxelContainer>
    );
};

export default VoxelPranav;

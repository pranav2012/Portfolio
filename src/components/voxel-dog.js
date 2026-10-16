import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadGLTFModel } from 'Utils/model';
import { DogSpinner, DogContainer } from 'Elements/voxel-dog-loader';

function easeOutCirc(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 4));
}

const VoxelDog = () => {
    const refContainer = useRef();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { current: container } = refContainer;
        if (!container) return;

        const scW = container.clientWidth;
        const scH = container.clientHeight;
        const target = new THREE.Vector3(-0.5, 1.2, 0);
        const initialCameraPosition = new THREE.Vector3(
            20 * Math.sin(0.2 * Math.PI),
            10,
            20 * Math.cos(0.2 * Math.PI)
        );
        const scene = new THREE.Scene();

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(scW, scH);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);

        // 640 -> 240
        // 8   -> 6
        const scale = scH * 0.005 + 4.8;
        const camera = new THREE.OrthographicCamera(
            -scale,
            scale,
            scale,
            -scale,
            0.01,
            50000
        );
        camera.position.copy(initialCameraPosition);
        camera.lookAt(target);

        // three r155+ uses physically-correct lighting; scale by PI to keep the old brightness
        const ambientLight = new THREE.AmbientLight(0xcccccc, Math.PI);
        scene.add(ambientLight);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.autoRotate = true;
        controls.target = target;

        let req = null;
        let frame = 0;
        let disposed = false;
        const animate = () => {
            req = requestAnimationFrame(animate);

            frame = frame <= 100 ? frame + 1 : frame;

            if (frame <= 100) {
                const p = initialCameraPosition;
                const rotSpeed = -easeOutCirc(frame / 120) * Math.PI * 20;

                camera.position.y = 10;
                camera.position.x =
                    p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed);
                camera.position.z =
                    p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed);
                camera.lookAt(target);
            } else {
                controls.update();
            }

            renderer.render(scene, camera);
        };

        loadGLTFModel(scene, '/dog.glb', {
            receiveShadow: false,
            castShadow: false
        }).then(() => {
            if (disposed) return;
            animate();
            setLoading(false);
        });

        const handleWindowResize = () => {
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleWindowResize, false);

        return () => {
            disposed = true;
            window.removeEventListener('resize', handleWindowResize, false);
            cancelAnimationFrame(req);
            controls.dispose();
            renderer.dispose();
            container.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <DogContainer ref={refContainer}>
            {loading && <DogSpinner />}
        </DogContainer>
    );
};

export default VoxelDog;

<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as THREE from "three";

    let canvas: HTMLCanvasElement;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let frameId: number;

    // --- Configuration ---
    const COLORS = {
        skin: 0xffcdb3, // Peachy skin
        shirt: 0xffffff, // White
        hair: 0x2c1a12, // Dark Brown
        headphones: 0xf4f4f5, // White plastic
        laptop_body: 0xe4e4e7, // Silver
        laptop_screen: 0x18181b, // Black screen
        desk: 0x2d2d33, // Dark grey
        bg: 0x0d0d0f, // Ink
    };

    onMount(() => {
        if (!canvas) return;

        initScene();

        // Groups
        const characterGroup = new THREE.Group();
        const deskGroup = new THREE.Group();

        createCharacter(characterGroup);
        createDeskEnvironment(deskGroup);

        scene.add(characterGroup);
        scene.add(deskGroup);

        animate();

        window.addEventListener("resize", handleResize);

        // --- Init ---
        function initScene() {
            scene = new THREE.Scene();
            scene.fog = new THREE.Fog(COLORS.bg, 6, 20);

            camera = new THREE.PerspectiveCamera(
                28,
                canvas.clientWidth / canvas.clientHeight,
                0.1,
                100,
            );
            camera.position.set(3, 2, 6.5); // Lower, closer, more intimate
            camera.lookAt(0, 0.8, 0);

            renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: true,
            });
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;

            // -- Lighting (Studio) --
            const ambient = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambient);

            // Key Light (Warm)
            const keyLight = new THREE.SpotLight(0xffebd6, 12);
            keyLight.position.set(4, 6, 4);
            keyLight.angle = Math.PI / 6;
            keyLight.penumbra = 0.4;
            keyLight.castShadow = true;
            keyLight.shadow.mapSize.set(2048, 2048);
            keyLight.shadow.bias = -0.0001;
            scene.add(keyLight);

            // Fill Light (Cool)
            const fillLight = new THREE.DirectionalLight(0xdcecfb, 1);
            fillLight.position.set(-4, 2, 2);
            scene.add(fillLight);

            // Back Light (Rim)
            const backLight = new THREE.DirectionalLight(0xffffff, 1.5);
            backLight.position.set(0, 4, -4);
            scene.add(backLight);
        }

        // --- Character Builder ---
        function createCharacter(parent: THREE.Group) {
            const matSkin = new THREE.MeshStandardMaterial({
                color: COLORS.skin,
                roughness: 0.4,
            });
            const matWhite = new THREE.MeshStandardMaterial({
                color: COLORS.shirt,
                roughness: 0.8,
            });
            const matDeep = new THREE.MeshStandardMaterial({
                color: COLORS.hair,
                roughness: 0.9,
            });
            const matBlack = new THREE.MeshStandardMaterial({
                color: 0x111111,
                roughness: 0.2,
            });

            // 1. Head (Sphere) - Chibi Style
            const headGroup = new THREE.Group();
            headGroup.position.set(0, 1.25, 0);
            parent.add(headGroup);

            // Larger head relative to body
            const headGeo = new THREE.SphereGeometry(0.48, 64, 64);
            const head = new THREE.Mesh(headGeo, matSkin);
            head.castShadow = true;
            head.receiveShadow = true;
            headGroup.add(head);

            // 2. Face Features
            // Eyes
            const eyeGeo = new THREE.SphereGeometry(0.05, 32, 32);
            const eyeL = new THREE.Mesh(eyeGeo, matBlack);
            eyeL.position.set(-0.16, 0.05, 0.43);
            headGroup.add(eyeL);
            const eyeR = eyeL.clone();
            eyeR.position.set(0.16, 0.05, 0.43);
            headGroup.add(eyeR);

            // Nose (Small sphere)
            const nose = new THREE.Mesh(
                new THREE.SphereGeometry(0.04, 32, 32),
                matSkin,
            );
            nose.position.set(0, -0.05, 0.48);
            headGroup.add(nose);

            // 3. Hair (Bubble Cloud)
            const hairGroup = new THREE.Group();
            headGroup.add(hairGroup);

            // Multiple spheres for volume
            const hairPositions = [
                { x: 0, y: 0.42, z: 0, s: 0.38 }, // Top Center
                { x: -0.3, y: 0.35, z: 0.1, s: 0.28 }, // Top Left
                { x: 0.3, y: 0.35, z: 0.1, s: 0.28 }, // Top Right
                { x: 0, y: 0.38, z: -0.25, s: 0.35 }, // Back Top
                { x: -0.42, y: 0.1, z: 0, s: 0.22 }, // Side L
                { x: 0.42, y: 0.1, z: 0, s: 0.22 }, // Side R
                { x: 0, y: 0.1, z: -0.45, s: 0.32 }, // Back Low
            ];

            hairPositions.forEach((pos) => {
                const puff = new THREE.Mesh(
                    new THREE.SphereGeometry(pos.s, 32, 32),
                    matDeep,
                );
                puff.position.set(pos.x, pos.y, pos.z);
                // Mild randomness for natural look
                puff.rotation.set(Math.random(), Math.random(), Math.random());
                hairGroup.add(puff);
            });

            // 4. Headphones
            const bandNode = new THREE.Group();
            headGroup.add(bandNode);

            // Band
            const bandGeo = new THREE.TorusGeometry(
                0.58,
                0.06,
                16,
                64,
                Math.PI + 0.6,
            );
            const band = new THREE.Mesh(bandGeo, matWhite);
            band.rotation.x = -0.15; // Tilted back
            bandNode.add(band);

            // Ear Cups
            const cupGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.15, 32);
            cupGeo.rotateZ(Math.PI / 2);

            const earL = new THREE.Mesh(cupGeo, matWhite);
            earL.position.set(-0.58, -0.05, 0);
            bandNode.add(earL);

            const earR = earL.clone();
            earR.position.set(0.58, -0.05, 0);
            bandNode.add(earR);

            // 5. Body (Soft Cone/Capsule)
            const bodyGeo = new THREE.CylinderGeometry(0.25, 0.45, 0.9, 32);
            const body = new THREE.Mesh(bodyGeo, matWhite);
            body.position.set(0, 0.45, 0); // Sit on desk
            body.castShadow = true;
            parent.add(body);

            // 6. Arms
            const armGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.55, 32);

            // Left Arm
            const lArmGroup = new THREE.Group();
            lArmGroup.position.set(-0.4, 0.8, 0); // Shoulder
            parent.add(lArmGroup);

            const lUpper = new THREE.Mesh(armGeo, matWhite);
            lUpper.position.y = -0.25;
            lArmGroup.add(lUpper);

            const lForeGroup = new THREE.Group();
            lForeGroup.position.y = -0.5;
            lUpper.add(lForeGroup);

            const lFore = new THREE.Mesh(
                new THREE.CylinderGeometry(0.09, 0.08, 0.55, 32),
                matSkin,
            );
            lFore.position.y = -0.27;
            lFore.castShadow = true;
            lForeGroup.add(lFore);

            // Hands
            const lHand = new THREE.Mesh(
                new THREE.SphereGeometry(0.1),
                matSkin,
            );
            lHand.position.y = -0.55;
            lForeGroup.add(lHand);

            // Pose Arm
            lArmGroup.rotation.z = 0.2;
            lArmGroup.rotation.x = 0.4;
            lForeGroup.rotation.x = -1.8; // Bend elbow
            lForeGroup.rotation.z = -0.3; // Hands in

            // Right Arm (Clone & Mirror)
            const rArmGroup = lArmGroup.clone();
            rArmGroup.position.set(0.4, 0.8, 0);
            rArmGroup.rotation.z = -0.2; // Mirror Z
            rArmGroup.rotation.x = 0.4; // Same X

            const rForeGroup = rArmGroup.children[0].children[0];
            rForeGroup.rotation.x = -1.8;
            rForeGroup.rotation.z = 0.3; // Mirror Hand in

            parent.add(rArmGroup);

            parent.userData = {
                head: headGroup,
                lFore: lForeGroup,
                rFore: rForeGroup,
            };
        }

        // --- Environment ---
        function createDeskEnvironment(parent: THREE.Group) {
            const matDesk = new THREE.MeshStandardMaterial({
                color: COLORS.desk,
                roughness: 0.8,
            });
            const matSilver = new THREE.MeshStandardMaterial({
                color: COLORS.laptop_body,
                roughness: 0.3,
                metalness: 0.4,
            });
            const matScreen = new THREE.MeshStandardMaterial({
                color: COLORS.laptop_screen,
                roughness: 0.2,
            });

            // Desk
            const desk = new THREE.Mesh(
                new THREE.BoxGeometry(8, 0.1, 4),
                matDesk,
            );
            desk.position.set(0, -0.05, 1.5);
            desk.receiveShadow = true;
            parent.add(desk);

            // Laptop (Sleeker & Smaller to not block view)
            const laptop = new THREE.Group();
            // Moved slightly forward, rotated 180 (facng char), and reduced scale
            laptop.position.set(0, 0, 0.9);
            laptop.rotation.y = Math.PI; // Face the character
            laptop.scale.set(0.8, 0.8, 0.8);
            parent.add(laptop);

            const base = new THREE.Mesh(
                new THREE.BoxGeometry(1.4, 0.05, 1),
                matSilver,
            );
            base.castShadow = true;
            laptop.add(base);

            const lid = new THREE.Group();
            lid.position.set(0, 0.025, -0.5);
            laptop.add(lid);

            const screen = new THREE.Mesh(
                new THREE.BoxGeometry(1.4, 0.9, 0.04),
                matSilver,
            );
            screen.position.set(0, 0.45, 0);
            screen.castShadow = true;
            lid.add(screen);

            const display = new THREE.Mesh(
                new THREE.PlaneGeometry(1.3, 0.8),
                matScreen,
            );
            display.position.set(0, 0.45, 0.021);
            lid.add(display);

            // Logo
            const logo = new THREE.Mesh(
                new THREE.CircleGeometry(0.12, 32),
                new THREE.MeshBasicMaterial({ color: 0xe85d3b }),
            );
            logo.position.set(0, 0.45, -0.021);
            logo.rotation.y = Math.PI;
            lid.add(logo);

            // Open lid
            lid.rotation.x = 0.2;
        }

        // --- Loop ---
        function animate() {
            frameId = requestAnimationFrame(animate);
            const t = Date.now() * 0.001;

            if (characterGroup.userData) {
                const { head, lFore, rFore } = characterGroup.userData;

                // Subtle Life-like sway
                head.rotation.y = Math.sin(t * 0.3) * 0.1;
                head.rotation.z = Math.sin(t * 0.5) * 0.03;

                // Typing
                if (lFore) lFore.rotation.x = -1.8 + Math.sin(t * 12) * 0.06;
                if (rFore) rFore.rotation.x = -1.8 + Math.cos(t * 12) * 0.06;
            }

            renderer.render(scene, camera);
        }

        function handleResize() {
            if (!canvas) return;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    });

    onDestroy(() => {
        if (typeof window !== "undefined") {
            window.removeEventListener("resize", () => {}); // cleanup listener
            cancelAnimationFrame(frameId);
            renderer?.dispose();
        }
    });
</script>

<div class="scene-wrapper">
    <canvas bind:this={canvas} class="webgl-canvas"></canvas>
</div>

<style>
    .scene-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
    }

    .webgl-canvas {
        width: 100%;
        height: 100%;
        display: block;
        outline: none;
    }
</style>

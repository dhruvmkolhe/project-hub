<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import * as THREE from "three";
    import { OrbitControls } from "three/addons/controls/OrbitControls.js";

    let canvas: HTMLCanvasElement;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let controls: OrbitControls;
    let frameId: number;

    // Color Palette - Flat vector art style
    const COLORS = {
        skin: 0xffcdb3,
        shirt: 0x6e56cf,
        hair: 0x1a1a1a,
        headphones: 0xffffff,
        laptop_body: 0xc4c4c4,
        laptop_screen: 0x1a1a2e,
        laptop_glow: 0x4cc9f0,
        monitor_frame: 0x2a2a2a,
        monitor_screen: 0x0f0f0f,
        monitor_glow: 0xe85d3b,
        cable: 0x444444,
        desk: 0x1e1e1e,
        chair: 0x333333,
    };

    onMount(() => {
        if (!canvas) return;

        initScene();
        createScene();
        animate();

        window.addEventListener("resize", handleResize);
    });

    function initScene() {
        scene = new THREE.Scene();

        // Perspective Camera - Over the shoulder view
        camera = new THREE.PerspectiveCamera(
            50,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            100,
        );
        camera.position.set(0, 2.5, 6.3); // Further back to fit everything

        renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.minDistance = 2;
        controls.maxDistance = 8;
        controls.target.set(0, 0.8, 0); // Look at desk center
        controls.autoRotate = false;
        controls.autoRotateSpeed = 1.0;

        // Lighting
        const ambient = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambient);

        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(2, 5, 2); // Sunlight from top-right
        scene.add(mainLight);

        const screenLight = new THREE.PointLight(0x4cc9f0, 2, 5);
        screenLight.position.set(0, 1, 0); // Glow from screens
        scene.add(screenLight);
    }

    function createScene() {
        const worldGroup = new THREE.Group();

        createDesk(worldGroup);
        createChair(worldGroup);
        createCharacter(worldGroup);
        createLaptop(worldGroup);
        createMonitor(worldGroup);
        createHDMICable(worldGroup);

        // New Props to fill space
        createPlant(worldGroup);
        createBooks(worldGroup);
        createMug(worldGroup);

        scene.add(worldGroup);
    }

    // ... (Existing Desk/Char functions remain) ...

    function createPlant(parent: THREE.Group) {
        const potMat = new THREE.MeshToonMaterial({ color: 0xffffff }); // White pot
        const leafMat = new THREE.MeshToonMaterial({ color: 0x4ade80 }); // Green

        const plantGroup = new THREE.Group();
        plantGroup.position.set(-1.5, 0.75, -0.2); // Left side of desk
        parent.add(plantGroup);

        // Pot
        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.1, 0.25, 16),
            potMat,
        );
        pot.position.y = 0.125;
        plantGroup.add(pot);

        // Leaves
        for (let i = 0; i < 5; i++) {
            const leaf = new THREE.Mesh(
                new THREE.SphereGeometry(0.12, 16, 16),
                leafMat,
            );
            leaf.position.set(
                (Math.random() - 0.5) * 0.2,
                0.3 + Math.random() * 0.2,
                (Math.random() - 0.5) * 0.2,
            );
            leaf.scale.set(0.5, 1, 0.5);
            plantGroup.add(leaf);
        }
    }

    function createBooks(parent: THREE.Group) {
        const colors = [0xe85d3b, 0x6e56cf, 0x3b82f6]; // Accent colors

        const booksGroup = new THREE.Group();
        booksGroup.position.set(1.5, 0.75, -0.4); // Right side
        booksGroup.rotation.y = -0.2;
        parent.add(booksGroup);

        colors.forEach((col, i) => {
            const book = new THREE.Mesh(
                new THREE.BoxGeometry(0.4, 0.08, 0.5),
                new THREE.MeshToonMaterial({ color: col }),
            );
            book.position.y = 0.04 + i * 0.08;
            // Stack untidily
            book.rotation.y = (Math.random() - 0.5) * 0.2;
            booksGroup.add(book);
        });
    }

    function createMug(parent: THREE.Group) {
        const matMug = new THREE.MeshToonMaterial({ color: 0xffffff });
        const matCoffee = new THREE.MeshBasicMaterial({ color: 0x3f2e27 });

        const mugGroup = new THREE.Group();
        mugGroup.position.set(1.2, 0.75, 0.4); // Right side, closer
        parent.add(mugGroup);

        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16),
            matMug,
        );
        body.position.y = 0.1;
        mugGroup.add(body);

        const coffee = new THREE.Mesh(
            new THREE.CircleGeometry(0.09, 16),
            matCoffee,
        );
        coffee.rotation.x = -Math.PI / 2;
        coffee.position.y = 0.18;
        mugGroup.add(coffee);

        const handle = new THREE.Mesh(
            new THREE.TorusGeometry(0.06, 0.015, 8, 16),
            matMug,
        );
        handle.position.set(0.1, 0.1, 0);
        handle.rotation.z = Math.PI / 2;
        mugGroup.add(handle);
    }

    function createDesk(parent: THREE.Group) {
        const matDesk = new THREE.MeshToonMaterial({ color: COLORS.desk });

        // Desk centered at 0,0,0
        const deskTop = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.1, 1.8),
            matDesk,
        );
        deskTop.position.set(0, 0.7, 0);
        parent.add(deskTop);

        const legGeo = new THREE.BoxGeometry(0.1, 0.7, 0.1);
        const positions = [
            [-1.9, 0.35, -0.8],
            [1.9, 0.35, -0.8],
            [-1.9, 0.35, 0.8],
            [1.9, 0.35, 0.8],
        ];
        positions.forEach((pos) => {
            const leg = new THREE.Mesh(legGeo, matDesk);
            leg.position.set(pos[0], pos[1], pos[2]);
            parent.add(leg);
        });
    }

    function createChair(parent: THREE.Group) {
        const matChair = new THREE.MeshToonMaterial({ color: COLORS.chair });

        // Chair behind desk (Positive Z)
        const seat = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.1, 0.8),
            matChair,
        );
        seat.position.set(0, 0.45, 1.5);
        parent.add(seat);

        const back = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.9, 0.1),
            matChair,
        );
        back.position.set(0, 0.9, 1.9); // Back of chair
        parent.add(back);
    }

    function createCharacter(parent: THREE.Group) {
        const matSkin = new THREE.MeshToonMaterial({ color: COLORS.skin });
        const matShirt = new THREE.MeshToonMaterial({ color: COLORS.shirt });
        const matHair = new THREE.MeshToonMaterial({ color: COLORS.hair });
        const matHeadphones = new THREE.MeshToonMaterial({
            color: COLORS.headphones,
        });
        const matEye = new THREE.MeshBasicMaterial({ color: 0x1a1a1a }); // Dark eyes
        const matGlasses = new THREE.MeshToonMaterial({ color: 0x333333 });

        const charGroup = new THREE.Group();
        charGroup.position.set(0, 0.5, 1.5); // Sitting in chair

        // Body
        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.4, 0.7, 32),
            matShirt,
        );
        body.position.set(0, 0.35, 0);
        charGroup.add(body);

        // --- HEAD GROUP ---
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 0.9, 0);
        charGroup.add(headGroup);

        // 1. Head (Sphere) - Chibi Style
        const headGeo = new THREE.SphereGeometry(0.35, 64, 64);
        const head = new THREE.Mesh(headGeo, matSkin);
        headGroup.add(head);

        // 2. Face Features
        const eyeGeo = new THREE.SphereGeometry(0.04, 32, 32);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });

        const eyeL = new THREE.Mesh(eyeGeo, eyeMaterial);
        // Face is towards -Z in charGroup local space?
        // In RegisterScene eyes were at Z=0.43 (positive).
        // Here our char faces +Z in the new rotation setup?
        // Let's check rotation. Character is at (0, 0.5, 1.5).
        // If we want it to face the desk (Z=0), it must face -Z.
        // So eyes should be at -Z offsets.
        eyeL.position.set(-0.12, 0.02, -0.32);
        headGroup.add(eyeL);

        const eyeR = eyeL.clone();
        eyeR.position.set(0.12, 0.02, -0.32);
        headGroup.add(eyeR);

        // Nose
        const nose = new THREE.Mesh(
            new THREE.SphereGeometry(0.03, 32, 32),
            matSkin,
        );
        nose.position.set(0, -0.06, -0.34);
        headGroup.add(nose);

        // 3. Hair (Bubble Cloud)
        const hairGroup = new THREE.Group();
        // Hair mainly on back (+Z) and top
        headGroup.add(hairGroup);

        const hairPositions = [
            { x: 0, y: 0.28, z: 0, s: 0.28 }, // Top Center
            { x: -0.22, y: 0.22, z: 0.1, s: 0.22 }, // Top Left
            { x: 0.22, y: 0.22, z: 0.1, s: 0.22 }, // Top Right
            { x: 0, y: 0.25, z: 0.2, s: 0.25 }, // Back Top
            { x: -0.3, y: 0, z: 0.1, s: 0.18 }, // Side L
            { x: 0.3, y: 0, z: 0.1, s: 0.18 }, // Side R
            { x: 0, y: 0, z: 0.3, s: 0.25 }, // Back Low
        ];

        hairPositions.forEach((pos) => {
            const puff = new THREE.Mesh(
                new THREE.SphereGeometry(pos.s, 32, 32),
                matHair,
            );
            puff.position.set(pos.x, pos.y, pos.z);
            puff.rotation.set(Math.random(), Math.random(), Math.random());
            headGroup.add(puff);
        });

        // 4. Headphones
        const bandNode = new THREE.Group();
        headGroup.add(bandNode);

        const band = new THREE.Mesh(
            new THREE.TorusGeometry(0.42, 0.04, 16, 64, Math.PI + 0.6),
            matHeadphones,
        );
        band.rotation.x = 0.15; // Tilted slightly
        bandNode.add(band);

        const cupGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32);
        cupGeo.rotateZ(Math.PI / 2);

        const earL = new THREE.Mesh(cupGeo, matHeadphones);
        earL.position.set(-0.42, -0.05, 0);
        bandNode.add(earL);

        const earR = earL.clone();
        earR.position.set(0.42, -0.05, 0);
        bandNode.add(earR);

        // Arms - reaching forward (Negative Z)
        const armGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.5, 16);

        const leftArm = new THREE.Mesh(armGeo, matShirt);
        leftArm.position.set(-0.4, 0.3, 0.1);
        leftArm.rotation.x = -0.5;
        charGroup.add(leftArm);

        const leftFore = new THREE.Mesh(armGeo, matSkin);
        leftFore.position.set(-0.45, 0.2, -0.4); // Forward
        leftFore.rotation.x = -1.6; // Flat
        leftFore.rotation.z = 0.3;
        charGroup.add(leftFore);

        const rightArm = new THREE.Mesh(armGeo, matShirt);
        rightArm.position.set(0.4, 0.3, 0.1);
        rightArm.rotation.x = -0.5;
        charGroup.add(rightArm);

        const rightFore = new THREE.Mesh(armGeo, matSkin);
        rightFore.position.set(0.45, 0.2, -0.4);
        rightFore.rotation.x = -1.6;
        rightFore.rotation.z = -0.3;
        charGroup.add(rightFore);

        parent.add(charGroup);
    }

    function createLaptop(parent: THREE.Group) {
        const matBody = new THREE.MeshToonMaterial({
            color: COLORS.laptop_body,
        });
        const matScreen = new THREE.MeshBasicMaterial({
            color: COLORS.laptop_screen,
        });

        const laptopGroup = new THREE.Group();
        // On desk, left side
        laptopGroup.position.set(-0.7, 0.75, 0.2);
        // Rotation: 0 is facing +Z (towards char). That's what we want!

        // Base
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.03, 0.6),
            matBody,
        );
        laptopGroup.add(base);

        // Screen (Lid)
        const lidGroup = new THREE.Group();
        lidGroup.position.set(0, 0.015, -0.3); // Back hinge
        lidGroup.rotation.x = 0.3; // Open up (positive X rotates back towards -Z)
        // Wait, if facing +Z, mesh is oriented... let's test.
        // If box is facing +Z, 'back' is -Z. Hinge at -0.3.
        // Opens 'up', so rotate towards -Z.
        laptopGroup.add(lidGroup);

        const lid = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.6, 0.02),
            matBody,
        );
        lid.position.set(0, 0.3, 0);
        lidGroup.add(lid);

        const screen = new THREE.Mesh(
            new THREE.PlaneGeometry(0.7, 0.5),
            matScreen,
        );
        screen.position.set(0, 0.3, 0.011); // Front of lid (+Z side)
        lidGroup.add(screen);

        const glowMat = new THREE.MeshBasicMaterial({
            color: COLORS.laptop_glow,
        });
        for (let i = 0; i < 5; i++) {
            const line = new THREE.Mesh(
                new THREE.PlaneGeometry(0.6 - i * 0.05, 0.02),
                glowMat,
            );
            line.position.set(0, 0.45 - i * 0.08, 0.012);
            lidGroup.add(line);
        }

        parent.add(laptopGroup);
    }

    function createMonitor(parent: THREE.Group) {
        const matFrame = new THREE.MeshToonMaterial({
            color: COLORS.monitor_frame,
        });
        const matScreen = new THREE.MeshBasicMaterial({
            color: COLORS.monitor_screen,
        });

        const monitorGroup = new THREE.Group();
        monitorGroup.position.set(0.8, 0.75, 0.1);
        monitorGroup.rotation.y = -0.3; // Angle towards char

        const standBase = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.03, 0.3),
            matFrame,
        );
        monitorGroup.add(standBase);

        const standNeck = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 0.3, 0.08),
            matFrame,
        );
        standNeck.position.y = 0.15;
        monitorGroup.add(standNeck);

        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.8, 0.05),
            matFrame,
        );
        frame.position.y = 0.55;
        monitorGroup.add(frame);

        const screen = new THREE.Mesh(
            new THREE.PlaneGeometry(1.1, 0.7),
            matScreen,
        );
        screen.position.set(0, 0.55, 0.03); // Facing +Z
        monitorGroup.add(screen);

        const glowMat = new THREE.MeshBasicMaterial({
            color: COLORS.monitor_glow,
        });
        for (let i = 0; i < 6; i++) {
            const line = new THREE.Mesh(
                new THREE.PlaneGeometry(0.9 - i * 0.08, 0.02),
                glowMat,
            );
            line.position.set(0, 0.8 - i * 0.09, 0.031);
            monitorGroup.add(line);
        }

        parent.add(monitorGroup);
    }

    function createHDMICable(parent: THREE.Group) {
        const matCable = new THREE.MeshBasicMaterial({ color: COLORS.cable });

        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.25, 0.77, 1.4),
            new THREE.Vector3(0.1, 0.76, 1.5),
            new THREE.Vector3(0.4, 0.76, 1.55),
            new THREE.Vector3(0.6, 0.8, 1.58),
        ]);

        const cableGeo = new THREE.TubeGeometry(curve, 20, 0.012, 8, false);
        const cable = new THREE.Mesh(cableGeo, matCable);
        parent.add(cable);
    }

    function animate() {
        frameId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    function handleResize() {
        if (!canvas || !camera || !renderer) return;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }

    onDestroy(() => {
        if (typeof window !== "undefined") {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(frameId);
            controls?.dispose();
            renderer?.dispose();
        }
    });
</script>

<div class="scene-wrapper">
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .scene-wrapper {
        width: 100%;
        height: 100%;
        min-height: 400px;
        position: relative; /* For absolute children */
    }
    canvas {
        width: 100%;
        height: 100%;
        display: block;
        cursor: grab;
    }
    canvas:active {
        cursor: grabbing;
    }
</style>

import { RenderState } from "./RenderState.ts";
import { updateBuffers } from "./systems/BufferUpdateSystem.ts";
import { prepareRendering } from "./systems/PrepareRenderSystem.ts";
import { render } from "./systems/RenderSystem.ts";
import { computeTransforms } from "./systems/TransformSystem.ts";
import { animate as animateScene, playAnimation } from "./systems/AnimationSystem.ts";
import { createBuffers } from "./systems/BufferInitSystem.ts";
import { GLTFParser } from "./parsers/GLTFParser.ts";
import { Camera } from "./components/Camera.ts";
import { computeSkins } from "./systems/SkinningSystem.ts";
import { KeyframeAnimations } from "./components/KeyframeAnimation.ts";
import { createLevel } from "./Level.ts";
import { Input } from "./Input.ts";
import { movePlayer } from "./systems/PlayerControlSystem.ts";
import { updateCollisions } from "./systems/CollisionSystem.ts";
import { PlayerController } from "./components/PlayerControl.ts";
import { applyGravity } from "./systems/GravitySystem.ts";


// ------ Create sample scene ------ //

const scene = await createLevel();


// ------ Initalize GPU/Rendering specific interfaces ------ //

if (!navigator.gpu) {
    throw Error("WebGPU not supported in this browser!");
}
const gpuAdapter = await navigator.gpu.requestAdapter();
if (!gpuAdapter) {
    throw Error("Could not get WebGPU adapter!");
}
const gpuDevice = await gpuAdapter.requestDevice();
gpuDevice.addEventListener('uncapturederror', (e) => console.error(e.error.message));
gpuDevice.lost.then((v) => {
    console.error(`GPU device lost: ${v.message} (${v.reason})`);
});

const canvas = document.querySelector('canvas');
if (!canvas) {
    throw Error("Could not find a canvas!");
}
const renderState = new RenderState(gpuDevice, canvas);


// ------ Create and write all buffers ------ //

createBuffers(renderState, scene);


// ------ Prepare pipelines ------ //

await prepareRendering(renderState, scene);


// ------ Events ------ //

function resize() {
    if (!canvas) {
        return;
    }
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    if (width === 0 || height === 0) {
        width = 1;
        height = 1;
    }

    let aspect = width / height;

    // Update the camera
    const cameraEntities = scene?.getEntitiesByComponent(Camera) ?? [];
    for (const cameraEntity of cameraEntities) {
        const camera = cameraEntity.getComponent(Camera)!;
        camera.aspect = aspect;
    }
    // Update the rendering textures
    renderState.updateRenderTextureSizes(width, height);
}

window.addEventListener('resize', (_) => resize());
resize();

const player = scene.getEntitiesByComponent(PlayerController)[0];
if (!player) throw Error("ups");

const input = new Input(); // for mouse reset

// ------ Start game loop ------ //

let lastTime = performance.now();
function update(timestamp: number) {
    if (!scene) {
        return;
    }

    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    movePlayer(scene, input, dt);
    applyGravity(player, dt);
    animateScene(scene, dt);
    computeTransforms(scene);
    updateCollisions(scene, player);
    computeTransforms(scene);
    computeSkins(scene);
    updateBuffers(renderState, scene);
    render(renderState, scene);

    input.mouseReset(); // in case we use the mouse movements, this ensures that it restes every frame
    requestAnimationFrame(update);
}

requestAnimationFrame(update);
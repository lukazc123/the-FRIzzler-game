import { vec3, vec4 } from "gl-matrix"
import { Camera } from "./components/Camera.ts"
import { Transform, TransformType } from "./components/Transform.ts";
import { Entity } from "./Entity.ts";
import { Scene } from "./Scene.ts";
import { createCube } from "./Utils.ts";
import { PlayerController } from "./components/PlayerControl.ts";

const ARENA = 50;


async function addWall(scene: Scene, name: string, x: number, z: number, halfX: number, halfZ: number) {
    const wall = await createCube(vec4.fromValues(0.5, 0.5, 0.5, 1));
    wall.name = name;
    const t = wall.getComponent(Transform)!;
    t.location = vec3.fromValues(x, 0.5, z);
    t.scale = vec3.fromValues(halfX, 0.5, halfZ);
    scene.addEntity(wall);
}

export async function createLevel(): Promise<Scene> {
    const scene = new Scene();

    // ground
    const ground = await createCube(vec4.fromValues(0.3, 0.6, 0.3, 1));
    ground.name = "Ground";
    const gt = ground.getComponent(Transform)!;
    gt.scale = vec3.fromValues(ARENA, 0.05, ARENA);
    gt.location = vec3.fromValues(0, -0.05, 0);
    scene.addEntity(ground);

    // walls
    await addWall(scene, 'WallNorth', 0, -(ARENA + 0.5), ARENA + 1, 0.5);
    await addWall(scene, 'WallSouth', 0, (ARENA + 0.5), ARENA + 1, 0.5);
    await addWall(scene, 'WallWest', -(ARENA + 0.5), 0, 0.5, ARENA);
    await addWall(scene, 'WallEast', (ARENA + 0.5), 0, 0.5, ARENA);

    // player
    const player = await createCube(vec4.fromValues(0.9, 0.2, 0.2, 1));
    player.name = "Player";
    const pt = player.getComponent(Transform)!;
    pt.scale = vec3.fromValues(0.5, 0.5, 0.5);
    pt.location = vec3.fromValues(0, 0.5, 0);
    player.addComponent(new PlayerController(8, 0.003)); 
    scene.addEntity(player);

    // top down camera
    const cameraEntity = new Entity();
    cameraEntity.name = "Camera";
    const camera = new Camera(1, Math.PI / 3, 0.1, 100);
    camera.setOrthographic(18)

    const pitch = (35 * Math.PI) / 180;
    const dist = 30;

    const ct = new Transform(TransformType.LookAt);
    ct.location = vec3.fromValues(0, dist * Math.sin(pitch), dist * Math.cos(pitch));
    ct.target = vec3.fromValues(0, 0, 0);
    ct.up = vec3.fromValues(0, 1, 0)

    cameraEntity.addComponent(camera);
    cameraEntity.addComponent(ct);
    scene.addEntity(cameraEntity);

    return scene
}
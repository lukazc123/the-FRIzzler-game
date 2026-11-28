import { quat, vec3 } from "gl-matrix";
import { PlayerController } from "../components/PlayerControl.ts";
import { Transform } from "../components/Transform.ts";
import { Input } from "../Input.ts";
import { Scene } from "../Scene.ts";

export function movePlayer(scene: Scene, input: Input, dt: number) {
    const players = scene.getEntitiesByComponent(PlayerController);

    for (const player of players) {
        const controller = player.getComponent(PlayerController);
        const transform = player.getComponent(Transform);

        if (!controller || !transform) continue;

        const moveDir = vec3.create();

        if (input.pressedKey("KeyW") || input.pressedKey("ArrowUp")) { moveDir[2] -= 1;}
        if (input.pressedKey("KeyS") || input.pressedKey("ArrowDown")) { moveDir[2] += 1; }
        if (input.pressedKey("KeyA") || input.pressedKey("ArrowLeft")) { moveDir[0] -= 1; }
        if (input.pressedKey("KeyD") || input.pressedKey("ArrowRight")) { moveDir[0] += 1; }
        // space za skoct ampak sam ce je player na tleh
        if (input.pressedKey("Space") && controller.grounded){
            controller.velocity = controller.jumpSpeed;
            controller.grounded = false;
        }

        if (vec3.length(moveDir) > 0) {
            vec3.normalize(moveDir, moveDir);

            const nextLoc = vec3.clone(transform.location);
            nextLoc[0] += moveDir[0] * controller.speed * dt;
            nextLoc[2] += moveDir[2] * controller.speed * dt;

            transform.location = nextLoc;
        }
    }
}
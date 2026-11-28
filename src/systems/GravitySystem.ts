import { quat, vec3 } from "gl-matrix";
import { Transform } from "../components/Transform.ts";
import { PlayerController } from "../components/PlayerControl.ts";
import type { Entity } from "../Entity.ts";

export function applyGravity(player: Entity, time: number) {
    const p = player.getComponent(PlayerController)!;
    const t = player.getComponent(Transform)!;

    // sam gravitacijo das playerju
    p.velocity -= p.gravity * time;
    t.location[1] += p.velocity * time;
}
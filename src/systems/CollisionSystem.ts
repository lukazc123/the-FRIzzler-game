import type { Scene } from "../Scene.ts";
import type { Entity } from "../Entity.ts";
import { Transform } from "../components/Transform.ts";
import { mat4, vec3 } from "gl-matrix";
import { BoxCollider, SphereCollider, InteractionBubble } from "../components/Collider.ts";
import { PlayerController } from "../components/PlayerControl.ts";


export function getGroundHeight(x: number, z: number){
    // tla.... ce ne bojo ravna tla se spremeni to
    return 0;
}

export function snapToGround(player: Entity){
    const t = player.getComponent(Transform)!;
    const c = player.getComponent(SphereCollider)!;
    const controller = player.getComponent(PlayerController)!;
    const height = c.height;
    const location = t.location;

    // ce je lokacija playerja pod tlemi ga postavs nazaj na tla pa mu das
    // velocity 0 pa grounded = true
    if(location[1] < getGroundHeight(location[0], location[2]) + height){
        location[1] = getGroundHeight(location[0], location[2]) + height;
        controller.velocity = 0;
        controller.grounded = true;
    }
    t.location = location;
}
export function Collision(player: Entity, scene: Scene){
    const t = player.getComponent(Transform)!;
    const c = player.getComponent(SphereCollider)!;
    const radius = c.radius;
    const location = t.location;
    const height = c.height;

    // koordinate playerja
    let px = location[0];
    let py = location[1];
    let pz = location[2];

    // zgornja pa spodna tocka playerja (odvisn tut od tega kako bojo modeli centrirani)
    const pbot = py - height;
    const ptop = py + height;

    // vsi objekti k majo škatlast collider
    const boxes = scene.getEntitiesByComponent(BoxCollider);
    
    // 3x loop za prevert ce bi slucajn collision te v nek drug objekt spravu
    for(let i = 0; i < 3; i++){
        for(const box of boxes){
            const bt = box.getComponent(Transform)!;
            const bc = box.getComponent(BoxCollider)!;

            const world = bt.worldMatrix;
            const position = mat4.getTranslation(vec3.create(), world);
            const scale = mat4.getScaling(vec3.create(), world);

            //centri pa razdalje do robov škatl za vsako koordinato (popravlene glede na skaliranje/translacijo)
            const box_center_x = position[0] + bc.offset[0] * scale[0];
            const box_center_y = position[1] + bc.offset[1] * scale[1];
            const box_center_z = position[2] + bc.offset[2] * scale[2];
            const box_half_x = bc.half[0] * scale[0];
            const box_half_y = bc.half[1] * scale[1];
            const box_half_z = bc.half[2] * scale[2];

            //zgorna pa spodna tocka skatle
            const bbot = box_center_y - box_half_y;
            const btop = box_center_y + box_half_y;

            // ce je playerjeva glava nizje k spodnji del skatle ne pregledujemo collisiona isto ce so playerjeve noge nad zgornjim delom skatle
            if(ptop <= bbot || pbot >= btop){
                continue;
            }

            // robovi po x pa z
            const minX = box_center_x - box_half_x;
            const maxX = box_center_x + box_half_x;
            const minZ = box_center_z - box_half_z;
            const maxZ = box_center_z + box_half_z;

            //poiscemo najblizje tocke x pa z do playerja
            const closestX = Math.max(minX, Math.min(px, maxX));
            const closestZ = Math.max(minZ, Math.min(pz, maxZ));

            // razdalja po x pa z od playerja do škatle pa kvadratna razdalja
            const dx = px - closestX;
            const dz = pz - closestZ;
            const distance = dx*dx + dz*dz;

            // ce kvadratna razdalja ni v collision krogcu okul playerja gremo naprej
            if(distance >= radius * radius){
                continue;
            }
            // distance > 1e-6 ker ce delis z neki ful mejhnga dobis ful prevelk premik 
            if(distance > 1e-6){
                const d = Math.sqrt(distance);
                const move = (radius - d) / d;

                px += dx * move;
                pz += dz * move;
            }
        }
    }
    //posodobljene vrednosti
    location[0] = px;
    location[2] = pz;
    t.location = location;

}

// prakticno kopija zgornga dela
export function detectInteractions(player: Entity, scene: Scene){
    const t = player.getComponent(Transform)!;
    const c = player.getComponent(SphereCollider)!;
    const radius = c.radius;
    const location = t.location;
    const height = c.height;

    let px = location[0];
    let py = location[1];
    let pz = location[2];

    const pbot = py - height;
    const ptop = py + height;

    let closest: Entity | null = null;
    let closestDistance = Infinity;

    const bubbles = scene.getEntitiesByComponent(InteractionBubble);

    for (const bubble of bubbles){
        const bt = bubble.getComponent(Transform)!;
        const ib = bubble.getComponent(InteractionBubble)!;

        const world = bt.worldMatrix;
        const position = mat4.getTranslation(vec3.create(), world);
        const scale = mat4.getScaling(vec3.create(), world);

        const bubble_radius = ib.radius * Math.max(scale[0], scale[1], scale[2]);

        const bbot = position[1] - bubble_radius;
        const btop = position[1] + bubble_radius;

        if(ptop <= bbot || pbot >= btop){
            continue;
        }

        const dx = px - position[0];
        const dz = pz - position[0];
        const distance = dx*dx + dz*dz;

        if(distance >= (bubble_radius + radius) * (bubble_radius + radius)){
            continue;
        }
        if(distance < closestDistance){
            closestDistance = distance;
            closest = bubble;
        }
    }

    return closest
}

export function updateCollisions(scene: Scene, player: Entity){
    Collision(player, scene);
    snapToGround(player);
    // v main je po tej funkciji treba se klicat detectInteractions(), da dobis popup za interaction
}
import { vec3 } from "gl-matrix";
import type { Component } from "../Component.ts";

type collide = "player" | "npc" | "world" | "interaction";

//okrogel collider predvideno za playerja / NPC-je
export class SphereCollider implements Component{
    radius: number;
    object: collide;
    detect: collide[];
    height: number;
    constructor(radius: number, object: collide, detect: collide[], height: number){
        this.radius = radius;
        this.object = object;
        this.detect = detect;
        this.height = height;
    }
}

//škatlast collider predvideno objekte k niso player / NPC-ji
export class BoxCollider implements Component {
    half: vec3;
    object: collide;
    detect: collide[];
    offset: vec3;
    constructor(half: vec3, object: collide, detect: collide[], offset: vec3){
        this.half = half;
        this.object = object;
        this.detect = detect;
        this.offset = offset;
    }
}

//isto krog sam da te ne potisne vn ampak ti ponud pogovor z NPC-jem
export class InteractionBubble implements Component {
    radius: number;
    object: collide;
    detect: collide[];
    constructor(radius: number, object: collide, detect: collide[]){
        this.radius = radius;
        this.object = object;
        this.detect = detect;
    }
}
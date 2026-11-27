import type { Component } from "../Component.ts";

export class PlayerController implements Component {
    speed: number;
    jumpSpeed: number;
    velocity: number;
    gravity: number;
    grounded: boolean;
    sensitivity: number;

    constructor(speed = 5, jumpSpeed = 9, velocity = 0, gravity = 20, grounded = true, sensitivity = 0.003) {
        this.speed = speed;
        this.jumpSpeed = jumpSpeed;
        this.velocity = velocity;
        this.gravity = gravity;
        this.grounded = grounded;
        this.sensitivity = sensitivity;
    }
}
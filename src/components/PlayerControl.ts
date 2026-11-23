import type { Component } from "../Component.ts";

export class PlayerController implements Component {
    speed: number;
    sensitivity: number;

    constructor(speed = 5, sensitivity = 0.003) {
        this.speed = speed;
        this.sensitivity = sensitivity;
    }
}
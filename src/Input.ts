export class Input {
    private keys = new Set<string>();
    private mouseDX = 0;
    private mouseDY = 0;

    constructor() {
        window.addEventListener("keydown", (event: KeyboardEvent) => this.keys.add(event.code));
        window.addEventListener("keyup", (event: KeyboardEvent) => this.keys.delete(event.code));
        window.addEventListener("blur", (event: FocusEvent) => this.keys.clear());
        window.addEventListener("mousemove", (e: MouseEvent) => {
            this.mouseDX += e.movementX;
            this.mouseDY += e.movementY;
        });
    }

    pressedKey(key: string){ return this.keys.has(key)}

    mouseMove(){ return [this.mouseDX, this.mouseDY]; }

    mouseReset(){
        this.mouseDX = 0;
        this.mouseDY = 0;
    }


}
import { detectInteractions } from "./CollisionSystem.ts";
import { Entity } from "../Entity.ts";
import type { Scene } from "../Scene.ts";

const interactButton = document.getElementById("interact") as HTMLButtonElement;

let target: Entity | null = null;

function interact() {
    if(!target){
        return;
    }
    console.log('Interacting');
    //ta console.log pol spremenimo na neki da se pojav dialog
}

//cekiranje ce prtisnes tipko
window.addEventListener('keydown', (e) => {
    //ce tiscis tipko se se zmer sam enkat izvede
    if(e.repeat){
        return;
    }
    // ce je tipka bla E pol klices interact()
    if(e.code === "KeyE"){
        interact();
    }
});

// resolva prtisk tipke
interactButton.addEventListener('click', () => {
    interact();
    // blur() je da ce prtisnes SPACE po interactu da se ne klice se enkat
    interactButton.blur();
});

export function handleInteraction(player: Entity, scene: Scene) {
    //poisce najblizji interaction bubble pa ga shran v target
    target = detectInteractions(player, scene);
    //ce je kir npc v okolici se gumb pokaze ce ne se skrije
    if(target){
        interactButton.hidden = false;
    } else {
        interactButton.hidden = true;
    }
}
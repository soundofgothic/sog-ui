import {Component, Input} from '@angular/core';

@Component({
    selector: 'play-button',
    templateUrl: './play-button.component.html',
    styleUrls: ['./play-button.component.css']
})
export class PlayButtonComponent {
    toggleClass: string = ""

    @Input() soundUrl: string;

    npc: string = "Diego"
    voiceActor: string = "Piotr Kozłowski"

    toggle() {
        this.toggleClass = this.toggleClass === "" ? "paused" : "";
    }

    
}
import {Component,Input} from "@angular/core";
@Component({
    selector: "scoreboard",
    template: require('../assets/templates/scoreboard.html'),
    styles: [ require('../assets/css/style.css') ],
})

export class ScoreboardComponent {
    @Input()
        playerRatings:any;

    constructor() {

    }
}


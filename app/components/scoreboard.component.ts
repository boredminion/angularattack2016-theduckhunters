import {Component,Input} from "@angular/core";
@Component({
    selector: "scoreboard",
    template: require('../assets/templates/scoreboard.html')
})

export class ScoreboardComponent {
    @Input()
        playerRatings:any;

    constructor() {

    }
}


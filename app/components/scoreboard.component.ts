import {Component,Input} from "@angular/core";
@Component({
    selector: "scoreboard",
    templateUrl: "app/assets/templates/scoreboard.html",
    styleUrls: [
        "app/assets/css/style.css"
    ]
})

export class ScoreboardComponent {
    @Input()
        playerRatings:any;

    constructor() {

    }
}


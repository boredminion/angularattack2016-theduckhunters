import {Component} from '@angular/core';

//component
import {ScoreboardComponent} from "./scoreboard.component";
//socket
import {SocketService} from '../services/socket.service';
import {SocketEvents} from '../services/socket_events.enum';

@Component({
    selector: "duck-hunter",
    templateUrl: 'app/assets/templates/game.html',
    styleUrls: ['app/assets/css/style.css'],
    directives: [ScoreboardComponent],
    host: {'(window:keyup)': 'refreshPayload($event.keyCode)'}
})

export class GameComponent {
    playerRatings;
    private leftArrow: number = 37;
    private rightArrow: number = 39;
    private upArrow: number = 38;
    private downArrow: number = 40;

    private userInfo;
    private payloadGrid;
    private players;
    private angle:number = 0;
    private start:boolean = false;
    public playersArray = [];

    constructor(private socketService:SocketService) {

        this.socketService.getSocket().on(SocketEvents[SocketEvents.gameStateUpdate], (updatedInfo)=> {
            var changedPayload = updatedInfo.changesPayload;
            this.playerRatings = updatedInfo.playerRankings;
            console.log(this.playerRatings);
            for (var i = 0; i < changedPayload.length; i++) {
                var gridCoordinates = changedPayload[i].gridCoordinates;
                this.payloadGrid[gridCoordinates[0]][gridCoordinates[1]] = changedPayload[i].playerId;
            }
            this.playersArray = updatedInfo.playersArray;
        });
        this.socketService.getSocket().on(SocketEvents[SocketEvents.playerConnected], (playerList)=> {
            this.players = playerList;
        });

    }

    /**
     * Allows user to join the game
     */
    public joinGame() {
        this.socketService.getSocket().emit(SocketEvents[SocketEvents.joinGame], {}, (response)=> {
            this.start = true;
            this.payloadGrid = response.payloadGrid;
            this.userInfo = response.userInfo;
            this.players = response.players;
            console.log("user successfully joined");
        });
    }
    
    public refreshPayload(keyCode) {
        if (this.start) {
            switch (keyCode) {
                case this.leftArrow:
                    this.angle = 3;
                    this.updateSocket();
                    break;
                case this.rightArrow:
                    this.angle = 1;
                    this.updateSocket();
                    break;
                case this.upArrow:
                    this.angle = 0;
                    this.updateSocket();
                    break;
                case this.downArrow:
                    this.angle = 2;
                    this.updateSocket();
                    break;
                default:
                    break;
            }
        }
    }

    private updateSocket() {
        this.socketService.getSocket().emit(SocketEvents[SocketEvents.clientStateUpdate], {angle: this.angle}, (response)=> {
            this.payloadGrid = response.payloadGrid;
            console.log("user payload changed");
        });
    }

}

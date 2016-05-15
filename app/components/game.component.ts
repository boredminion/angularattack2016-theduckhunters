import {Component} from '@angular/core';

//component
import {ScoreboardComponent} from "./scoreboard.component";
//socket
import {SocketService} from '../services/socket.service';
import {SocketEvents} from '../services/socket_events.enum';

@Component({
    selector: "duck-hunter",
    template: require('../assets/templates/game.html'),
    directives: [ScoreboardComponent],
    host: {'(window:keyup)': 'refreshPayload($event.keyCode)'}
})

export class GameComponent {
    playerRatings;
    private leftArrow:number = 37;
    private rightArrow:number = 39;
    private upArrow:number = 38;
    private downArrow:number = 40;

    private userInfo;
    private payloadGrid;
    private players;
    private angle:number = 0;
    private start:boolean = false;
    public playersArray = [];
    public colors:string[];
    public color:string = null;

    constructor(private socketService:SocketService) {

        this.socketService.getSocket().on(SocketEvents[SocketEvents.gameStateUpdate], (updatedInfo)=> {
            var changedPayload = updatedInfo.changesPayload;
            this.playerRatings = updatedInfo.playerRankings;
            for (var i = 0; i < changedPayload.length; i++) {
                var gridCoordinates = changedPayload[i].gridCoordinates;
                this.payloadGrid[gridCoordinates[0]][gridCoordinates[1]] = changedPayload[i].playerId;
            }
            this.playersArray = updatedInfo.playersArray;
        });
        this.socketService.getSocket().on(SocketEvents[SocketEvents.playerConnected], (playerList)=> {
            this.players = playerList;
        });
        this.getColors();

    }

    /**
     * Allows user to join the game
     */
    public joinGame() {
        if (this.color) {
            this.socketService.getSocket().emit(SocketEvents[SocketEvents.joinGame], {
                color: this.color
            }, (response)=> {
                this.start = true;
                this.payloadGrid = response.payloadGrid;
                this.userInfo = response.userInfo;
                this.players = response.players;
                console.log("user successfully joined");
            });
        } else {
            alert("please select a color");
        }

    }

    public setColor(colorItem) {
        this.color = colorItem;
    }

    public isColorSelected(colorItem) {
        return colorItem === this.color;
    }

    public isGameStarted() {
        return typeof this.color !== undefined && this.color !== null && this.start;
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

    public getColors() {
        this.socketService.getSocket().emit(SocketEvents[SocketEvents.getColors], (colorList)=> {
            this.colors = colorList;
        })
    }

    private updateSocket() {
        this.socketService.getSocket().emit(SocketEvents[SocketEvents.clientStateUpdate], {angle: this.angle}, (response)=> {
            this.payloadGrid = response.payloadGrid;
            console.log("user payload changed");
        });
    }

}

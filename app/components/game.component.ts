import {Component} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {Modal} from "ng2-modal";
//component
import {ScoreboardComponent} from "./scoreboard.component";
//socket
import {SocketService} from '../services/socket.service';
import {SocketEvents} from '../services/socket_events.enum';

@Component({
    selector: "duck-hunter",
    template: require('../assets/templates/game.html'),
    directives: [ScoreboardComponent, Modal],
    styleUrls: [require('../assets/css/gameScreen.css')],
    host: {'(window:keyup)': 'refreshPayload($event.keyCode)'}
})

export class GameComponent {
    playerRatings;
    private leftArrow:number = 37;
    private rightArrow:number = 39;
    private upArrow:number = 38;
    private downArrow:number = 40;

    public userInfo = {};
    private payloadGrid;
    private players;
    private angle:number = 0;
    private start:boolean = false;
    public playersArray = [];
    public colors:string[];
    public color:string = null;
    public playerScore;
    public updateMessage:string;

    constructor(private socketService:SocketService, private router:Router) {
        this.socketService.getSocket().on(SocketEvents[SocketEvents.messageBroadcast], (message)=> {
            this.updateMessage = message;
        });

        this.socketService.getSocket().on(SocketEvents[SocketEvents.gameStateUpdate], (updatedInfo)=> {
            var changedPayload = updatedInfo.changesPayload;
            this.playerRatings = updatedInfo.playerRankings;
            this.playerScore = updatedInfo.playerScoreMap[this.userInfo["id"]];
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
                if(response) {
                    this.start = true;
                    this.payloadGrid = response.payloadGrid;
                    this.userInfo = response.userInfo;
                    this.players = response.players;
                } else {
                    alert("Apologies ! We are at maximum capacity currently. Please try again later.")
                }
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
            if (colorList)
                this.colors = colorList;
            else
                this.router.navigate(["Login"]);
        })
    }

    private updateSocket() {
        this.socketService.getSocket().emit(SocketEvents[SocketEvents.clientStateUpdate], {angle: this.angle}, (response)=> {
            this.payloadGrid = response.payloadGrid;
            console.log("user payload changed");
        });
    }

}

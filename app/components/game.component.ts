import {Component} from '@angular/core';

//socket
import {SocketService} from '../services/socket.service';
import {SocketEvents} from '../services/socket_events.enum';


//util
import {AngleUtil} from '../util/AngleUtil';

@Component({
    templateUrl: 'app/assets/templates/game.html',
    styleUrls: ['app/assets/css/style.css'],
    host: {'(window:keydown)': 'refreshPayload($event.keyCode)'}
})

export class GameComponent {

    private userInfo;
    private payloadGrid;
    private players;
    private angle:number = 0;
    private start:boolean = false;

    constructor(private socketService:SocketService) {
        this.socketService.getSocket().on(SocketEvents[SocketEvents.gameStateUpdate], (updatedInfo)=> {
            var changedPayload = updatedInfo.changesPayload;
            for (var i = 0; i < changedPayload.length; i++) {
                var gridCoordinates = changedPayload[i].gridCoordinates;
                this.payloadGrid[gridCoordinates[0]][gridCoordinates[1]] = changedPayload[i].playerId;
            }
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
            if (keyCode === 39) {
                this.angle = AngleUtil.increaseRotation(this.angle);
                this.updateSocket();
            }
            if (keyCode === 37) {
                this.angle = AngleUtil.decreaseRotation(this.angle);
                this.updateSocket();
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

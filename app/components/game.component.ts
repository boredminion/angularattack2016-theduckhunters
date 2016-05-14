import {Component} from '@angular/core';

//component
import {ScoreboardComponent} from "./scoreboard.component";
//socket
import {SocketService} from '../services/socket.service';
import {SocketEvents} from '../services/socket_events.enum';

@Component({
    templateUrl: 'app/assets/templates/game.html',
    styleUrls: ['app/assets/css/style.css'],
    directives: [ScoreboardComponent]
})

export class GameComponent {

    private userInfo;
    private payloadGrid;
    private players;
    playerRatings;

    constructor(private socketService:SocketService) {
        this.socketService.getSocket().on(SocketEvents[SocketEvents.gameStateUpdate], (updatedInfo)=> {
            var changedPayload = updatedInfo.changesPayload;
            this.playerRatings = updatedInfo.playerRankings;
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
            this.payloadGrid = response.payloadGrid;
            this.userInfo = response.userInfo;
            this.players = response.players;
            console.log("user successfully joined");
        });
    }

}

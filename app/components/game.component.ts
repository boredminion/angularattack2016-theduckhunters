import {Component} from '@angular/core';

//socket
import {SocketService} from '../services/socket.service';
import {SocketEvents} from '../services/socket_events.enum';

@Component({
    templateUrl: 'app/assets/templates/game.html',
    styleUrls: ['app/assets/css/style.css']
})

export class GameComponent {
    constructor(private socketService:SocketService) {
    }

    /**
     * Allows user to join the game
     */
    public joinGame() {
        this.socketService.getSocket().emit(SocketEvents[SocketEvents.joinGame], {}, this.onUserJoinGameSuccess());
    }

    /**
     * Callback when user successfully join the game
     */
    private onUserJoinGameSuccess() {
        console.log("user successfully joined");
    }
}

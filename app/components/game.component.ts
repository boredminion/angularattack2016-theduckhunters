import {Component,ChangeDetectionStrategy} from '@angular/core';

//socket
import {SocketService} from '../services/socket.service';
import {SocketEvents} from '../services/socket_events.enum';

@Component({
    templateUrl: 'app/assets/templates/game.html',
    styleUrls: ['app/assets/css/style.css'],
    changeDetection:ChangeDetectionStrategy.OnPush
})

export class GameComponent {

    private userInfo;
    private payloadGrid;
    private players;

    constructor(private socketService:SocketService) {
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

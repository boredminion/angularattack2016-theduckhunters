import {Component} from '@angular/core';
import {Router} from '@angular/router-deprecated';

//socket
import {SocketService} from '../services/socket.service';
import {SocketEvents} from '../services/socket_events.enum';

@Component({
    templateUrl: 'app/assets/templates/login.html',
    styleUrls: ['app/assets/css/style.css']
})

export class LoginComponent {
    constructor(private socketService:SocketService, private router:Router) {
    }

    /**
     * Logs the user in
     */
    public login() {

        this.socketService.getSocket().emit(SocketEvents[SocketEvents.login], {
            "name": "test"
        }, (playerInfo) => {
            this.router.navigate(['Game']);
            console.log(playerInfo, " login success");
        });

    }
}

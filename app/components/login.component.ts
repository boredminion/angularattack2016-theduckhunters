import {Component,Input} from '@angular/core';
import {Router} from '@angular/router-deprecated';

//socket
import {SocketService} from '../services/socket.service';
import {SocketEvents} from '../services/socket_events.enum';

@Component({
    selector: "login",
    templateUrl: 'app/assets/templates/login.html',
    styleUrls: ['app/assets/css/style.css']
})

export class LoginComponent {


    public username:string;
    public userPassword:string = null;
    playerFull:string;

    constructor(private socketService:SocketService, private router:Router) {
        this.socketService.getSocket().on(SocketEvents[SocketEvents.roomFull], ()=> {
            this.playerFull = "There are no empty seats available. Please try again Later!!!";
        });
    }

    /**
     * Logs the user in
     */
    public login() {
        this.socketService.getSocket().emit(SocketEvents[SocketEvents.login], {
            "usercode": (this.userPassword === null) ? "DH-KHj-Qv0Cya7agYwbazS" : this.userPassword,
            "name": this.username
        }, (playerInfo) => {
            this.router.navigate(['Game']);
            console.log(playerInfo, " login success");
        });

    }
}

import {Component} from '@angular/core';
import {SocketService} from '../services/socket.service';
import {SocketEvents} from '../services/socket_events.enum';
@Component({
    selector: "duck-hunter",
    template: `
        <h1>Duck Hunters</h1>
        <p>Play the game.!!!!</p>
        <a href="javascript:void(0)" (click)="login()">Login</a>
        <a href="javascript:void(0)" (click)="joinGame()">Join the Game</a>
    `,
    providers: [SocketService]
})
export class AppComponent {
    constructor(private socketService:SocketService) {

    }

    /**
     * Logs the user in
     */
    public login() {

        this.socketService.getSocket().emit(SocketEvents[SocketEvents.login], {
            "usercode": "DH-KHiuufeMWMO6PLxnFCY" // put some code here
        }, function (playerInfo) {
            console.log(playerInfo, " login success");
        });

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

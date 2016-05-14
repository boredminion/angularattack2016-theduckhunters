import {Component} from '@angular/core';

//router
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';

//socket
import {SocketService} from '../services/socket.service';
<<<<<<< HEAD
import {SocketEvents} from '../services/socket_events.enum';
=======

//components
import {LoginComponent} from './login.component';
import {GameComponent} from './game.component';

@Component({
    selector: "duck-hunter",
    template: `
        <h1>Duck Hunters</h1>
         <h2>You are about to enter duck hunters</h2>
        <router-outlet></router-outlet>
    `,
    styleUrls: ['app/assets/css/style.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [SocketService, ROUTER_PROVIDERS]
})

@RouteConfig([
    {
        path: '/login',
        name: 'Login',
        component: LoginComponent,
        useAsDefault: true
    },
    {
        path: '/game',
        name: 'Game',
        component: GameComponent
    }
])

<<<<<<< HEAD
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
=======
export class AppComponent {
>>>>>>> e6cf1470c4838a9af3da8bff2aa9797c417640bb

}

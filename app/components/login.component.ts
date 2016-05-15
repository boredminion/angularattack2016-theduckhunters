import {Component,Input, Injectable} from '@angular/core';
import {Router} from '@angular/router-deprecated';

//socket
import {SocketService} from '../services/socket.service';
import {SocketEvents} from '../services/socket_events.enum';
declare var gapi:any;

@Injectable()

@Component({
    selector: "login",
    template: require('../assets/templates/login.html'),
})

export class LoginComponent {
    ngAfterViewInit() {

        gapi.signin2.render(
            "google",
            {
                "scope": "profile email",
                "theme": "dark",
                'width': 200,
                'height': 50,
                'longtitle': false,
                "onSuccess": (user) => {
                    if (!window.localStorage.getItem("isSignedIn")) {
                        window.localStorage.setItem("isSignedIn", "true");
                        this.login(user);
                    } else {
                        window.localStorage.removeItem("isSignedIn");
                        this.signOut();
                        window.location.reload();
                    }

                },

            }
        );
    }

    public username:string;
    public userPassword:string = null;
    playerFull:string;

    constructor(private socketService:SocketService, private router:Router) {
        this.socketService.getSocket().on(SocketEvents[SocketEvents.roomFull], ()=> {
            this.playerFull = "There are no empty seats available. Please try again Later!!!";
        });
    }


    public signOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
            localStorage.removeItem('user');
        });
    }


    /**
     * Logs the user in
     */
    public login(user) {
        console.log(user, gapi.auth2.getAuthInstance());
        this.socketService.getSocket().emit(SocketEvents[SocketEvents.login], {
            "user": user
        }, (playerInfo) => {
            this.router.navigate(['Game']);
            console.log(playerInfo, " login success");
        });

    }
}

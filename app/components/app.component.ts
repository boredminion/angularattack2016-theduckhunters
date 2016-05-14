import {Component} from '@angular/core';

//router
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';

//socket
import {SocketService} from '../services/socket.service';

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
    directives: [ROUTER_DIRECTIVES,LoginComponent,GameComponent],
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

export class AppComponent {
    payloadGrid:string[][]=[
        ['1'],['1'],
        ['1'],    ];
}

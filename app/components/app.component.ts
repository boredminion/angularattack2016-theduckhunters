import {Component} from '@angular/core';

//router
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';


//service
import {SocketService} from '../services/socket.service';

//components
import {LoginComponent} from './login.component';
import {GameComponent} from './game.component';
import {TitleComponent} from './title.component';

@Component({
    selector: "duck-hunter",
    template: `
        <router-outlet></router-outlet>
    `,
    directives: [ROUTER_DIRECTIVES, TitleComponent],
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

}

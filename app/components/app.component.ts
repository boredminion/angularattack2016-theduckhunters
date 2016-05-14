import {Component} from '@angular/core';
import {SocketService} from '../services/socket.service';
@Component({
    selector: "duck-hunter",
    template: `
        <h1>Duck Hunters</h1>
        <p>Play the game.!!!!</p>
    `,
    providers: [SocketService]
})
export class AppComponent {
    constructor(private socketService:SocketService) {

    }
}

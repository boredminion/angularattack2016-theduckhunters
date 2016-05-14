/// <reference path="../lib/socket.io-client.d.ts" />
import { Injectable } from '@angular/core';
import {SocketEvents} from './socket_events.enum';


@Injectable()
export class SocketService {

    private socketUrl:string = 'http://10.10.11.68:3000';
    private socket:Socket;

    constructor() {
        this.socket = io.connect(this.socketUrl);

        this.socket.on(SocketEvents[SocketEvents.connect], () => {
            this.onConnect();
        });
        this.socket.on(SocketEvents[SocketEvents.connectionSuccess], (data)=> {
            this.onConnectionSuccess(data);
        });

        this.socket.on(SocketEvents[SocketEvents.disconnect], () => {
            this.onDisconnect();
        });

    }

    public getSocket() {
        return this.socket;
    }

    private onConnect() {
        console.log("connected")
        //TODO on socket connect
    }

    private onConnectionSuccess(data) {
        console.log(data);
        //TODO on connection success event
    }

    private onDisconnect() {
        console.log("disconnected");
        //TODO on disconnect from socket
    }


}

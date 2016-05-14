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
            console.log('connected');
        });
        this.socket.on(SocketEvents[SocketEvents.connectionSuccess], ()=> {
            console.log("connection success");
        });
        this.socket.on(SocketEvents[SocketEvents.login], ()=> {
            console.log("login");
        });

        this.socket.on(SocketEvents[SocketEvents.disconnect], () => {
            console.log('disconnected');
        });
    }

    public broadcastEvent(eventName:SocketEvents, data) {
        this.socket.emit(SocketEvents[eventName], data);
    }

    private onConnect() {
        //TODO on socket connect
    }

    private onConnectionSuccess() {
        //TODO on connection success event
    }

    private onLogin() {
        //TODO on successful login
    }

    private onDisconnect() {
        //TODO on disconnect from socket
    }


}

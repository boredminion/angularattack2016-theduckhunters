System.register(['@angular/core', '../services/socket.service', '../services/socket_events.enum'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, socket_service_1, socket_events_enum_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (socket_service_1_1) {
                socket_service_1 = socket_service_1_1;
            },
            function (socket_events_enum_1_1) {
                socket_events_enum_1 = socket_events_enum_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(socketService) {
                    this.socketService = socketService;
                }
                /**
                 * Logs the user in
                 */
                AppComponent.prototype.login = function () {
                    this.socketService.getSocket().emit(socket_events_enum_1.SocketEvents[socket_events_enum_1.SocketEvents.login], {
                        "usercode": "DH-KHiuufeMWMO6PLxnFCY" // put some code here
                    }, function (playerInfo) {
                        console.log(playerInfo, " login success");
                    });
                };
                /**
                 * Allows user to join the game
                 */
                AppComponent.prototype.joinGame = function () {
                    this.socketService.getSocket().emit(socket_events_enum_1.SocketEvents[socket_events_enum_1.SocketEvents.joinGame], {}, this.onUserJoinGameSuccess());
                };
                /**
                 * Callback when user successfully join the game
                 */
                AppComponent.prototype.onUserJoinGameSuccess = function () {
                    console.log("user successfully joined");
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: "duck-hunter",
                        template: "\n        <h1>Duck Hunters</h1>\n        <p>Play the game.!!!!</p>\n        <a href=\"javascript:void(0)\" (click)=\"login()\">Login</a>\n        <a href=\"javascript:void(0)\" (click)=\"joinGame()\">Join the Game</a>\n    ",
                        providers: [socket_service_1.SocketService]
                    }), 
                    __metadata('design:paramtypes', [socket_service_1.SocketService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map
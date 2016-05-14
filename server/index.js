'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var socket = require('socket.io')(server);
var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

var payloadGrid = [];
var players = {};

var appConfig = {
    gridSize: 100,
    distance: 2
};

for (var i = 0; i < appConfig.gridSize; i++) {
    payloadGrid[i] = [];
    for (var j = 0; j < appConfig.gridSize; j++) {
        payloadGrid[i][j] = 0;
    }
}

socket.on('connection', function (client) {

    console.log("Yay ! new client has connected");

    client.emit('connectionSuccess', appConfig);

    client.on('login', function (userInfo, callback) {
        console.log("login");
        players[client.id] = {
            userInfo: userInfo,
            angle: 0,
            position: {
                x: 1,
                y: 1
            }
        };
        callback ? callback(players[client.id]) : '';
        client.emit('loginSuccess', players[client.id]);
    });

    client.on('joinGame', function (callback) {
        console.log("joinGame");
        if(!players[client.id]) {
            return false;
        }
        client.join('global');
        callback ? callback() : '';
        client.emit('joinGameSuccess');
    });

    client.on('clientStateUpdate', function (data) {
        if(!players[client.id]) {
            return false;
        }
        players[client.id].angle = data.angle;
    });

    client.on('disconnect', function () {
        console.log('Phew !! Someone just disconnnect..');
        delete players[client.id];
    });

});

setInterval(function () {

    var changesPayload = [];

    //Calculate the changes
    // for (var playerId in players) {
    //     if (players.hasOwnProperty(playerId)) {
    //
    //         //Update player position and add changed grid to changesPayload
    //         var player = players[playerId];
    //         var position1 = player.position;
    //         var position2 = {
    //             x: (position1.x + (appConfig.distance * Math.cos(player.angle))),
    //             y: (position1.y + (appConfig.distance * Math.sin(player.angle)))
    //         };
    //         var changedGrid = [];
    //         var startX = (position1.x > position2.x) ? position1.x : position2.x;
    //         var startY = (position1.y > position2.y) ? position1.y : position2.y;
    //         var endX = (position1.x < position2.x) ? position1.x : position2.x;
    //         var endY = (position1.y < position2.y) ? position1.y : position2.y;
    //         for (i = startX; i <= endX; i++) {
    //             for (j = startY; j <= endY; j++) {
    //                 payloadGrid[i][j] = playerId;
    //                 var gridChange = {
    //                     playerId: playerId,
    //                     gridCoordinates: [i, j]
    //                 };
    //                 changesPayload.push(gridChange);
    //             }
    //         }
    //
    //     }
    // }

    //Calculate rankings

    // console.log("emitting", changesPayload)
    socket.to('global').emit('gameStateUpdate', changesPayload);

    changesPayload = [];

}, 50);

setInterval(function () {
    console.log('updating database');
}, 10000);
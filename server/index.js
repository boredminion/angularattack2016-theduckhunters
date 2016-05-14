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
var unusedColors = [
    "red", "black", "yellow"
];
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

var playerRankings = [];

socket.on('connection', function (client) {

    console.log("Yay ! new client has connected");

    client.emit('connectionSuccess', appConfig);

    client.on('login', function (userInfo, callback) {
        console.log("login");
        players[client.id] = {
            id: client.id,
            userInfo: userInfo,
            angle: 45,
            position: {
                x: 1,
                y: 1
            },
            color: unusedColors.splice(0, 1)[0]
        };
        var data = {
            userInfo: players[client.id],
            payloadGrid: payloadGrid
        };
        callback ? callback(data) : '';
        client.emit('loginSuccess', data);
    });

    client.on('joinGame', function (data, callback) {
        console.log("joinGame");
        if (!players[client.id]) {
            return false;
        }
        var data = {
            userInfo: players[client.id],
            payloadGrid: payloadGrid,
            players: players
        };
        callback ? callback(data) : '';
        client.emit('joinGameSuccess', data);

        setTimeout(function () {
            client.join('global');

        }, 1000)
    });

    client.on('clientStateUpdate', function (data) {
        if (!players[client.id]) {
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

    // Calculate the changes
    for (var playerId in players) {
        if (players.hasOwnProperty(playerId)) {

            //Update player position and add changed grid to changesPayload
            var player = players[playerId];
            var position1 = player.position;
            var newX = parseInt(position1.x + (appConfig.distance * Math.cos(player.angle)));
            var newY = parseInt(position1.y + (appConfig.distance * Math.sin(player.angle)));
            newX = newX <= (appConfig.gridSize - 1) ? newX : (appConfig.gridSize - 1)
            newX = newX >= 0 ? newX : 0
            newY = newY >= 0 ? newY : 0;
            newY = newY <= (appConfig.gridSize - 1) ? newY : (appConfig.gridSize - 1)
            var position2 = {
                x: newX,
                y: newY
            };
            var changedGrid = [];
            var startX = (position1.x < position2.x) ? position1.x : position2.x;
            var startY = (position1.y < position2.y) ? position1.y : position2.y;
            var endX = (position1.x > position2.x) ? position1.x : position2.x;
            var endY = (position1.y > position2.y) ? position1.y : position2.y;
            while (!(startX === endX && startY === endY)) {
                if (startX < endX) {
                    startX++;
                }
                if (startY < endY) {
                    startY++;
                }
                payloadGrid[startX][startY] = playerId;
                var gridChange = {
                    playerId: playerId,
                    gridCoordinates: [startX, startY]
                };
                changesPayload.push(gridChange);
            }
            console.log(position2);
            player.position = position2;

        }
    }

    //Calculate rankings
    var playerScoreMap = {}
    for (var i = 0; i < appConfig.gridSize; i++) {
        for (var j = 0; j < appConfig.gridSize; j++) {
            // payloadGrid[i][j] = '';
            var gridUser = payloadGrid[i][j];
            if (playerScoreMap[gridUser]) {
                playerScoreMap[gridUser]++;
            } else {
                playerScoreMap[gridUser] = 1;
            }
        }
    }

    playerRankings = [];
    for (var playerId in playerScoreMap) {
        if (playerScoreMap.hasOwnProperty(playerId) && playerId != 0) {
            playerRankings.push({
                score: playerScoreMap[playerId],
                player: players[playerId]
            })
        }
    }
    ;
    playerRankings = playerRankings.sort(function (a, b) {
        return a.score - b.score
    });

    // console.log("emitting", changesPayload)
    socket.to('global').emit('gameStateUpdate', {playerRankings: playerRankings, changesPayload: changesPayload});

}, 60);

setInterval(function () {
    console.log('updating database');
}, 10000);
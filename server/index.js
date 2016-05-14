'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var socket = require('socket.io')(server);
var Firebase = require('firebase');
var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

var payloadGrid = [];
var players = {};
<<<<<<< HEAD

var myFirebaseRef = new Firebase("https://duckhunters.firebaseio.com/");


=======
var unusedColors = [
    "red", "black", "yellow", "blue", "green"
];
>>>>>>> e6cf1470c4838a9af3da8bff2aa9797c417640bb
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
<<<<<<< HEAD
        var user = userInfo;
        function pushdata(){
            var randomReference= myFirebaseRef.push();

            user = {
                id: "1",
                usercode: 'DH' + randomReference.key(),
                score: 1212,
            };
            randomReference.set(user);
            return user.usercode;
        }

        function userExistsCallback(id, exists){
            if(exists){
                //TODO: return to game menu
                id.on("value", function(snapshot) {
                    user = snapshot.val();
                })
            }
            else{
                var userC = pushdata();
                // TODO: return the latest usercode to the user and return to game menu
            }
            players[client.id] = {
                userInfo: user,
                angle: 10,
                position: {
                    x: 1,
                    y: 1
                }
            };
            callback ? callback(players[client.id]) : '';
            client.emit('loginSuccess', players[client.id]);
        }

        myFirebaseRef.once("value", function (allMessagesSnapshot, cb) {
            var exists = false;
            var ref;
            allMessagesSnapshot.forEach(function (messageSnapshot) {

                // Will be called with a messageSnapshot for each child under the /messages/ node
                var key = messageSnapshot.key();  // e.g. "-JqpIO567aKezufthrn8"
                var uid = messageSnapshot.child("usercode").val();  // e.g. "barney"
                if (uid === userInfo.usercode){
                    exists = true;
                    ref = new Firebase("https://duckhunters.firebaseio.com/"+ key);
                }
            });
            userExistsCallback(ref, exists);
        });



=======
        console.log("login");
        players[client.id] = {
            id: client.id,
            userInfo: userInfo,
            angle: 45,
            position: {
                x: 0,
                y: 0
            },
            color: unusedColors.splice(0,1)[0] ? unusedColors.splice(0,1)[0] : "white"
        };
        console.log(players[client.id])
        var data = {
            userInfo: players[client.id]
        };
        callback ? callback(data) : '';
        client.emit('loginSuccess', data);
        socket.to('global').emit('playerConnected', players);
>>>>>>> e6cf1470c4838a9af3da8bff2aa9797c417640bb
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

        client.join('global');
    });

    client.on('clientStateUpdate', function (data) {
        console.log('clientStateUpdate', data);
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
            var newX = Math.round(position1.x + (appConfig.distance * Math.cos(player.angle)));
            var newY = Math.round(position1.y + (appConfig.distance * Math.sin(player.angle)));
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
    //myFirebaseRef.push({
    //    id: "10",
    //    username: "Firebase",
    //    usercode: "sss",
    //    score: 9990,
    //
    //});
    //myFirebaseRef.child("username").on("value", function(snapshot) {
    //    console.log(snapshot.val());  // Alerts "San Francisco"
    //});
    //myFirebaseRef.remove(function(error) {
    //    alert(error ? "Uh oh!" : "Success!");
    //});
    console.log('updating database');
}, 10000);

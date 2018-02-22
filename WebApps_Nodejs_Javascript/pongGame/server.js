//Multiplayer Pong Game
//Author: Zachary Seguin

//The Following HTTP Server template is from Prof Andrew Runka
const http = require('http').createServer(handler);
const io = require('socket.io')(http);
const fs = require('fs');
const url = require('url');
const mime = require('mime-types');
const ROOT = './game';
const INDEX = 'assignment2.html';
const randGenerator = require('./randNumGen');

http.listen(3000);
console.log("Server is listning on port 3000, control+c to quit");

var connections = [];
var playersPicked = 0;
var playersClicked = 0;

function handler(req, res) {

    //log the request
    console.log(req.method + " request for: " + req.url);

    //parse the url
    var urlObj = url.parse(req.url);
    var filename = ROOT + urlObj.pathname;

    //the callback sequence for static serving...
    fs.stat(filename, function(err, stats) { //async
        if (err) { //try and open the file and handle the error
            respondErr(err);
        } else if (stats.isDirectory()) {
            fs.readFile(filename + INDEX, function(err, data) { //async
                if (err) {
                    respondErr(err);
                } else {
                    respond(200, data, mime.lookup(filename + INDEX));
                }
            });
            //handle the serving of data
        } else {
            fs.readFile(filename, function(err, data) {
                if (err) {
                    respondErr(err);
                } else {
                    respond(200, data, mime.lookup(filename));
                }
            });
        }

        //locally defined helper function
        //serves 404 files
        function serve404() {
            fs.readFile(ROOT + "/404.html", function(err, data) { //async
                if (err) respond(500, err.message, null);
                else respond(404, data, mime.lookup(filename));
            });
        }

        //locally defined helper function
        //responds in error, and outputs to the console
        function respondErr(err) {
            console.log("Handling error: ", err);
            if (err.code === "ENOENT") {
                serve404();
            } else {
                respond(500, err.message, null);
            }
        }
        //locally defined helper function
        //sends off the response message
        function respond(code, data, contentType) {
            // content header
            res.writeHead(code, {
                'content-type': contentType || 'text/html'
            });
            // write message and signal communication is complete
            res.end(data);
        }
    }); //end handle request
}
//Above HTTP Server template is from Prof Andrew Runka

io.on('connection', function(socket){ //Called on connection to server
	connections.push({aSocket: socket, id: Date.now() + Math.random()}); //Add this socket to connection array with randomly generated id (for client)
	console.log("Connected %s sockets connected", connections.length);
	socket.emit('connected', { "id": connections[connections.length-1].id, "message": "You are connected to server."}); //Sends client info upon connection
	socket.on('disconnect', function(){ //When client disconnects, remove from connection array
    if(playersPicked != 0){
      playersPicked--;
    }
		connections.splice(connections.indexOf(socket), 1);
		console.log("Disconnected: %s sockets connected", connections.length);
	});

	socket.on('btn1Click', function(){ //When client clicks button, let other clients know
    playersPicked++; //Counts how many players have selected their buttons (allows server to know that both are ready to start)
    if(playersPicked == 2){
      io.sockets.emit('playersRdy'); //Sends message to clients letting them know that both players have been selected
    }
		io.sockets.emit("disableBtn1"); //Tells client to disable their "player1" button
	});

  socket.on('btn2Click', function(){ //When client clicks button, let other clients know
    playersPicked++; //Counts how many players have selected their buttons (allows server to know that both are ready to start)
    if(playersPicked == 2){
      io.sockets.emit('playersRdy'); //Sends message to clients letting them know that both players have been selected
    }
		io.sockets.emit('disableBtn2'); //Tells client to disable their "player2" button
	});

  socket.on('playerClick', function(playerPicked){ //When player clicks on the canvas
  	playersClicked++;
    if(playersClicked == 2){ //Both players have clicked canvas
      playersClicked = 0;
      io.sockets.emit('bothClicked'); //Indicates both players are ready to start the game
    }
	});

  socket.on('start', function(data){ //Sets starting values of the ball when the game is resumed/started
  	var received = JSON.parse(data);
  	var x, y, len;
  	if(received.ballVelX === 0 && received.ballVelY === 0){ //If the ball isnt moving
			x = randGenerator.getRandXVel();  //Calls function from custom module ('./randNumGen.js')
			y = randGenerator.getRandYVel();  //Calls function from custom module ('./randNumGen.js')
			len = 300;
			io.sockets.emit('ballVelUpdate', JSON.stringify({'x': x, 'y': y, 'len': len})); //Send ball velocity info to clients so they can be in sync
	}
  });

  socket.on('collide', function(data){ //Called when a collision with a player paddle and the ball occurs
  	var received = JSON.parse(data);
  	var x, y, len;
  	x = -received.ballVelX; //Inverts direction of ball (EX: going left, hits paddle, going right)
	y = randGenerator.getRandYDeviation(received.ballVelY); //Calls function from custom module ('./randNumGen.js')
	len = received.ballVelLen * 1.05; //Increases the speed of the ball by a factor each time it hits a paddle
	io.sockets.emit('ballVelUpdate', JSON.stringify({'x': x, 'y': y, 'len': len})); //Sends updated ball velocity info to clients so they can be in sync

  });

  socket.on('paddleUpdate', function(data){ //Called whenever a client moves paddle
  		io.sockets.emit('serverPaddleUpdate', data); //Sends paddle location to all clients so they can remain in sync (EX: player 1 sees player 2 moving)
  });
});
console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit');

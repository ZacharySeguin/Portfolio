//Multiplayer Pong Game
//Author: Zachary Seguin

$(document).ready(function() {
	class Vec{ //Vector class
		constructor(x = 0, y = 0){
			this.x = x;
			this.y = y;
		}
		get len(){
			return Math.sqrt(this.x * this.x + this.y * this.y);
		}
		set len(value){
			const fact = value / this.len;
			this.x *= fact;
			this.y *= fact;
		}
	}
	class Rect{ //Rectangle class, represents all hitboxes on canvas
		constructor(w, h){
			this.pos = new Vec;
			this.size = new Vec(w,h)
		}
		get left(){
			return this.pos.x - this.size.x / 2;
		}
		get right(){
			return this.pos.x + this.size.x / 2;
		}
		get top(){
			return this.pos.y - this.size.y / 2;
		}
		get bottom(){
			return this.pos.y + this.size.y / 2;
		}
	}
	class Ball extends Rect{ //Ball class, represents the moving ball on the canvas
		constructor(){
			super(10, 10);
			this.vel = new Vec;
		}
	}
	class Player extends Rect{ //Player class, represents the moving paddle and also player score on the canvas
		constructor(){
			super(20,100);
			this.score = 0;
		}
	}
	class Pong{ //Pong class responsible for setting up and running some of the game
		constructor(canvas, socket){
			this._canvas = canvas; //Refers to html canvas
			this._socket = socket; //Refers to server connected socket
			this._context = canvas.getContext("2d");
			this.ball = new Ball;
			this.ball.pos.x = (canvas.width/2); //Puts the ball in the middle of the screen
			this.ball.pos.y = (canvas.height/2);
			this.ball.vel.x = 100; //Default velocity values
			this.ball.vel.y = 100;

			this.players = [ //Players array to keep track of both players and also
			new Player,
			new Player,
			];

			this.players[0].pos.x = 40; //Puts player 1 a certain distance from the left border of the canvas
			this.players[1].pos.x = this._canvas.width - 40; //Puts player 2 a certain distance from the right border of the canvas
			this.players.forEach(player => {
				player.pos.y = this._canvas.height/2; //Centers both players to the middle of the canvas
			})

			let lastTime;
			const callback = (millis) => { //Runs throughout the life of the game
				if(lastTime){
					this.update((millis - lastTime) / 1000); //calls update constantly to maintain a steady animation
				}
				lastTime = millis;
				requestAnimationFrame(callback);
			};
			callback();

			this.reset();
		}
		collide(player, ball){ //Manages collision with player paddle
			if(player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top){ //If collision occurs
				const len = ball.vel.len;
				this._socket.emit('collide', JSON.stringify({'ballVelX' : ball.vel.x, 'ballVelY' : ball.vel.y, 'ballVelLen' : len})); //Sends info to server to be managed
			}
		}
		draw(){ //Responsible for drawing the canvas and all of its elements
			this._context.fillStyle = '#000';
			this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
			this.drawText();
			this.drawRect(this.ball, '#fff');
			this.drawRect(this.players[0], '#14D6F4');
			this.drawRect(this.players[1], 'red');
		}
		drawText(){ //Responsible for drawing scores onto canvas
			this._context.font = "20px Arial";
			this._context.fillStyle = '#14D6F4';
			this._context.fillText("Player 1 score: " + this.players[0].score, 10, 30);
			this._context.fillStyle = 'red';
			this._context.fillText("Player 2 score: " + this.players[1].score, this._canvas.width - 170, 30);
		}
		drawRect(rect, color){ //Responsible for drawing shapes onto canvas, including player paddle and the ball
			this._context.fillStyle = color;
			this._context.fillRect(rect.left, rect.top,
				rect.size.x, rect.size.y);
		}
		reset(){ //Resets ball positions, player positions and sets some boolean flags
			this.ball.pos.x = (canvas.width/2); //Sets ball to middle
			this.ball.pos.y = (canvas.height/2);
			this.ball.vel.x = 0; //Freezes ball in place
			this.ball.vel.y = 0;
			console.log("Player 1 score: " + this.players[0].score);
			console.log("Player 2 score: " + this.players[1].score);
			this.players.forEach(player => {
				player.pos.y = this._canvas.height/2; //Centers players
			})
			gamePaused = true;
			gameStarted = false;
		}
		gameOver(playerId){ //Called when win condition is met, resets everything to it's starting state so game can be restarted
			this.players.forEach(player => {
				player.pos.y = this._canvas.height/2; //Centers players
			})
			this.ball.pos.x = (canvas.width/2); //Centers ball
			this.ball.pos.y = (canvas.height/2);
			this.ball.vel.x = 0; //Freezes ball in place
			this.ball.vel.y = 0;
			this.draw(); //Updates the canvas
			gamePaused = true; //Resets a few boolean flags
			gameStarted = false;
			p1Picked = false;
			p2Picked = false;
			playerSelected = -1;
			text.innerHTML = "Game over! Player " + (playerId + 1) + " is the winner. Player1: " //Sets the game winning text (bottom of canvas)
			+ this.players[0].score + " Player2: " + this.players[1].score;
			$('#p1').prop('disabled',false).removeClass('disabled'); //Disables both buttons so one user cannot pick two players
			$('#p2').prop('disabled',false).removeClass('disabled');
			this.players.forEach(player => player.score = 0); //Sets player scores to 0
		}
		start(){ //Called whenever the game state either starts completely or is resumed after a player scores
			this._socket.emit('start', JSON.stringify({'ballVelX' : this.ball.vel.x, 'ballVelY' : this.ball.vel.y})); //Sends necessary info to server
		}
		update(deltaTime){ //Updates positions and checks for point scoring (called many times through the callback function in constructor)
			this.ball.pos.x += this.ball.vel.x * deltaTime; //Moves the ball along
			this.ball.pos.y += this.ball.vel.y * deltaTime;
			if(this.ball.left < 0 || this.ball.right > this._canvas.width){ //Checks if the ball has reached the end of the canvas
				let playerId;
				if(this.ball.vel.x < 0){ //If the ball reaches the left side, player 2 scored
					playerId = 1;
					this.players[playerId].score++;
					if(this.players[playerId].score === 5){ //Checks for win condition (player must have 5 points)
						console.log("Game over, player " + (playerId + 1) + " has won.");
						this.gameOver(playerId); //Calls game over function
					}
					this.reset(); //If game isn't won, reset canvas instead (freezes game in place to start next round)
				}
				else{ //Ball has reached the right border of canvas, player 1 should score
					playerId = 0;
					this.players[playerId].score++;
					if(this.players[playerId].score === 5){ //Checks for win condition (player must have 5 points)
						console.log("Game over, player " + (playerId + 1) + " has won.");
						this.gameOver(playerId); //Calls game over function
					}
					this.reset(); //If game isn't won, reset canvas instead (freezes game in place to start next round)
				}
			}
			if(this.ball.top < 0 || this.ball.bottom > this._canvas.height){ //Manages collision with the top and bottom of the canvas
				this.ball.vel.y = -this.ball.vel.y; //Inverts Y velocity (goes from traveling down to traveling up)
			}

			this.players.forEach(player => this.collide(player, this.ball)); //Checks if a collision with the paddles has occured
			this.draw(); //Re-draws canvas to keep it up to date
		}
}

const canvas =  document.getElementById('pong'); //Canvas pulled from index.html
const socket = io(); //Socket connected to server
const pong = new Pong(canvas, socket); //Instance of the pong game
const button1 = document.getElementById('p1'); //Button for player1 select
const button2 = document.getElementById('p2'); //Button for player2 select
const text = document.getElementById('instructions'); //Text below the canvas, serves as instructions
var playerSelected = -1; //Dictates which paddle the user will control, and their score
var playersRdy = false; //Boolean flag is true when both players have pressed one of the buttons (player 1 or 2 selected)
var gameStarted = false; //Boolean flag indicates if game has started (when both players click on the canvas)
var playerId = null; //Value assigned by server, gives particular instance a unique ID
var waitingForOtherPlayer = false; //Flag dictates if the player is waiting for the other player (used to restrict some actions)
var gamePaused = true; //This is true when the game is either over, or if it is paused between rounds
var p1Picked = false; //True is btn1 has been clicked (server dictates this)
var p2Picked = false; //True is btn2 has been clicked (server dictates this)
	canvas.addEventListener('mousemove', event => { //Event for when a mouse is moved in the canvas
		if(gameStarted){
			text.innerHTML = "Game in progress."; //Text below canvas indicates game is active
			pong.players[playerSelected].pos.y = event.offsetY; //Moves paddle according to mouse
			socket.emit('paddleUpdate', JSON.stringify({'player' : playerSelected, 'y' : pong.players[playerSelected].pos.y})); //Sends paddle movement to server so it can be distributed to other player
		}
	});

	canvas.addEventListener('click', event => { //Event listener for when canvas is clicked
		if(playersRdy == true && waitingForOtherPlayer == false && gamePaused == true && p1Picked == true && p2Picked == true){ //If statement locks out canvas clicking if conditions are not met
			if(playerSelected == 0){
				text.innerHTML = "You clicked, waiting for player 2";
			}
			else{
				text.innerHTML = "You clicked, waiting for player 1";
			}
			waitingForOtherPlayer = true;
			console.log("Player " + playerSelected + " clicked.");
			socket.emit('playerClick', playerSelected); //Sends info to server that one of the players has clicked (will now wait for other player to click before starting the game)
		}
	});


	socket.on('ballVelUpdate', function(data){ //Manages incoming ball velocity updates from server (keep rand numbers consistent among players)
		var received = JSON.parse(data);
		pong.ball.vel.x = received.x;
		pong.ball.vel.y = received.y;
		pong.ball.vel.len = received.len;
	});

	socket.on('serverPaddleUpdate', function(data){ //Manages incoming paddle location updates from server (shows other paddle moving)
		var received = JSON.parse(data);
		pong.players[received.player].pos.y = received.y;
	});

	socket.on('bothClicked', function(){ //Manages start of game, when both players have clicked on canvas
		console.log("Both players ready, starting game...");
		waitingForOtherPlayer = false; //Allows usage of paddle
		gameStarted = true; //Allows usage of paddle
		pong.start(socket); //Starts the movement of the ball
	});

	socket.on('connected', function(data){ //On client to server connection, client is given an id and is notified
		console.log("Message: " + data.message);
		console.log("Socket id: " + data.id);
		playerId = data.id;
	});

	socket.on('disableBtn2', function(){ //Manages server command to disable button
		console.log("disabling btn2");
		p2Picked = true; //If btn2 is disabled, it must has been clicked by another client/player so let this player know
		$('#p2').prop('disabled',true).addClass('disabled');
	});

	socket.on('disableBtn1', function(){ //Manages server command to disable button
		console.log("disabling btn1");
		p1Picked = true; //If btn1 is disabled, it must has been clicked by another client/player so let this player know
		$('#p1').prop('disabled',true).addClass('disabled');
	});

	socket.on('playersRdy', function(){ //Manages message from server that notifies clients that they have both selected a player (buttons have been pressed on both sides)
		console.log("both players ready to play.");
		playersRdy = true;
	});

	$("#p1").click(function(){ //On click listener for button found in index.html
		socket.emit("btn1Click"); //Send message to server indicating that this button has been clicked
		console.log("User picked player1!");
		text.innerHTML = "You selected player 1, please click anywhere on the game screen to begin."; //Set text giving user feedback at bottom of canvas
		$('#p1').prop('disabled',true).addClass('disabled'); //Disables both buttons so one user cannot pick two players
		$('#p2').prop('disabled',true).addClass('disabled');
		playerSelected = 0; //Sets value for use in players[] in the pong class later
		console.log("playerSelected = " + playerSelected);
	});
	$("#p2").click(function(){ //On click listener for button found in index.html
		socket.emit("btn2Click"); //Send message to server indicating that this button has been clicked
		console.log("User picked player2!");
		text.innerHTML = "You selected player 2, please click anywhere on the game screen to begin."; //Set text giving user feedback at bottom of canvas
		$('#p1').prop('disabled',true).addClass('disabled'); //Disables both buttons so one user cannot pick two players
		$('#p2').prop('disabled',true).addClass('disabled');
		playerSelected = 1; //Sets value for use in players[] in the pong class later
		console.log("playerSelected = " + playerSelected);
	});
});

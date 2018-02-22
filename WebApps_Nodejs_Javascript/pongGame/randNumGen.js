//Multiplayer Pong Game
//Author: Zachary Seguin



exports.getRandXVel = function(){
	var x = 300 * (Math.random() > .5 ? 1 : -1); //Calculates random x direction for ball to go when game starts

	return x;
}

exports.getRandYVel = function(){
	var y = 300 * (Math.random() * 2 - 1); ; //Calculates random y direction for ball to go when game starts

	return y;
}

exports.getRandYDeviation = function(yVel){
	var randNum = yVel + (300 * (Math.random() - .5)); //Calculates random y deviation when ball hits paddle (prevents ball from getting stuck going back and forth infinitely)

	return randNum;
}

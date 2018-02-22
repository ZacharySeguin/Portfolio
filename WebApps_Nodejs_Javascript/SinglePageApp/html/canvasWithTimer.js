//Author: Zachary Seguin

//Using javascript array of objects to represent words and their locations
var words = [];

var wordBeingMoved;

var deltaX, deltaY; //location where mouse is pressed
var canvas = document.getElementById('canvas1'); //our drawing canvas


function getWordAtLocation(aCanvasX, aCanvasY){//Locates word at location and assigns a hitbox for grabbing
  var context = canvas.getContext('2d');

  for(var i=0; i<words.length; i++){
    if(Math.abs(words[i].x - aCanvasX) < (context.measureText(words[i].word + " ").width) && //Scales based off of word width
    Math.abs(words[i].y - aCanvasY) < 10) return words[i];
  }
  return null;
}

var drawCanvas = function(){ //Func to update canvas whenever changes are made

  var context = canvas.getContext('2d');

  context.fillStyle = 'white';
  context.fillRect(0,0,canvas.width,canvas.height); //erase canvas

  context.font = '10pt Courier New';
  context.fillStyle = 'cornflowerblue';

  for(var i=0; i<words.length; i++){
    var data = words[i];
    context.fillText(data.word, data.x, data.y);
  }
}

function handleMouseDown(e){

  //get mouse location relative to canvas top left
  var rect = canvas.getBoundingClientRect();
  var canvasX = e.pageX - rect.left; //use jQuery event object pageX and pageY
  var canvasY = e.pageY - rect.top;
  console.log("mouse down:" + canvasX + ", " + canvasY);
  wordBeingMoved = getWordAtLocation(canvasX, canvasY);
  console.log("Word coords: x: " + wordBeingMoved.x + " y: " + wordBeingMoved.y); //Used to keep track of word coords in dev window of chrome
  if(wordBeingMoved != null ){
    deltaX = wordBeingMoved.x - canvasX;
    deltaY = wordBeingMoved.y - canvasY;
    $("#canvas1").mousemove(handleMouseMove);
    $("#canvas1").mouseup(handleMouseUp);

  }

  // Stop propagation of the event and stop any default
  //  browser action

  e.stopPropagation();
  e.preventDefault();
  drawCanvas();
}

function handleMouseMove(e){

  console.log("mouse move");

  //get mouse location relative to canvas top left
  var rect = canvas.getBoundingClientRect();
  var canvasX = e.pageX - rect.left;
  var canvasY = e.pageY - rect.top;

  wordBeingMoved.x = canvasX + deltaX;
  wordBeingMoved.y = canvasY + deltaY;

  e.stopPropagation();

  drawCanvas();
}

function handleMouseUp(e){
  console.log("mouse up");

  e.stopPropagation();

  //remove mouse move and mouse up handlers but leave mouse down handler
  $("#canvas1").off("mousemove", handleMouseMove); //remove mouse move handler
  $("#canvas1").off("mouseup", handleMouseUp); //remove mouse up handler

  drawCanvas(); //redraw the canvas
}

//JQuery Ready function -called when HTML has been parsed and DOM
//created
//can also be just $(function(){...});
//much JQuery code will go in here because the DOM will have been loaded by the time
//this runs

function handleSubmitButton () {
  var context = canvas.getContext('2d');
  context.clearRect(0,0,canvas.width,canvas.height);
  context.font = '10pt Courier New';
  context.fillStyle = 'cornflowerblue';
  var userText = $('#userTextField').val(); //get text from user text input field
  if(userText && userText != ''){
    //user text was not empty
    var userRequestObj = {text: userText}; //make object to send to server
    var userRequestJSON = JSON.stringify(userRequestObj); //make json string
    $.post("userText", userRequestJSON, function(data, status){
      console.log("data: " + data);
      console.log("typeof: " + typeof data);

      var responseObj = JSON.parse(data);
      var songString = responseObj.text; //This is a working string
      var tempTrim = $.trim(songString); //{"         Hello World\n    "} = "Hello World\n"
      var songWordsArr = tempTrim.split(" ");
      var currY = 20; //Starting Ycoord
      var prevX = 10; //Starting Xcoord
      var prevWidth = 0;
      var newLine = false;
      words = [];

      for(i = 0; i < songWordsArr.length; i++){
      if(newLine == true){ //Adds the first word of a new line
        words.push({word: songWordsArr[i], x: prevWidth + prevX, y: currY});
        newLine =  false;
      }
      else if(songWordsArr[i].indexOf("\n")==-1 && songWordsArr[i].indexOf("\\n")==-1){ //No need to change y choordinates, no new line
        if(words.length != 0){ //Has elements inside, normal opperation
          prevX = words[i-1].x;
          prevWidth = context.measureText(words[i-1].word + " ").width;
          words.push({word: songWordsArr[i], x: prevWidth + prevX, y: currY}); //Add word with proper x and y choords
        }
        else{
          words.push({word: songWordsArr[i], x: prevWidth + prevX, y: currY}); //First word of the words[] array, no need to refer to prev words (they dont exist)
        }
      }
      else{ //New line is present, reset x choordinates and add 20 to y choordinates to represent new line
        prevX = words[i-1].x;
        prevWidth = context.measureText(words[i-1].word + " ").width;
        words.push({word: songWordsArr[i], x: prevWidth + prevX, y: currY});
        currY += 20; //Reset Xcoord and add 20 to Ycoord (Move down)
        prevWidth = 0;
        prevX = 10;
        newLine = true;
      }
    }
    for(i=0; i<words.length; i++){ //Fill out the canvas with the words from words[] array
      context.fillText(words[i].word, words[i].x, words[i].y);
    }

  });
}

}

function handleUpdateButton () {
  var context = canvas.getContext('2d');
  var userText = $('#userTextField').val();
  if(userText && userText != ''){
    let serverUpdateObject = {title: userText, content: words}; //Words[] would need to be sorted to account for changes in x and y choords, not implemented
    context.clearRect(0,0,canvas.width,canvas.height); //Clear canvas
    var wordsIntoJSON = JSON.stringify(serverUpdateObject); //make json string
    $.post("Song", wordsIntoJSON, function(data, status){
      alert("Data: " + data + "\nStatus: " + status);
    });
  }
}

$(document).ready(function(){
  //This is called after the broswer has loaded the web page

  //add mouse down listener to our canvas object
  $("#canvas1").mousedown(handleMouseDown);

  drawCanvas();
});

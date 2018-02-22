//Author: Zachary Seguin

//Server Code
var http = require('http'); //need to http
var fs = require('fs'); //need to read static files
var url = require('url');  //to parse url strings

var counter = 1000; //to count invocations of function(req,res)


var ROOT_DIR = 'html'; //dir to serve static files from

var MIME_TYPES = {
  'css': 'text/css',
  'gif': 'image/gif',
  'htm': 'text/html',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'text/javascript', //should really be application/javascript
  'json': 'application/json',
  'png': 'image/png',
  'txt': 'text/plain'
};

var get_mime = function(filename) {
  var ext, type;
  for (ext in MIME_TYPES) {
    type = MIME_TYPES[ext];
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return type;
    }
  }
  return MIME_TYPES['txt'];
};

http.createServer(function (request,response){
  var urlObj = url.parse(request.url, true, false);
  console.log('\n============================');
  console.log("PATHNAME: " + urlObj.pathname);
  console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
  console.log("METHOD: " + request.method);

  var receivedData = '';

  //attached event handlers to collect the message data
  request.on('data', function(chunk) {
    receivedData += chunk;
  });

  //event handler for the end of the message
  request.on('end', function(){
    //console.log('received data: ', receivedData);
    //console.log('type: ', typeof receivedData);



    //if it is a POST request then echo back the data.
    if(request.method == "POST"){
      var dataObj = JSON.parse(receivedData); //received data should be a song name "Sister Golden Hair"
      console.log('received data object: ', dataObj);
      console.log('type: ', typeof dataObj);
      //Here we can decide how to process the data object and what
      //object to send back to client.
      //FOR NOW EITHER JUST PASS BACK AN OBJECT
      //WITH "text" PROPERTY
      if(!dataObj.content){ //ReceivedData is a song name
        //TO DO: return the words array that the client requested
        //if it exists
        if (dataObj.text != null){ //If the song has a name
          var returnObj = {};
          fs.readFile('songs/' + dataObj.text + '.txt', function(err, data) { //Read file from directory
            if(err) throw err;
            var array = data.toString().split("\n"); //Split read string into lines
            var chordArr = "";
            var lyrics = "";
            var i, j;
            var spaces = 0;
            for(i = 0; i < array.length; i++){ //Reads each line seperately
              lyrics += " ";
              for(j = 0; j < array[i].length; j++){ //Reads each char seperately
                if(array[i].charAt(j) == '\r' || array[i].charAt(j) == '\n'){
                  chordArr += "\n";
                  lyrics += "\n";
                }
                else if(array[i].charAt(j) == '['){
                  var x = j+1; //x represents where the chord starts
                  while(array[i].charAt(x) != ']'){
                    chordArr += array[i].charAt(x);
                    x++;
                    spaces++;
                  }
                  j = x;
                }
                else{
                  if(spaces > 0){ //Used to keep track of how many spaces a chord string takes
                    lyrics += array[i].charAt(j);
                    spaces--;
                  }
                  else{
                    chordArr += " ";
                    lyrics += array[i].charAt(j);
                  }
                }
              }
            }
            var lyricsArr = lyrics.split("\n"); //Split isnt working
            var chordArray = chordArr.split("\n");
            var result = "";
            for(index = 0; index < lyricsArr.length; index++){ //This will be parsed into JSON
              result += (chordArray[index] + "\n");
              result += (lyricsArr[index] + "\n");
            }
            console.log("Output: \n\n");
            returnObj.title = dataObj.text; //Name of song
            returnObj.text = result; //Song formated properly
            console.log("Obj title = " + returnObj.title + "\nText: \n" + returnObj.text);
            response.writeHead(200, {'Content-Type': MIME_TYPES["text"]});  //does not work with application/json MIME
            response.end(JSON.stringify(returnObj)); //send just the JSON object
          });

        }else{
          console.log("USER REQUEST: " + dataObj.text );
          var returnObj = {};
          returnObj.text = 'NOT FOUND: ' + dataObj.text;
          response.writeHead(200, {'Content-Type': MIME_TYPES["text"]});  //does not work with application/json MIME
          response.end(JSON.stringify(returnObj)); //send just the JSON object
        }
      }else{ //Recieved data is not a song name, must be a call to UPDATE
        console.log("Update button pressed.");
        var words = dataObj.content;
        var string = ""; //String to be used in the writeFile
        for(i in words){
          if(words[i].word === " " || words[i].word === ""){
            string += " "; //Accounts for spaces, string reformatting not implemented yet (Using new x and y choords, sort words[] array)
          }
          else{
            string += words[i].word; //Add each word to the string
          }
        }
        var fileName = dataObj.title;
        fs.writeFile('./songs/' + fileName + '_updated.txt', string, (err) => { //Write to file the updated song
          if (err) throw err;
          console.log('The file has been saved!');
        });
      }
    }
  });

  if(request.method == "GET"){
    //handle GET requests as static file requests
    var filePath = ROOT_DIR + urlObj.pathname;
    if(urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html';

    fs.readFile(filePath, function(err,data){
      if(err){
        //report error to console
        console.log('ERROR: ' + JSON.stringify(err));
        //respond with not found 404 to client
        response.writeHead(404);
        response.end(JSON.stringify(err));
        return;
      }
      response.writeHead(200, {'Content-Type': get_mime(filePath)});
      response.end(data);
    });
  }


}).listen(3000);

console.log('Server Running at http://127.0.0.1:3000  CNTL-C to quit');

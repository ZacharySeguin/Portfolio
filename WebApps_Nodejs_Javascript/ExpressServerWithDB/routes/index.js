//Author: Zachary Seguin

var url = require('url');
var fs = require('fs'); //built in node file system module
var lineReader = require('line-reader'); //npm install line-reader
var sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
var db = new sqlite3.Database('recipes.db');
var dataString = ''; //data between tags being collected
var openingTag = ''; //xml opening tag
var recipes = []; //recipes parsed
var recipe = {};  //recipe being parsed

lineReader.eachLine("routes/aLaCarteData_rev3.xml", function(line, last) { //Function called for each line in the file specified.
  str = line.trim();
  if(isOpeningTag(str)){
    openingTag = str;
    dataString = '' //clear data string
  }
  else if(isClosingTag(str)){ //Finds out where the end of a tag is, and adds that data to appropriate attribute
    if(str === '</recipe_name>') {
      recipe.recipe_name = dataString;
    }
    else if(str === '</spices>'){
      recipe.spices = dataString;
    }
    else if(str === '</contributor>'){
      recipe.contributor = dataString;
    }
    else if(str === '</category>'){
      recipe.category = dataString;
    }
    else if(str === '</description>'){
      recipe.description = dataString;
    }
    else if(str === '</source>'){
      recipe.source = dataString;
    }
    else if(str === '</rating>'){
      recipe.rating = dataString;
    }
    else if(str === '</ingredients>'){
      recipe.ingredients = dataString;
    }
    else if(str === '</directions>'){
      recipe.directions = dataString;
    }
    else if(str === '</recipe>'){
      recipes.push(recipe);
      recipe = {};
    }
    openingTag = '';
    //console.log("LINE " + str)
  }
  else {
    dataString += (" " + str);
  }

  if (last) {
    //done reading file
    console.log("DONE");
    writeRecipesToDatabase(recipes); //Will add all recipes from XML to the database
    console.log('Number of Recipes: ' + recipes.length);
    return false; // stop reading
  }
});
db.serialize(function(){
  //make sure a couple of users exist in the database.
  //user: A4 password: COMP2406
  //user: ldnel password: secret
  var sqlString = "CREATE TABLE IF NOT EXISTS users (userid TEXT PRIMARY KEY, password TEXT)";
  db.run(sqlString);
  sqlString = "INSERT OR REPLACE INTO users VALUES ('A4', 'COMP2406')"; //Primary username and password
  db.run(sqlString);
  sqlString = "INSERT OR REPLACE INTO users VALUES ('ldnel', 'secret')";
  db.run(sqlString);
});

exports.authenticate = function (request, response, next){
  /*
  Middleware to do BASIC http 401 authentication
  */
  var auth = request.headers.authorization;
  // auth is a base64 representation of (username:password)
  //so we will need to decode the base64
  if(!auth){
    //note here the setHeader must be before the writeHead
    response.setHeader('WWW-Authenticate', 'Basic realm="need to login"');
    response.writeHead(401, {'Content-Type': 'text/html'});
    console.log('No authorization found, send 401.');
    response.end();
  }
  else{
    console.log("Authorization Header: " + auth);
    //decode authorization header
    // Split on a space, the original auth
    //looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part
    var tmp = auth.split(' ');

    // create a buffer and tell it the data coming in is base64
    var buf = new Buffer(tmp[1], 'base64');

    // read it back out as a string
    //should look like 'ldnel:secret'
    var plain_auth = buf.toString();
    console.log("Decoded Authorization ", plain_auth);

    //extract the userid and password as separate strings
    var credentials = plain_auth.split(':');      // split on a ':'
    var username = credentials[0];
    var password = credentials[1];
    console.log("User: ", username);
    console.log("Password: ", password);

    var authorized = false;
    //check database users table for user
    db.all("SELECT userid, password FROM users", function(err, rows){
      for(var i=0; i<rows.length; i++){
        if(rows[i].userid == username & rows[i].password == password) authorized = true;
      }
      if(authorized == false){
        //we had an authorization header by the user:password is not valid
        response.setHeader('WWW-Authenticate', 'Basic realm="need to login"');
        response.writeHead(401, {'Content-Type': 'text/html'});
        console.log('No authorization found, send 401.');
        response.end();
      }
      else
      next();
    });
  }

  //notice no call to next()

}
function addHeader(request, response){
  // about.html
  var title = 'COMP 2406:';
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write('<!DOCTYPE html>');
  response.write('<html><head><title>About</title></head>' + '<body>');
  response.write('<h1>' +  title + '</h1>');
  response.write('<hr>');
}

function addFooter(request, response){
  response.write('<hr>');
  response.write('<h3>' +  'Carleton University' + '</h3>');
  response.write('<h3>' +  'School of Computer Science' + '</h3>');
  response.write('</body></html>');

}



exports.index = function (request, response){
  // index.html
  response.render('index', { title: 'COMP 2406', body: 'rendered with handlebars'});
}

function parseURL(request, response){
  var parseQuery = true; //parseQueryStringIfTrue
  var slashHost = true; //slashDenoteHostIfTrue
  var urlObj = url.parse(request.url, parseQuery , slashHost );
  console.log('path:');
  console.log(urlObj.path);
  console.log('query:');
  console.log(urlObj.query);
  //for(x in urlObj.query) console.log(x + ': ' + urlObj.query[x]);
  return urlObj;

}

exports.users = function(request, response){
  // users.html
  db.all("SELECT userid, password FROM users", function(err, rows){
    response.render('users', {title : 'Users:', userEntries: rows});
  })

}

exports.recipes = function (request, response){ //Displays list of recipes (in database)
  // find.html
  var urlObj = parseURL(request, response);
  var sql = "SELECT id, recipe_name FROM recipes";

  if(urlObj.query['recipe_name']) {
    console.log("finding recipe name: " + urlObj.query['recipe_name']);
    sql = "SELECT id, recipe_name FROM recipes WHERE recipe_name LIKE '%" +
    urlObj.query['recipe_name'] + "%'";
  }

  db.all(sql, function(err, rows){
    response.render('recipes', {title: 'Recipes:', recipeEntries: rows}); //Utilizes handlebars to display all recipeEntries
  });
}
exports.recipeDetails = function(request, response){ //Displays all attributes of the selected recipe in a seperate page

  var urlObj = parseURL(request, response);
  var recipeID = urlObj.path;
  recipeID = recipeID.substring(recipeID.lastIndexOf("/")+1, recipeID.length);

  var sql = "SELECT id, recipe_name, contributor, category, description, spices, source, rating, ingredients, directions FROM recipes WHERE id=" + recipeID;
  console.log("GET RECIPE DETAILS: " + recipeID );

  db.all(sql, function(err, rows){
    console.log('Recipe Data');
    console.log(rows);
    response.render('recipeDetails', {title: 'Recipes Details:', recipeEntries: rows});
  });

}

exports.searchRecipes = function (request, response){ //Deals with the submit button being pressed, searches through database using user input
  let usrObj = JSON.parse(request.query.ingredients); //Ingredient that user entered
  var db = new sqlite3.Database('recipes.db'); //Referencing the database
  var recipeResults = [];
  var userInputs = [];
  var flag = false;
  console.log("Ingredient: " + usrObj.ingredientType);
  if(!usrObj.ingredientType) {
    return response.json({message: 'Please enter an ingredient'}) //User has not entered an ingredient
  }
  if(usrObj.ingredientType.includes(',')){ //Checks for a comma, this tells us that user entered multiple spices/ingredients
    console.log("Found a comma");
    userInputs = usrObj.ingredientType.split(','); //Fill userInputs string array
  }
  else{
    userInputs.push(usrObj.ingredientType); //Simply adds the only user input into the array
  }
  var sql = "SELECT id, recipe_name, contributor, category, description, spices, source, rating, ingredients, directions FROM recipes"; //Select everything from recipes
  db.all(sql, function(err, rows){
    for(var i=0; i<rows.length; i++){ //Loop through all recipes
      flag = false;
      for(var j=0; j<userInputs.length; j++) { //Loop through user inputs
        if(usrObj.type == "spice"){ //If the selection was spice
          if(rows[i].spices.toLowerCase().includes(userInputs[j].toLowerCase())){
            flag = true; //Found a match with the DB recipe and the user input
          }
          else{
            flag = false; //No match
            break;
          }
        }
        else{ //If the selection was ingredient
          if(rows[i].ingredients.toLowerCase().includes(userInputs[j].toLowerCase())){
            flag = true; //Found a match with the DB recipe and the user input
          }
          else{
            flag = false; //No match
            break;
          }
        }
      }
      if(flag == true){
        recipeResults.push(rows[i]); //Add recipes that fit the criteria entered by the user
      }
    }
    if(recipeResults.length == 0){
      recipeResults.push({id: -1, recipe_name: "No Recipes Found."});
      response.send(recipeResults);
    }
    else{
      response.send(recipeResults); //Sends data to the client script.js in the views directory
    }
  });
}

//Adds all XML recipes to TEXT file and the database

function writeRecipesToDatabase(recipes){ //Writes all recipes to database
  var db = new sqlite3.Database('recipes.db');
  db.serialize(function() {

    //drop existing table from database
    var sqlString = "DROP TABLE IF EXISTS recipes";
    db.run(sqlString);
    //create table in the current database
    sqlString = "CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY, recipe_name TEXT, contributor TEXT, category TEXT, description TEXT, spices TEXT, source TEXT, rating TEXT, ingredients TEXT, directions TEXT)";

    db.run(sqlString);
    //use prepared statements to help prevent sql injection
    /*
    Prepared statements consist of SQL with ? parameters for data.
    Prepared statements are pre-compiled as SQL so that one cannot
    insert, or inject, SQL commands for the ? parameters.*/

    var stmt = db.prepare("INSERT INTO recipes (id, recipe_name, contributor, category, description, spices, source, rating, ingredients, directions) VALUES (?,?,?,?,?,?,?,?,?,?)");
    for (var i = 0; i < recipes.length; i++) {
      recipe = recipes[i];
      stmt.run(recipe.id, recipe.recipe_name, recipe.contributor, recipe.category, recipe.description, recipe.spices, recipe.source, recipe.rating, recipe.ingredients, recipe.directions);
    }
    stmt.finalize();
  });
  db.close();
}

//FILE PARSING CODE
function isTag(input){
  return input.startsWith("<");
}
function isOpeningTag(input){
  return input.startsWith("<") && !input.startsWith("</");
}
function isClosingTag(input){
  return input.startsWith("</");
}

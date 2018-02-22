//Author: Zachary Seguin

const express = require('express');
const app = express();
const requestModule = require('request');
const PORT = process.env.PORT || 3000
const API = 'f33afc52316f13ae9f4a8df40f6afe64' //PUT IN YOUR OWN KEY HERE
//Middleware
app.use(express.static(__dirname + '/client')) //static server

app.get('/recipes', (request, response) => { //Loads regular page without any queries
  response.sendFile(__dirname + '/client/recipes.html');
})

app.get('/', (request, response) => { //Loads regular page without any queries
  response.sendFile(__dirname + '/client/recipes.html');
})

app.get('/recipeButton', (request, response) => { //Loads recipe data using user entered data
  let ingredient = request.query.ingredients; //Ingredient that user entered
  if(!ingredient) {
    return response.json({message: 'Please enter an ingredient'}) //User has not entered an ingredient
  }
  const url = `http://www.food2fork.com/api/search?q=${ingredient}&key=${API}`//URL for food2fork
  requestModule.get(url, (err, res, data) => {
    var tempRecipeArr = JSON.parse(data); //Temporarily storing received JSON data
    return response.contentType('application/json').json(tempRecipeArr); //Sends array of objects to client
  })
})

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
  }
})

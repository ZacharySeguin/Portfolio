//Author: Zachary Seguin

const MAX_SIZE = 20; //Max amount of recipes displayed on page

function getRecipe() { //Called when the button is clicked
  clearRecipes(); //Clears previous recipes (if button is pressed twice)
  let ingredientName = document.getElementById('ingredient').value //Grabs user input
  let selection = document.getElementById('option').value
  var message = {};
  if(ingredientName === '') {
    return alert('Please enter an ingredient') //Checks for user input
  }
  else{
    let ingredientDiv = document.getElementById('recipe')
    ingredientDiv.innerHTML = ''
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) { //Server has returned
        let response = JSON.parse(xhr.responseText);
        console.log(response)
        for(var i=0; i<response.length; i++){ //Add all recipes to page
          if(response[i].id == -1){
            ingredientDiv.innerHTML = ingredientDiv.innerHTML +
            "<p>No recipes found.</p>"
          }
          else{
            ingredientDiv.innerHTML = ingredientDiv.innerHTML +
            "<p><a href= 'recipe/" + response[i].id + "'>" + response[i].id + response[i].recipe_name + "</a></p>" //Lists all recipes passed by server
          }
        }
      }
    }
    message = {type: selection, ingredientType: ingredientName};
    console.log("Message: " + message);
    xhr.open('GET', `/recipeButton?ingredients=${JSON.stringify(message)}`, true) //Send data to server
    xhr.send()
  }
}

//Attach Enter-key Handler
const ENTER=13
document.getElementById("ingredient")
addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === ENTER) { //Allows for the same functionality of clicking
    document.getElementById("submit").click();
  }
});

function clearRecipes() //Clears all recipes on the page
{
  if(document.getElementById("recipe").innerHTML != null){ //If there are recipes on page
    document.getElementById("recipe").innerHTML = "";
  }
}

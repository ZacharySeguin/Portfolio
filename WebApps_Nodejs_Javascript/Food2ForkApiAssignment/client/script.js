//Author: Zachary Seguin

const MAX_SIZE = 20; //Max amount of recipes displayed on page

function getRecipe() { //Called when the button is clicked
    clearRecipes(); //Clears previous recipes (if button is pressed twice)
    let ingredientName = document.getElementById('ingredient').value //Grabs user input
    if(ingredientName === '') {
        return alert('Please enter an ingredient') //Checks for user input
    }
    else{
        let ingredientDiv = document.getElementById('recipe')
        ingredientDiv.innerHTML = ''
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => { //Called when the request receives a response from server
            if (xhr.readyState == 4 && xhr.status == 200) { //Server has returned
                let response = JSON.parse(xhr.responseText) //Parse data from JSON string to obj
                if(response.count >= MAX_SIZE){
                    for(var i=0; i<MAX_SIZE; i++){ //Add recipes to page
                        ingredientDiv.innerHTML = ingredientDiv.innerHTML +
                        `<div class="recipe">` +
                        '<a href="' + response.recipes[i].source_url + '" target="_blank">' +
                        '<img src="' + response.recipes[i].image_url + '"/><br/>' +
                        response.recipes[i].title + '</a></div>'
                    }
                }
                else{
                    for(var i=0; i<response.count; i++){ //Add all recipes to page
                        ingredientDiv.innerHTML = ingredientDiv.innerHTML +
                        `<div class="recipe">` +
                        '<a href="' + response.recipes[i].source_url + '" target="_blank">' +
                        '<img src="' + response.recipes[i].image_url + '"/><br/>' +
                        response.recipes[i].title + '</a></div>'
                    }
                }
            }
        }
        xhr.open('GET', `/recipeButton?ingredients=${ingredientName}`, true) //Send data to server
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

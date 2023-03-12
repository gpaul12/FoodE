var drinkIngredientsEl = document.getElementById("drinkIngredients");
var mealIngredientsEl = document.getElementById("mealIngredients");
var getFoodleButton = document.getElementById("get-foodle");
var mealPictureEl = document.getElementById("mealPicture");
var drinkPictureEl = document.getElementById("drinkPicture");
var saveButton = document.getElementById('save-button');
var clearButton = document.getElementById('clear-button');
var myFoodles = [];
var mealResult;
var drinkResult;

var modalInstructionsEl = document.getElementById("modal-instructions");
var modalFoodtitleEl = document.getElementById("modal-food-title");
var modalMealPicEl = document.getElementById("modal-meal-picture");
var modalDrinkPicEl = document.getElementById("modal-drink-image-container");
var modalMealIngEl = document.getElementById("modal-ingredients");

getFoodleButton.addEventListener("click", function () {
  // need to add code to clear out the previous foodle search before rendering the new one
  mealResult = getRandomMeal();
  drinkResult = getRandomDrink();

  console.log('results', mealResult, drinkResult);
});

saveButton.addEventListener('click', function() {

  var myFoodle = {
    mealIngredients: mealResult,
    drinkIngredients: drinkResult,
  };

  console.log('myFoodle', myFoodle);

  var storedFoodles = JSON.parse(localStorage.getItem("myFoodles"));

  if (storedFoodles !== null) {
    myFoodles = storedFoodles;
  }

  myFoodles.push(myFoodle);
  localStorage.setItem('myFoodles', JSON.stringify(myFoodles));
});

clearButton.addEventListener('click', function(){
  localStorage.removeItem('myFoodles');
});

function getRandomMeal() {
  var requestRecipe = "https://www.themealdb.com/api/json/v1/1/random.php";
  var mealIngredients = [];

  fetch(requestRecipe).then(function (response) {
    return response.json().then(function (data) {
      // console.log("random recipe", data);
      // console.log("mealname", data.meals[0].strMeal);
      // console.log("mealpicture", data.meals[0].strMealThumb);
      // console.log("mealrecipe", data.meals[0].strInstructions);
      // console.log('mealingredients', data.meals[0].strMeal);
      modalMealPicEl.setAttribute("src", data.meals[0].strMealThumb);
      modalInstructionsEl.textContent = data.meals[0].strInstructions;
      modalFoodtitleEl.textContent = data.meals[0].strMeal;
      

      var mealData = data.meals[0];
      for (var key in mealData) {
        if (key.startsWith("strIngredient")) {
          if (!mealData[key]) {
            delete mealData[key];
          } else {
            var singleMealIngredient = mealData[key];
            mealIngredients.push(singleMealIngredient);
          }
        }
      }
      renderMealIngredients(mealIngredients);
      mealPictureEl.setAttribute("src", data.meals[0].strMealThumb);

    });
  });
  return mealIngredients;
}

function renderMealIngredients(mealIngredients) {
  var mealIngredientsHeading = document.createElement("h2");
  mealIngredientsHeading.textContent = "Meal Ingredients";
  mealIngredientsEl.appendChild(mealIngredientsHeading);

  for (var i = 0; i < mealIngredients.length; i++) {
    var mealIngredientEl = document.createElement("p");
    mealIngredientEl.textContent = mealIngredients[i];
    mealIngredientsEl.appendChild(mealIngredientEl);
  }
}

function getRandomDrink() {
  var requestUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
  var drinkIngredients = [];

  fetch(requestUrl).then(function (response) {
    return response.json().then(function (data) {
      // console.log("strDrink", data.drinks[0].strDrink);
      // console.log("strDrink", data.drinks[0].strInstructions);
      // console.log("strDrink", data.drinks[0].strDrinkThumb);
      // console.log("strDrink", data.drinks[0].strGlass);
      modalDrinkPicEl.setAttribute("src", data.drinks[0].strDrinkThumb);


      var drinkData = data.drinks[0];
      for (var key in drinkData) {
        if (key.startsWith("strIngredient")) {
          if (!drinkData[key]) {
            delete drinkData[key];
          } else {
            var singleIngredient = drinkData[key];
            drinkIngredients.push(singleIngredient);
          }
        }
      }
      renderDrinkIngredients(drinkIngredients);
      drinkPictureEl.setAttribute("src", data.drinks[0].strDrinkThumb);
    });
  });
  return drinkIngredients;
}

function renderDrinkIngredients(ingredients) {
  var drinkIngredientsHeading = document.createElement("h2");
  drinkIngredientsHeading.textContent = "Drink Ingredients";
  drinkIngredientsEl.appendChild(drinkIngredientsHeading);

  for (var i = 0; i < ingredients.length; i++) {
    var ingredientEl = document.createElement("p");
    ingredientEl.textContent = ingredients[i];
    drinkIngredientsEl.appendChild(ingredientEl);
  }
}
//code for Bulma modal
document.addEventListener("DOMContentLoaded", () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add("is-active");
  }

  function closeModal($el) {
    $el.classList.remove("is-active");
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener("click", () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (
    document.querySelectorAll(
      ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
    ) || []
  ).forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) {
      // Escape key
      closeAllModals();
    }
  });
});

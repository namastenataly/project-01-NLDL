// hello!

// Here is our Javascript for our Recipe and Nutrition website!

// API keys
const ytAPIKey = "AIzaSyCawopGL82AFkgjtzzGG56lw1ZIb4HZcmQ";

const spoonAPIKey = `75fbd3ac66284b7e9e621722cddc49f9`;

const NatLuisLizDomAPIKey = `69a78db739a642a7872981d09f236e5a`;


// Modal selectors
const modalEl = document.getElementById(`search-modal`);
const modalButton = document.getElementById(`modal-button`);
const modalClose = document.getElementById(`close-modal`);
const formClose = document.getElementById(`close-form`);
const vegetarianDivEl = document.getElementById(`vegetarian-div`);

// User input form selectors
const inputEl = document.getElementById(`input-ingredient`);
const formEl = document.getElementById(`search-form`);
const selectEl = document.getElementById(`search-select`);
const addIngEl = document.getElementById(`add-ingredient-button`);
const addIngDivEl = document.getElementById(`ing-button-div`);
const formInputsDivEl = document.getElementById(`form-inputs`);
const isVegetarianEl = document.getElementById(`vegetarian-check`);

//extra ingredients selectors
const ingredientEl = document.getElementsByClassName(`input`);

// Recipe displays
const recipeNameEl = document.getElementById(`recipe-name`);
const recipeInfoEl = document.getElementById(`recipe-info`);
const recipeIngEl = document.getElementById(`recipe-ingredients`);
const recipePicEl = document.getElementById(`recipe-picture`);
const recipeSumBoxEl = document.getElementById(`recipe-info-container`);
const ytVidEl = document.getElementById(`yt-video`);
const favButtonEl = document.getElementById(`fav-button`);
const favDivEl = document.getElementById(`favourites`);
const recipeSummaryEl = document.getElementById(`recipe-summary`);

//created buttons
const createdRecipesEl = document.getElementById(`recipe-buttons`);
const createdButtonsEl = document.getElementsByClassName(`created-buttons`);

//dark mode toggles
const modeBtn = document.querySelector("#mode-toggle");
const bodyEl = document.querySelector("body");
// const bodyEl = document.getElementById("#body2");

// Changing page elements
const homePage = document.querySelector("#homePage");
const gitHubPage = document.querySelector("#gitPage");

//
// PUTTING ALL ONLOAD FUNCTIONS FIRST, TO MINIMISE SLOW DOM LOAD
//

//displaying favourited recipes
function displayFavouritesOnStartup() {
  // console.log(savedRecipes);

  for (let i = 0; i < savedRecipes.length; i++) {
    let favButtonEl = document.createElement(`button`);
    favButtonEl.classList = `button created-buttons is-clipped is-link`;
    favButtonEl.setAttribute(`id`, savedRecipes[i].id);
    favButtonEl.textContent = savedRecipes[i].name;

    let favLiEl = document.createElement(`li`);
    favLiEl.appendChild(favButtonEl);
    favDivEl.appendChild(favLiEl);
  }
  buttonInit();
}

//carousel js
function displayCarousel() {
  let randomAPI = `https://api.spoonacular.com/recipes/random?number=13&apiKey=${NatLuisLizDomAPIKey}`;

  fetch(randomAPI)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network response was not ok.");
      }
    })
    .then(function (data) {
      console.log(data);
      carouselData(data);
    })
    .catch(function (error) {
      console.log(
        "There was a problem with the fetch operation: ",
        error.message
      );
    });
}

// FUNCTION TO LOAD FETCH DATA ONTO CAROUSEL
const imgEl = document.getElementsByClassName("imgs");
const titleEl = document.getElementById("recipeTitle");
function carouselData(data) {
  console.log(imgEl);
  for (let i = 0; i < data.recipes.length; i++) {
    const imageUrl = data.recipes[i].image;
    const titleName = data.recipes[i].title;
    imgEl[i].setAttribute("src", imageUrl);
    imgEl[i].setAttribute("data-title", titleName);
    titleEl.textContent = titleName;
  }
}

// initializing the swiper object and creating "coverflow" to get the carousel we want
const TrendingSlider = new Swiper(".trending-slider", {
  effect: window.innerWidth <= 768 ? "cards" : "coverflow",
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  slidesPerView: "auto",
  slideShadows: true,
  coverflowEffect: {
    rotate: 0,
    scale: 1,
    stretch: -20,
    depth: 100,
    modifier: 4,
  },
  // Changes the title above to the corresponding slide underneath
  on: {
    slideChange: function () {
      const activeSlideIndex = this.activeIndex;
      const activeSlideTitle =
        imgEl[activeSlideIndex].getAttribute("data-title");
      titleEl.textContent = activeSlideTitle; // Update title based on active slide
    },
  },
});

displayCarousel();

// FUNCTION TO HAVE NAVBURGER BECOME ACTIVE IN MEDIA QUERY
document.addEventListener("DOMContentLoaded", function () {
  // Get all "navbar-burger" elements
  const navbarBurgers = document.querySelectorAll(".navbar-burger");

  // Attach click event listener to each navbar burger
  for (let i = 0; i < navbarBurgers.length; i++) {
    const el = navbarBurgers[i];
    el.addEventListener("click", function () {
      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const targetElement = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle("is-active");
      targetElement.classList.toggle("is-active");
    });
  }
});

//
// BELOW ARE NON-ONLOAD FUNCTIONS, THEY DO NOT NEED TO BE LISTED AT THE TOP
//
//amount of extra ingredients allowed to be added
const maxAdd = 2;
let clicked = 0;

//local data checker
let matched = 0;

//recipe tracker for button clicks
let displayedRecipe = {
  id: ``,
  name: ``,
};

//grabbing and stored data
let savedRecipes = JSON.parse(localStorage.getItem(`recipes`));
if (savedRecipes === null) {
  savedRecipes = [];
}

//function opens modal
function openModal() {
  modalEl.classList.add(`is-active`);
}

//function closes modal
function closeModal() {
  modalEl.classList.remove(`is-active`);
}

//creating buttons with recipe names from ingredient search
function createButtonsIng(data) {
  for (let i = 0; i < data.length; i++) {
    let name = data[i].title;
    let recipeId = data[i].id;
    let listEl = document.createElement(`li`);
    let buttonEl = document.createElement(`button`);

    buttonEl.textContent = name;
    buttonEl.setAttribute(`id`, recipeId);
    buttonEl.classList = `created-buttons`;

    listEl.appendChild(buttonEl);
    createdRecipesEl.appendChild(listEl);
  }

  //make buttons display info when clicked
  buttonInit();
}

//creating buttons with recipe names from recipe search
function createButtonsRecipe(data) {
  for (let i = 0; i < data.results.length; i++) {
    let name = data.results[i].title;
    let recipeId = data.results[i].id;
    let listEl = document.createElement(`li`);
    let buttonEl = document.createElement(`button`);

    buttonEl.textContent = name;
    buttonEl.setAttribute(`id`, recipeId);
    buttonEl.classList = `created-buttons`;

    listEl.appendChild(buttonEl);
    createdRecipesEl.appendChild(listEl);
  }

  buttonInit();
}

//function for when created buttons are clicked
function buttonInit() {
  // console.log(createdButtonsEl);

  for (let i = 0; i < createdButtonsEl.length; i++) {
    createdButtonsEl[i].addEventListener(`click`, function (event) {
      // console.log(`it works`);

      let recipeId = createdButtonsEl[i].id;

      let buttonIDAPI = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${spoonAPIKey}`;

      clearDisplay();
      spoonAPICallerButton(buttonIDAPI);

      // console.log(recipeId);
    });
  }
  // console.log(createdButtonsEl.length);
}

//displaying recipe info
function createRecipeInfo(data) {
  let rName = data.title;
  let rImage = data.image;
  let instructions = data.instructions;
  let summary = data.summary;

  // console.log(summary);

  displayedRecipe = {
    id: data.id,
    name: rName,
  };

  for (let i = 0; i < data.extendedIngredients.length; i++) {
    let instEl = document.createElement(`p`);
    instEl.textContent = data.extendedIngredients[i].original;
    recipeIngEl.appendChild(instEl);
  }
  recipeIngEl.classList = `box`;

  recipeNameEl.textContent = rName;
  recipePicEl.setAttribute(`src`, rImage);

  let recipeInfo = document.createElement("p");
  recipeInfo.innerHTML = summary;
  recipeSummaryEl.appendChild(recipeInfo);
  recipeSummaryEl.classList = `box`;

  let infoEl = document.createElement(`p`);
  infoEl.innerHTML = instructions;
  recipeInfoEl.appendChild(infoEl);
  recipeInfoEl.classList = `box`;

  ytAPICaller(rName);

  favButtonEl.classList.remove(`is-invisible`);
}

//pushing the video onto youtube. we just grab the first result from the api call
function embedVid(data) {
  let vidId = data.items[0].id.videoId;
  // console.log(vidId);

  let ytLink = `https://www.youtube.com/embed/` + vidId;
  // console.log(ytLink);

  ytVidEl.setAttribute(`src`, ytLink);
}

//api caller when form is submitted and ingredients is selected
function spoonAPICallerIng(url) {
  fetch(url)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          // console.log(data);
          createButtonsIng(data);
        });
      } else {
        console.log(`Error: ${response.statusText}`);
      }
    })
    .catch(function (error) {
      console.log(`Unable to connect to API`);
    });
}

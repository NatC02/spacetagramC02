// DOMs
const resultsNav = document.getElementById("resultsNav")
const favoritesNav = document.getElementById("favoritesNav")
const imagesContainer = document.querySelector(".container-cards")
const saveConfirmed = document.querySelector(".save-confirmed")
const loader = document.querySelector(".loader")

// NASA API
const count = 10
const apiKey = "5dIbMbuH7IAAp19JeBF3lXNchHbWKQd9pqY5HZdK"
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`

let resultsArray = []
let favorites = {}

// FUNCTIONS

// Update DOM depending on which page the user is visiting
function updateDOM(page) {
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"))
  }

  imagesContainer.textContent = ""

  createDOMNodes(page)

  showContent(page)
}

// Showing content depending on the page when the data finishes fetching
function showContent(page) {
  window.scrollTo({ top: 0, behavior: "instant" })

  if (page === "results") {
    resultsNav.classList.remove("hidden")
    favoritesNav.classList.add("hidden")
  } else {
    resultsNav.classList.add("hidden")
    favoritesNav.classList.remove("hidden")
  }

  loader.classList.add("hidden")
}

// Create DOM Nodes
function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites)

  currentArray.forEach(result => {
    let saveText = null,
      saveFunc = null
    if (page === "results") {
      saveText = "Add to Favorites"
      saveFunc = `saveFavorite('${result.url}')`
    } else {
      saveText = "Remove Favorite"
      saveFunc = `removeFavorite('${result.url}')`
    }

    const html = `
    <section class="flex justify-center pt-4">
        <div class="rounded-lg shadow-lg bg-white max-w-sm">
          <a href="${result.hdurl}" title="View Full Image" target="_blank"><img src="${result.url}" alt="NASA Picture of the Day" loading="lazy" class="rounded-t-lg"></a>
            <div class="p-6">
              <h2 class="text-gray-900 text-md font-light mb-2">${result.date}</h2>
              <h2 class="text-gray-900 text-xl font-medium mb-2">${result.title}</h2>
          <p class="text-gray-700 text-base mb-4">${result.explanation}</p>
              <button type="button" class=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" onclick="${saveFunc}">${saveText}</button>
        </div>
      </div>
    </section>
    `

    // Adding nodes to the images container
    imagesContainer.insertAdjacentHTML("beforeend", html)
  })
}

// Get 10 images from NASA API for results page (by clicking Load More)
async function getNasaPictures() {
  
  // Show loader
  loader.classList.remove("hidden")

  try {
    const response = await fetch(apiUrl)
    resultsArray = await response.json()

    updateDOM("results")
  } catch (error) {
    console.log(error)
  }
}

// Save pictures to Favorites
function saveFavorite(itemUrl) {

  // animate the save button
  const saveButton = document.querySelector(`button[onclick="saveFavorite('${itemUrl}')"]`)
  saveButton.classList.add("animate__animated", "animate__jello")

  // Loop through Results Array to select Favorite
  resultsArray.forEach(item => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item

      // Display Save Confirmation for 2.5 seconds (lower right corner)
      saveConfirmed.hidden = false
      setTimeout(() => {
        saveConfirmed.hidden = true
      }, 2500)

      // Save to Local Storage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites))
    }
  })
}

// Remove an item from Favorites
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl]

    // Update Loca Storage
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites))

    updateDOM("favorites")
  }
}

// On Load
getNasaPictures()

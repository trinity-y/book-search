// dark mode

let button = document.getElementById("darkModeButton"); // save the element for the dark mode button

// function ran when the button is pressed. takes in which page is running so we can toggle the right elements.
function darkModeButtonPress(page) { //Time complexity: O(1)
    // check if the value is set in localStorage
    if (localStorage.getItem("colour") === null) { // if not, toggle dark mode (since button was pressed we assume the user wants to enter dark mode)
      if (page=="mrca") { // toggle for mrca
        darkModeToggleMrca();
      } else { // or toggle for main page
        darkModeToggle();
      }    
        localStorage.setItem("colour", "dark"); // set the colour in localStorage
        button.innerHTML = "Light Mode"; // change text in button to tell the user that next time they click the button they will enter back into light mode
    } else { // if the value is already set
        if (page=="mrca") { // toggle for mrca
          darkModeToggleMrca();
        } else { // or toggle for main page
          darkModeToggle();
        }
        if (localStorage.getItem("colour") === "light") { // toggle dark mode since the current colour is light mode
            localStorage.setItem("colour", "dark"); // change colour in localStorage
            button.innerHTML = "Light Mode"; // change text in button so the user knows they'll enter light mode the next time they click the button
        } else { // toggle light mode since the current colour is dark mode
            localStorage.setItem("colour", "light"); // change the colour in localStorage
            button.innerHTML = "Dark Mode"; // change text in button so the user knows they'll enter dark mode the next time they click the button
        }
    }
}

// toggle dark mode between light and dark
function darkModeToggle() { //Time complexity: O(n)
    let body = document.getElementById("body"); // body element
    body.classList.toggle("bg-light"); // toggle bg-light class (remove it for dark mode, enable it again on light mode)
    body.classList.toggle("dark-background"); // toggle dark-background class (remove it for light mode, enable on dark mode)
    let searchForm = document.getElementById("searchForm"); // search form element
    searchForm.classList.toggle("dark-gray"); // toggle dark-gray class (remove for light mode, enable on dark mode)
    searchForm.classList.toggle("light-text"); // toggle light-text class (remove for light mode, enable on dark mode)

    let tabBar = document.getElementById("navBar");
    tabBar.classList.toggle("navbar-light");
    tabBar.classList.toggle("navbar-dark");

    try { // try to colour cards (will not execute if they do not exist)
      let resultTitle = document.getElementById("resultTitle");
      resultTitle.classList.toggle("light-text");
      const cards = document.querySelectorAll(".card");
      for (let card of cards) { // toggle dark mode for n cards
        card.classList.toggle("dark-gray");
        card.childNodes[0].childNodes[0].classList.toggle("light-text");
        card.childNodes[0].childNodes[2].classList.toggle("light-text");
      }
    } catch {}
}

function darkModeToggleMrca() { // Time complexity: O(1)
  let body = document.getElementById("body"); // body element
  body.classList.toggle("bg-light"); // toggle bg-light class (remove it for dark mode, enable it again on light mode)
  body.classList.toggle("dark-background"); // toggle dark-background class (remove it for light mode, enable on dark mode)
  let tabBar = document.getElementById("navBar"); // same for navbar
  tabBar.classList.toggle("navbar-dark");
  
  let mrcaText = document.getElementById("mrcaText"); // same for the text description
  mrcaText.classList.toggle("light-text");

  let startUidLabel = document.getElementById("startUidLabel"); // same for the text description
  startUidLabel.classList.toggle("light-text");

  let targetUidLabel = document.getElementById("targetUidLabel"); // same for the text description
  targetUidLabel.classList.toggle("light-text");
}

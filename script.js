/*-----------------------------------

DON'T DELETE THIS

This is the inital data for you project. You MUST use this data. You can use these just like regular variables, don't over think what this line of code is doing.

-----------------------------------*/
// below code is ran on page load
if (localStorage.getItem("colour") === null) { // if colour is not set in localStorage
    localStorage.setItem("colour", "light"); // set the colour to light mode by default
} else { // otherwise the value is set so check if it's light or dark
    if (localStorage.getItem("colour") !== "light") { // if the colour isn't light then toggle to dark mode
        darkModeToggle(); // run function to toggle css classes
        button.innerHTML = "Light Mode"; // change text in button so the user knows they'll enter dark mode the next time they click the button
    }
}

const { firstNames, lastNames, uids, titles, references } = await import('./data.js')
//------------------------------------

// sorted 2d arrays - sorted[0] is an array of sorted values, and sorted[1] is the original index of each element.
let sortedFirst = []; 
let sortedLast = [];
let sortedUids = [];
let sortedTitles = [];
let sortedReferences = [];

let infotext = document.getElementById("infotext");
infotext.innerText = "Sorting data (First names)...";


let preSortTime = performance.now();
sortedFirst = indexArray(firstNames); //creates 2D array storing all firstNames values, and their indexes
infotext.innerText = "Sorting data (Last names)...";
sortedFirst = mergeSort(sortedFirst); //sort elements of firstNames, while also sorting index values accordingly

sortedLast = indexArray(lastNames); //creates 2D array storing all lastNames values, and their indexes
sortedLast = mergeSort(sortedLast);//sort elements of lastNames, while also sorting index values accordingly
infotext.innerText = "Sorting data (UIDs)...";
sortedUids = indexArray(uids); //creates 2D array storing all uids values, and their indexes
sortedUids = mergeSort(sortedUids);//sort elements of uids, while also sorting index values accordingly

infotext.innerText = "Sorting data (Titles)...";
sortedTitles = indexArray(titles); //creates 2D array storing all titles values, and their indexes
sortedTitles = mergeSort(sortedTitles);//sort elements of titles, while also sorting index values accordingly

sortedReferences = sortParallel(sortedUids, indexArray(references));

let sortTime = performance.now() - preSortTime;
infotext.innerText = "Sorting completed in " + (sortTime/1000).toFixed(2) + "s"; // displays

// Removes the loading screen
setTimeout(_=>document.getElementById("loadingCover").style.top = "-100vh", 0);

// VARS
let searchMode = "First Name";  
let searchArr = sortedFirst;
let searchedRange = [0, 0];


// convert strings to first letter capitalized (formatting of all strings), or all lower case (for UIDs)
String.prototype.toProperCase = function () {
  if (!this.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)) { // make sure we're not running this on a uid
    return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase(); // return uppercased first char + lowercase rest of string
  } else { // if we are running this on a uid
    return this.toLowerCase(); // let's return the uid lowercased, so it can be properly searched
  }
};

// SORT
function merge(arr1, arr2){ // returns sorted 2d array storing values and then indexes //Time complexity: O(n)
    let sorted = [[], []]; // declare the empty 2d array

    while (arr1[0].length !== 0 && arr2[0].length !== 0) {  // while none of the lists are empty
        if (arr1[0][0] < arr2[0][0]) { // compare the values from the top of both arrays. if arr1 is less than arr 2:
            sorted[0] = pushArr(sorted[0],arr1[0]); // put arr1's first element (smaller value) onto the sorted arr
            arr1[0] = shiftArr(arr1[0]); // deletes this element from arr1
            sorted[1] = pushArr(sorted[1],arr1[1]); // adds the index value to the 2d array as well
            arr1[1] = shiftArr(arr1[1]); // deletes this element from the list
        } else { // if arr2 is less than arr1, do the same thing but for that element
            sorted[0] = pushArr(sorted[0],arr2[0]);
            arr2[0] = shiftArr(arr2[0]);
            sorted[1] = pushArr(sorted[1],arr2[1]);
            arr2[1] = shiftArr(arr2[1]);
        }
    }
    return [[...sorted[0], ...arr1[0], ...arr2[0]], [...sorted[1], ...arr1[1], ...arr2[1]]]; // return sorted 2d array
}

function mergeSort(arr){ //Time complexity: O(n logn)
    if (arr[0].length <= 1) { // arr[0] for 2d array (either would work since it's the same length). if the length of this subarr is smaller/equal to 1, the arr is 'sorted' and cannot be split further, so return the array.
        return arr;
    }
    let mid = Math.floor(arr[0].length/2);  // get midpoint to slice the array  in half
    let leftArr = [[],[]]; // intialize 2d array  for left
    leftArr[0] = sliceArr(arr[0],0,mid);  // get left half of arr (index from 0 to mid)
    leftArr[1] = sliceArr(arr[1],0,mid); // repeat for index list
    let left = mergeSort(leftArr);
    let rightArr = [[],[]]; // initialize 2d array for right
    rightArr[0] = sliceArr(arr[0],mid,arr[0].length); // get right half of arr (mid to end of list)
    rightArr[1] = sliceArr(arr[1],mid,arr[0].length); // repeat for index list
    let right = mergeSort(rightArr);

    return merge(left, right); // sort the split array
}

function indexArray(arr){ // returns 2d array with initial indexes //Time complexity:O(n)
  let returnArr = [arr, []];// initialize array with passed 1d array and an empty array for indexes
  for(let i = 0; i < arr.length; i++){ // for every element
    returnArr[1][i] = i; // increment index no. by one and add to list
  }
  return returnArr;
}

function sortParallel(sortedArr,parallelArr){ // returns a parallel array's own 2d list based off of the sorted array's indexes //Time complexity:O(n)
  let returnArr = [[], parallelArr[1]]; // set up 2d array with indexes (would be the same order as parallel array)
  for(let i = 0; i < sortedArr[0].length; i++){ // for each element in the array
    returnArr[0][i] = parallelArr[0][sortedArr[1][i]]; // the element should equal to the parallel array's value at the index specified in the sorted array
  }
  return returnArr;
}

// SEARCH
// arr must be 1d (i.e pass sortedFirst[0])
function binarySearch(arr, target, accessor = (v)=>{return v}) { //Time complexity: O(log n)
  let right = arr.length - 1; //right value of search parameter
  let left = 0;//left value of search parameter
  while(left <= right){ //run while right value comes after left, meaning there is a chance the target is in the array
    let mid = Math.floor((right + left)/2); //set mid point at the middle of search parameter
    if (accessor(arr[mid]) == target){ //check if value at mid point is equal to target
      left = mid;
      right = mid;
      // check left and right neighbours to see if they are also the target.
      while (accessor(arr[left-1]) === target){ //keep moving backwards until we hit something that is not the target
        left--;
      }
      while (accessor(arr[right+1]) === target) {
        right++;
      }
      return [left, right]; // return a range of left to right values that fit the target
    }
    else if (accessor(arr[mid]) < target){ //check if value at mid point is less than target
      left = mid + 1; //move left point one more than mid
      
    }
    else if (accessor(arr[mid]) > target){//check if value at mid point is more than target
      right = mid - 1;//move right point one less than mid
      
    }
  }
  return null;//if target is not in array, return -1
}


// ARRAY FUNCTIONS
function pushArr(arr, arr2){ // appends the first element of arr2 to arr1 //Time complexity:O(1)
  let n = arr.length; 
  arr[n] = arr2[0]; // length, or last index, is equal to the first element of arr2
  
  return arr;
}

function shiftArr(arr){ // removes first element from array //Time complexity:O(n)
  for (let i = 0; i < arr.length; i++){ //loops through array, moving each element down one index
    arr[i] = arr[i+1];
  }
  arr.length--; //cuts the length of the array by one
  
  return arr;
}

function sliceArr(arr, start, end){ // returns 'slice' of arr from start index to end index //Time complexity: O(n)
  let returnArr = []; // initialize empty array to rteturn
  for (let i = 0; i < end-start; i++){ // for the length of the new arr (which would equal to end index minus start index)
    returnArr[i] = arr[start+i]; // start copying from the start index
  }
  return returnArr;
}

function swap(arr, a, b){ // swap the values of indexes a and b in an array //Time complexity: O(1)
  let temp = arr[a]; 
  arr[a] = arr[b];
  arr[b] = temp;
  return arr;
}


// Returns the value clamped between the min and max
function clamp(value, min, max) { //Time complexity: O(1)
  return Math.min(Math.max(value, min), max); 
}

// DISPLAYING

// Perform the search, then update the viewer to match
function search(query) { //Time complexity: O(1)
  let startTime = performance.now() // start performance timer
  let infotext = document.getElementById("infotext")
  infotext.innerText = "Searching..."// gives loading feedback to user

  searchedRange = binarySearch(searchArr[0], query.toProperCase()); // gets range of indexes of matching values [l, r] using the proper array and re-formatted input (so it's not case sensitive)

  let endTime = performance.now() - startTime; // get performance time
  infotext.innerText = "Search completed in " + endTime.toFixed(2) + "ms"; // display performance time (to 2 decimal places)
  updateViewer(searchedRange, searchArr); // generate carousel with the indexes of matching values and the searched array
}

// Gets all the information for an index and returns it in an object 
function getData(index) { //Time complexity: O(1)
  return {
    fname: firstNames[index],
    lname: lastNames[index],
    title: titles[index],
    uid: uids[index],
    references: references[index],
    index: index
  }
}

function insertionSortByValue(array, value) { // sort an array of objects by value using insertion sort - O(n^2)

  for (let i = 1; i < array.length; i++) { // loop through the array
    if (array[i - 1][value] > array[i][value]) { // if item before current is larger than current item
      for (let j = i; j >= 1; j--) { // loop backwards from current position to beginning of array
        if (array[j - 1][value] > array[j][value]) { // check if item is still larger than current item
          array = swap(array, j, j-1); // swap the elements if the item is larger, moving it back a spot
        }
      }
    }
  }
  return array; // return final sorted array
}

// inserts result carousel once results are fetched
function generateCarousel() { //Time complexity: O(1)
  let container = document.getElementById("mainCol");
  container.innerHTML += '<section class="pb-5 pt-5"><div class=container><div class=row><div class=col-6><h3 class=mb-3 id="resultTitle"></h3></div><div class=col-6><a class="mb-3 btn btn-primary mr-1"data-bs-slide=prev href=#results-two role=button><i class="fa fa-arrow-left"></i></a> <a class="mb-3 btn btn-primary"data-bs-slide=next href=#results-two role=button><i class="fa fa-arrow-right"></i></a></div><div class=col-12><div class="carousel slide"data-bs-interval=false data-bs-ride=false data-bs-wrap=false id=results-two><div class=carousel-inner></div></div></div></div></div></section>'; // insert initial container HTML into the main column of the page
  let resultTitle = document.getElementById("resultTitle"); // store result title element
  if (localStorage.getItem("colour") === "dark") { // if we are in dark mode
    resultTitle.classList.toggle("light-text"); // toggle text to be light colour
  }
}

function updateViewer(searchedRange, searchArr) { //Time complexity: O(n)

  if (!document.getElementById("resultTitle")) {
    generateCarousel(); // checks if element exists so that it won't regenerate the carousel each time, because carousel generation appends to innerHTML.
  }
  let resultTitle = document.getElementById("resultTitle"); // gets the result title element
  let carouselInner = document.querySelector(".carousel-inner"); 
  if (searchedRange) { // if range exists (?)
    const rangeBegin = searchedRange[0]; // start index of matching values
    const rangeEnd = searchedRange[1]; // end index of matching values
    resultTitle.innerText = `Results (${rangeEnd+1 - rangeBegin}):`; // show how many results there are in the result area
    carouselInner.innerHTML = ''; // reset the innerHTML of the carousel area, so that we can add the new results
    let fetchedData = []; // initialize the fetchedData array
    for (let i = rangeBegin; i <= rangeEnd; i++) { // loop through all of the search results
      let fetched = getData(searchArr[1][i]); // fetch the data of each search result
      fetchedData[i-rangeBegin] = fetched; // store it in the array
    }
    if (searchMode === "First Name") {
      let sortedFetchedData = insertionSortByValue(fetchedData, 'lname'); // sort the fetched data alphabetically by first name
    } else if (searchMode === "Last Name") {
      let sortedFetchedData = insertionSortByValue(fetchedData, 'fname'); // sort the fetched data alphabetically by last name
    } else if (searchMode === "Book Title") {
      let sortedFetchedData = insertionSortByValue(fetchedData, 'title'); // sort the fetched data alphabetically by book title
    } else {
      let sortedFetchedData = insertionSortByValue(fetchedData, 'uid'); // sort the fetched data alphabetically by book title
    }
    for (const fetched of fetchedData) { // loop through the fetched data
      carouselInner.innerHTML += `<div class=carousel-item><div class=row><div class="col-md-12"><div class=card><div class=card-body><h5 class=card-title>${fetched.title}</h5><p class=card-text><ul><li class=list-text><b>Author Name: </b>${fetched.fname} ${fetched.lname}<li class=list-text><b>UID: </b><a title='MRCA with this UID' href='mrca.html?fromUID=${fetched.uid}'><code>${fetched.uid}</code></a><li class=list-text><b>References:</b><ul id=references-${fetched.uid}></ul></ul></div></div></div></div></div>`; // append html to the inside of the carousel containing the card with the book information
      let references = document.getElementById(`references-${fetched.uid}`); // store the reference list element
      for (let i = 0; i < 10; i++) { // there will be exactly 10 references each time
        let referenceFetched = getData(sortedUids[1][binarySearch(sortedUids[0], fetched.references[i])[0]]); // get the data of each reference (search sortedUids for the reference uid, then fetch the data)
        references.innerHTML += `<li>${referenceFetched.lname}, ${referenceFetched.fname} (<code>${referenceFetched.uid}</code>)</li>`; // append a new bullet point to the reference list with the last name, first name, and uid
      }
    }
    } else { // there are no results
      resultTitle.innerText = "No Results"; // tell the user there's no results
      carouselInner.innerHTML = `<div class=carousel-item><div class=row><div class="col-md-12"><div class=card><div class=card-body><p>Nothing ,'-(</p><div></div></div></div></div></div></div>`; // show an error message
    }
  const cards = document.querySelectorAll(".card"); // store list of all the card elements in the carousel
  if (localStorage.getItem("colour") === "dark") { // if we're in dark mode
    for (let card of cards) { // loop through all of the cards so we can toggle dark mode classes for them all
      card.classList.toggle("dark-gray"); // dark gray background
      card.childNodes[0].childNodes[0].classList.toggle("light-text"); // light text for the title
      card.childNodes[0].childNodes[2]?.classList.toggle("light-text"); // light text for the information about the book (only if it exists!)
    }
  }
  carouselInner.childNodes[0].classList.toggle("active"); // make the first card active so that it's actually shown to the user...
}


function selectSearchMode() { //Time complexity: O(1)
  let mode = document.getElementById("searchType").value;
  switch(mode) {
    case "First Name":
      searchArr = sortedFirst
      break;
    case "Last Name":
      searchArr = sortedLast
      break;
    case "Book Title":
      searchArr = sortedTitles
      break;
    case "UID":
      searchArr = sortedUids
      break;
  }
  this.searchMode = mode;
}

window.Program = { //the script is being included as a module so the variables and functions aren't accessible through the console so i just put them in an object
  swap,
  binarySearch,
  clamp,
  merge,
  mergeSort,
  pushArr,
  shiftArr,
  sliceArr,
  indexArray,
  sortParallel,
  search,
  searchMode,
  selectSearchMode,
  getData,
  generateCarousel,
  get searchedRange() {return searchedRange},
}

if (firstNames && sortedFirst) {
  window.Program.data={ 
    sortedFirst, 
    sortedLast, 
    sortedUids, 
    sortedTitles,
    firstNames,
    lastNames,
    titles,
    uids,
    references
  }
}
else {
  console.log("No source array found")
}


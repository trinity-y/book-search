if (localStorage.getItem("colour") === null) { // if colour is not set in localStorage
    localStorage.setItem("colour", "light"); // set the colour to light mode by default
} else { // otherwise the value is set so check if it's light or dark
    if (localStorage.getItem("colour") !== "light") { // if the colour isn't light then toggle to dark mode
        
      darkModeToggleMrca(); // run function to toggle css classes
        button.innerHTML = "Light Mode"; // change text in button so the user knows they'll enter dark mode the next time they click the button
    }
}

/*-----------------------------------

DON'T DELETE THIS

This is the inital data for you project. You MUST use this data. You can use these just like regular variables, don't over think what this line of code is doing.

-----------------------------------*/
const { uids, references } = await import('./data.js')
//------------------------------------

let sortedUids = [];
let sortedReferences = [];
let performanceTime = document.getElementById("performanceTime");
// update to dark mode settings


let preSortTime = performance.now(); // start timing mrca sorts

sortedUids = indexArray(uids); //creates 2D array storing all uids values, and their indexes
sortedUids = mergeSort(sortedUids);//sort elements of uids, while also sorting index values accordingly

sortedReferences = sortParallel(sortedUids, indexArray(references));

let sortTime = performance.now() - preSortTime; // end timing mrca sorts
performanceTime.innerText = `Sorted in ${sortTime.toFixed(2)} ms.`;

// remove the loading screen
setTimeout(_=>document.getElementById("loadingCover").style.top = "-100vh", 0)



function bfs(startUIDIndex, target) {
  let queue = [startUIDIndex]; // the next nodes that we have to visit
  let visited = []; // will keep track if entry i is visited at visited[i] so we don't revisit and loop
  let tiers = 0; 
  let distance = 0; // keeps track of how many nodes we've visited in the tier so we know that we've visited all nodes the tier
  let currNode; // the index from the front of the queue
  let neighbourIndex; // the index of the current
  while (queue.length > 0) { 
    currNode = queue[0]; // get node 
    queue = shiftArr(queue); // get rid of node from queue
    if (sortedUids[0][currNode] === target) { // if target is found
        return tiers; // returns the current tier
    }     
    for (const neighbour of sortedReferences[0][currNode]) { // for each node in the following tier (same as the neighbours of the the node)
      neighbourIndex = binarySearch(sortedUids[0], neighbour)[0]// translate to index by searching for the uid
      if (visited[neighbourIndex] !== true) { // or if we haven't visited the node (better to do !== true than ! in case it's empty or null etc)
        queue = pushArr(queue, [neighbourIndex]); // put the node on to the queue so we can search its neighbours later
        visited[neighbourIndex] = true; // now, we have visited the neighbour, so mark accordingly
      }
      distance++;  // increase number of nodes visited
      if (distance === Math.pow(10, tiers)) { // since each item references 10, each tier will be 10^(tierNo-1) long. therefore, once we've traversed that many nodes, we have traversed the entire tier.
        tiers++; 
        distance=0;
      }
    }
  }
}

// SORT
function merge(arr1, arr2){ // returns sorted 2d array storing values and then indexes
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

function mergeSort(arr){
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

function indexArray(arr){ // returns 2d array with initial indexes
  let returnArr = [arr, []];// initialize array with passed 1d array and an empty array for indexes
  for(let i = 0; i < arr.length; i++){ // for every element
    returnArr[1][i] = i; // increment index no. by one and add to list
  }
  return returnArr;
}

function sortParallel(sortedArr,parallelArr){ // returns a parallel array's own 2d list based off of the sorted array's indexes
  let returnArr = [[], parallelArr[1]];
  for(let i = 0; i < sortedArr[0].length; i++){ // for each element in the array
    returnArr[0][i] = parallelArr[0][sortedArr[1][i]]; // the element should equal to the parallel array's value at the index specified in the sorted array
  }
  return returnArr;
}

// SEARCH
// arr must be 1d (i.e pass sortedFirst[0])
function binarySearch(arr, target, accessor = (v)=>{return v}) {
  let right = arr.length - 1; //right value of search parameter
  let left = 0;//left value of search parameter
  while(left <= right){ //run while right value comes after left, meaning there is a chance the target is in the array
    let mid = Math.floor((right + left)/2); //set mid point at the middle of search parameter
    if (accessor(arr[mid]) == target){ //check if value at mid point is equal to target
      left = mid; // start check at target's index
      right = mid; // start check at target's index
      // for the left and right side, move left or right until the target no longer matches
      while (accessor(arr[left-1]) === target){ 
        left--;
      }
      while (accessor(arr[right+1]) === target) {
        right++;
      }

      return [left, right]; // return this range
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
function pushArr(arr, arr2){ // appends new element to arr
  let n = arr.length;
  arr[n] = arr2[0];
  
  return arr;
}

function shiftArr(arr){ // removes first element from array
  for (let i = 0; i < arr.length; i++){ //loops through array, moving each element down one index
    arr[i] = arr[i+1];
  }
  arr.length--; //cuts the length of the array by one
  return arr;
}

function sliceArr(arr, start, end){ // returns 'slice' of arr from start index to end index
  let returnArr = []; // initialize empty array to rteturn
  for (let i = 0; i < end-start; i++){ // for the length of the new arr (which would equal to end index minus start index)
    returnArr[i] = arr[start+i]; // start copying from the start index
  }
  return returnArr;
}

function swap(arr, a, b){ // swap the values of indexes a and b in an array
  let temp = arr[a]; 
  arr[a] = arr[b];
  arr[b] = temp;
}

function clamp(value, min, max) { // makes sure that the value falls between the minimum and maximum  
  return Math.min(Math.max(value, min), max); // picks the maximum out of the maximum and the given value, and then picks the minimum out of that value and the minimum.
}

// DISPLAYING

function mrca() { // called on submit 
  let start = document.getElementById("startUID").value; // get start UID input field value
  let end = document.getElementById("targetUID").value; // get target UID input field value
  let startTime = performance.now()
  let jumps = bfs(binarySearch(sortedUids[0], start)[0], end); // binarySearch takes in sortedUid VALUES (sortedUids[0]) and our start UID so we get the index of the starting UID. binarySearch will always return a range, so we need to get the first index (binarySearch(...)[0]). use the start index and end target to search.
  let mrcaTime = performance.now() - startTime;
  let resultElement = document.getElementById("mrcaResult");//get the element that will display the result
  performanceTime.innerText = `Results compiled in ${mrcaTime.toFixed(2)} ms.`
  if (jumps > 0) { // display jumps if we have a normal return value
    resultElement.innerText = `Target author is ${jumps} references away from the original author.`;
  } else if (jumps === 0 ) { // if there are 0 jumps, they are the same author
    resultElement.innerText = `Your target author and original author are the same person!`;
  } else { // otherwise, it's -1, so the two authors are not related
    resultElement.innerText = `These two authors are not related, or the IDs are invalid.`;
  }
  resultElement.style["visibility"] = "visible"; // show the alert
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
  bfs,
  mrca
}
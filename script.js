const gameContainer = document.getElementById("game");
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');

highScore = localStorage.getItem('highScore') || 0; 
highScoreElement.innerText = `High Score: ${highScore}`

let currentGame = false;
let counter = null;
let card1 = null;
let card2 = null; 
let twoCardFlipped = false;


const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

let totalMatches = COLORS.length; 

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;
  totalMatches = array.length/2;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}



function startGame(){
  if(currentGame) return;

  let shuffledColors = shuffle(COLORS);
  
  // this function loops over the array of colors
  // it creates a new div and gives it a class with the value of the color
  // it also adds an event listener for a click for each card
  function createDivsForColors(colorArray) {
    for (let color of colorArray) {
      // create a new div
      const newDiv = document.createElement("div");
  
      // give it a class attribute for the value we are looping over
      newDiv.classList.add(color);
  
      // call a function handleCardClick when a div is clicked on
      newDiv.addEventListener("click", handleCardClick);
  
      // append the div to the element with an id of game
      gameContainer.append(newDiv);
    }
  }
  
  
  // TODO: Implement this function!
  function handleCardClick(event) {
    // you can use event.target to see which element was clicked
  
    const clickedCard = event.target;

    //checks if the card is already flipped, and checks if two cards are already flipped 
    //if the card is flipped/or there are two cards flipped, we exit function

    if(clickedCard.isFlipped) return; 

    if(twoCardFlipped) return;  
  
    
    clickedCard.style.backgroundColor = clickedCard.className;
    // console.log("you just clicked", clickedCard);
  
    //assigns the clickedCard to either card1 or card2, set isFlipped to true
    //also prevents on you clicking on the same card, and triggering setTimeout function
    if(!card1){
      card1 = clickedCard;
      card1.isFlipped = true
    } else {
      card2 = clickedCard; 
      card2.isFlipped = true; 
    };


    // !card1 ? card1 = clickedCard  : card2 = clickedCard;
    card1 && card2 ? twoCardFlipped = true : twoCardFlipped = false;
  
  
  //in this code - if duplicate card is selected - it treats it as a second invalid choice and flips the card after a minute
  
    if(card1 && card2){
      if(card1.className !== card2.className || card1 === card2 ) {

        //maintains and updates score
        counter ++;
        if(!score){
          const score = document.createElement('p');
          score.innerText = counter;
          scoreElement.append(score); 
    
        } else {
          score.innerText = (`Score: ${counter}`);
        }
    
        return setTimeout(()=>{
          card1.style.backgroundColor = ""; 
          card2.style.backgroundColor = ""; 
          card1.isFlipped = false; 
          card2.isFlipped = false; 
          card1 = null; 
          card2 = null; 
          twoCardFlipped = false; 


        }, 1000);
      } else {

        totalMatches --; 

        card1.isFlipped = true; 
        card2.isFlipped = true;
        card1 = null; 
        card2 = null; 
        twoCardFlipped = false;
      };
    };

    //checks to see if all the matches have been made, if so, end the game
    if(totalMatches === 0){
      endGame();
    };
  };

  
  // when the DOM loads
  createDivsForColors(shuffledColors); 
  

  //prevents the start game button from creating another board on the DOM
  //once the start button is pushed - currentGame = true, preventing use of start button again
  currentGame = true;
  

}


function restartGame(){
  //reshuffles board
  shuffle(COLORS);

  //resets the totalMatches and counter for new game to keep track of score
  totalMatches = COLORS.length/2
  counter = 0; 
  score.innerText = (`Score: ${counter}`)

  //resets the board by reshuffling the div classes, resetting the backgrounds, and removing flipped status of current cards
  const children = gameContainer.children;
  for (let i = 0; i < children.length; i++){
    children[i].style.backgroundColor = ''
    children[i].isFlipped = false; 
    children[i].className = COLORS[i]
  }
};

function endGame(){
  alert('Game has ended');

  //check to see if game resulted in highscore, if so, sets the item in localStorage
  if(highScore === 0 || highScore > counter){
    highScore = counter; 
    localStorage.setItem('highScore', highScore)
  }; 
  highScoreElement.innerText = `High Score: ${highScore}`;
}

startButton.addEventListener('click', startGame)
restartButton.addEventListener('click', restartGame)


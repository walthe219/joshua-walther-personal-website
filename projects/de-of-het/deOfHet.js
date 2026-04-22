//user clicks start button
//read csv file
//create array of (word,article) tuples
//shuffle words
//initial count and numCorrect
//display current word
//user clicks de or het button
//check article and says if correct or incorrect, update numCorrect
//de and het buttons change color depending on answer
//next or previous button to display next or last word
//once finished list, replay button and stats appear
//user clicks replay button to restart

// document.getElementById("use").addEventListener("click", startGame());


let correct = 0;
let count = 0;
let words = undefined;

const wordElement = document.getElementById("word");
const articleElement = document.getElementById("article")
const countElement = document.getElementById("count");
const accuracyElement = document.getElementById("accuracy");

const deButton = document.getElementById("deButton");
const hetButton = document.getElementById("hetButton");
const nextButton = document.getElementById("nextButton");
const useButton = document.getElementById("useButton");
const fileInput = document.getElementById("fileInput");


useButton.addEventListener("click",startGame);
fileInput,addEventListener("change", ()=>{
    useButton.disabled = false;
});
deButton.addEventListener("click",guessDe);
hetButton.addEventListener("click",guessHet);
nextButton.addEventListener("click",nextWord);

deButton.disabled = true;
hetButton.disabled = true;
nextButton.disabled = true;
useButton.disabled = true;



async function readInput(){
    file = fileInput.files[0];
    reader = new FileReader();
    let word = [];

    reader.onload = (event) =>{
        const fileContent = event.target.result;
        const textArray = fileContent.split(/\r?\n/);
        console.log(textArray);

        let i = 0;
        for(let str of textArray){
            str = str.replace(/\s+/g, '');
            words[i++] = str.split(/,/);
            console.log(words[i-1]);
        }
    };

    console.log(words);
    await reader.readAsText(file);
    return words;
}

async function loadWords(){
    // words = await readInput();
    //return shuffle(words);
    let words = [
        ["man","de"],
         ["vrouw", "de"],
         ["jongen", "de"],
         ["kind", "het"],
         ["meisje", "het"],
         ["melk", "de"],
         ["appel", "de"],
         ["brood", "de"],
         ["sap","het"],
         ["water", "het"],    
        ];
    return words;
}

//knuth shuffle algorithm
function shuffle(arr){
    console.log(arr);
    for(let i = arr.length-1;i>0;i--){
        j = Math.random(0,i);
        // [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    console.log(arr);
    return arr
}

async function startGame(){  
    console.log("Starting Game");
    words = await loadWords(); 
    
    deButton.disabled=false;
    hetButton.disabled=false;
    nextButton.disabled=false;
    count = -1;
    correct = 0;
    nextWord();
    updateScore();
}

function nextWord(){
    count++
    deButton.disabled=false;
    hetButton.disabled=false;
    nextButton.disabled=false;
    wordElement.textContent = words[count][0];
    articleElement.textContent = "(?)";
    articleElement.style.color = "black";
}

function guessDe(){
    guess("de");
}

function guessHet(){
    guess("het");
}
function guess(article){
    if(!(article == "de" || article == "het")){
        throw new console.error();
    }
    deButton.disabled=true;
    hetButton.disabled=true;
    articleElement.textContent = words[count][1];
    if(article == words[count][1]){
        // alert("Correct!");
        correct++;
        articleElement.style.color = "green";
    }
    else{
        // alert("Incorrect!");
        articleElement.style.color = "red";
    }
    updateScore();

    if((count+1)==words.length) endGame();
}

function updateScore(){
    countElement.textContent = `${correct}/${count+1}`;
    let accuracy = count>0 ? (correct/(count+1)*100).toFixed(1): 0  ;
    accuracyElement.textContent = `${accuracy}%`;
}

function endGame(){
    nextButton.disabled=true;
    //alert("Game Over!");
}
 

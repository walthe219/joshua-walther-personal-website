function getElem(id){
    
}

const wordElement = document.getElementById("word");
const articleElement = document.getElementById("article")
const countElement = document.getElementById("count");
const accuracyElement = document.getElementById("accuracy");

const deButton = document.getElementById("deButton");
const hetButton = document.getElementById("hetButton");
const nextButton = document.getElementById("nextButton");
const defaultButton = document.getElementById("defaultButton");
const fileInput = document.getElementById("fileInput");


fileInput.addEventListener("change", (event)=>{
    startGame();
    event.target.value = '';
});
deButton.addEventListener("click",guessDe)
hetButton.addEventListener("click",guessHet);
nextButton.addEventListener("click",nextWord);

deButton.disabled = true;
hetButton.disabled = true;
nextButton.disabled = true;


let correct = 0;
let count = 0;
let words = [];

function readInput(){
    console.log("readInput()");
    const file = fileInput.files[0];
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        if (!file) {
            reject("No file selected");
            return;
        }

        reader.onload = (event) =>{
            const fileContent = event.target.result;
            const textArray = fileContent.split(/\r?\n/);
            console.log(textArray);
            let words = [];

            for(let str of textArray){
                str = str.replace(/\s+/g, '');
                words.push(str.split(/,/));
                console.log(words.at(-1));
            }
            resolve(words);
        };

        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
        console.log(words);
    });
}

//knuth shuffle algorithm
function shuffle(arr){
    console.log("shuffle()");
    console.log(arr);
    for(let i = arr.length-1;i>0;i--){
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    console.log(arr);
}


 async function startGame(){  
    console.log("Starting Game");
    words = await readInput();
    shuffle(words);
    
    count = -1;
    correct = 0;
    nextWord();
    updateScore();
}

function nextWord(){
    console.log("nextWord()");
    count++

    deButton.disabled=false;
    hetButton.disabled=false;
    nextButton.disabled=true;

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
    console.log(`guess(${article})`);
    if(!(article == "de" || article == "het")){
        console.error("Guess must be de or het");
    }

    deButton.disabled=true;
    hetButton.disabled=true;
    nextButton.disabled=false;
    
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
    console.log("updateScore()");
    countElement.textContent = `${correct}/${count+1}`;
    let accuracy = count > 0 ? (correct / (count+1) * 100).toFixed(1) : 0 ;
    accuracyElement.textContent = `${accuracy}%`;
}

function endGame(){
    console.log("endGame()");
    nextButton.disabled=true;
    articleElement.textContent = "";
    let accuracy = count > 0 ? (correct / (count+1) * 100).toFixed(1) : 0 ;
    wordElement.textContent = `You had ${accuracy}% accuracy`;
    //alert("Game Over!");
}
 

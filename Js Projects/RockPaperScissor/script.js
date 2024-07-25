let userScore = 0;
let compScore = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");

const user = document.querySelector("#user-score");
const comp = document.querySelector("#comp-score");


const genCompChoice = () => {
    const options = ["rock" , "paper", "scissors"];
    //rock, paper, scissors
    const randomIdx = Math.floor(Math.random()*3);
    return options[randomIdx];
    
}

const drawGame = () => {
    msg.innerText = "This is a Draw";
    msg.style.backgroundColor = "#081b31";
}

const showWinner = (userWin,UserChoice,compChoice) =>{
    if(userWin){
        msg.innerText = `You Win🍾!! Your ${UserChoice} beats ${compChoice}`;
        msg.style.backgroundColor = "green";
        userScore++;
        user.innerText = userScore;
    }
    else{
        msg.innerText = `You Lost!💀, Computer's ${compChoice} beats ${UserChoice}`;
        msg.style.backgroundColor = "red";
        compScore++;
        comp.innerText = compScore;
    }
}

const playGame = (UserChoice) => {
    const compChoice = genCompChoice();

    if(UserChoice === compChoice){
        drawGame();
    }
    else{
        let userWin = true;
        if(UserChoice === "rock"){
           userWin =  compChoice === "paper" ? false : true;

        }
        else if(UserChoice === "paper"){
            userWin = compChoice === "scissors" ? false : true;
        }
        else{
            userWin = compChoice === "rock" ? false : true;
        }
        showWinner(userWin,UserChoice,compChoice);
    }
}


choices.forEach((choice) => {
    choice.addEventListener('click', () => {
        const UserChoice = choice.getAttribute("id");
        playGame(UserChoice);
    })
})
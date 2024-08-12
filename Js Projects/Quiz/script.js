const questions = [
    {
        question: "Which is the largest animal in the world?",
        answers:[
            {text: "Shark", correct : false},
            {text: "Blue Whale", correct : true},
            {text: "Elephant", correct : false},
            {text: "Giraffe", correct : false},
        ]
    },
    {
        question: "Which is the smallest country in the world?",
        answers:[
            {text: "Vatican City", correct : true},
            {text: "Bhutan", correct : false},
            {text: "Nepal", correct : false},
            {text: "Sri Lanka", correct : false},
        ]
    },
    {
        question: "Which is the largest desert in the world?",
        answers:[
            {text: "Kalahari", correct : false},
            {text: "Gobi", correct : false},
            {text: "Sahara", correct : true},
            {text: "Thar", correct : false},
        ]
    },
    {
        question: "Which is the smallest comtinet in the world?",
        answers:[
            {text: "Asia", correct : false},
            {text: "Australia", correct : true},
            {text: "Europe", correct : false},
            {text: "Africa", correct : false},
        ]
    },
];

const questionElement = document.querySelector("#question");
const answerBtns = document.querySelector("#answer-buttons");
const nextBtn = document.querySelector("#next-btn");


let currentQuestionIndex = 0;
let score = 0;

function stratQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextBtn.innerHTML = "Next";
    showQuestion();
}

function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let quesNum = currentQuestionIndex+1;
    questionElement.innerHTML = quesNum + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerBtns.appendChild(button);
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click",selectAns);
    })
}

function resetState(){
    nextBtn.style.display = "none";
    while(answerBtns.firstChild){
        answerBtns.removeChild(answerBtns.firstChild);
    }
}

function selectAns(e){
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    }
    else{
        selectedBtn.classList.add("incorrect");
    }

    Array.from(answerBtns.children).forEach(button =>{
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextBtn.style.display = "block";
}

function showScore(){
    resetState();
    questionElement.innerHTML = `You Scored ${score} out of ${questions.length}!`;
    nextBtn.innerHTML = "Play Again";
    nextBtn.style.display = "block";
}

function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }
    else{
        showScore();
    }
}

nextBtn.addEventListener("click",()=>{
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    }
    else{
        stratQuiz();
    }
})

stratQuiz();

let currentQuestion = 0;
let score = 0;
let user = "";
let timer;
let timeLeft = 30;
let totalTime = 0;

const questions = [
    { question: "Which language is used for web apps?", options: ["Python", "Java", "JavaScript", "C++"], answer: "JavaScript" },
    { question: "Which HTML tag is used to create a hyperlink?", options: ["a", "link", "href", "hyper"], answer: "a" },
    { question: "CSS stands for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style System"], answer: "Cascading Style Sheets" },
    { question: "Inside which HTML element do we put JavaScript?", options: ["js", "script", "scripting", "javascript"], answer: "<script>" },
    { question: "What does API stand for?", options: ["Application Programming Interface", "Application Program Input", "Advanced Programming Interface", "Application Process Integration"], answer: "Application Programming Interface" },
    { question: "Which of these is not a JavaScript framework?", options: ["Angular", "Django", "Vue", "React"], answer: "Django" },
    { question: "What does DOM stand for?", options: ["Document Object Model", "Data Object Model", "Document Oriented Model", "Digital Object Model"], answer: "Document Object Model" },
    { question: "Which of these is a CSS preprocessor?", options: ["SASS", "Java", "HTML", "XML"], answer: "SASS" }
];

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `Time: ${timeLeft}s`;
        totalTime++;
        
        if (timeLeft === 0) {
            nextQuestion();
        }
    }, 1000);
}

function startQuiz() {
    let usernameInput = document.getElementById("username").value.trim();
    if (usernameInput === "") {
        alert("Please enter your name!");
        return;
    }
    user = usernameInput;
    document.getElementById("login").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    document.getElementById("welcome").innerText = "Welcome, " + user + "!";
    loadQuestion();
    startTimer();
}

function loadQuestion() {
    timeLeft = 30;
    clearInterval(timer);
    startTimer();
    
    let q = questions[currentQuestion];
    document.getElementById("questionBox").innerText = `Question ${currentQuestion + 1}/${questions.length}: ${q.question}`;
    let optionsHtml = "";
    q.options.forEach(opt => {
        optionsHtml += `<button onclick="checkAnswer('${opt}')">${opt}</button>`;
    });
    document.getElementById("optionsBox").innerHTML = optionsHtml;
}

function checkAnswer(answer) {
    const buttons = document.querySelectorAll('.options button');
    buttons.forEach(button => {
        button.disabled = true;
        if (button.innerText === questions[currentQuestion].answer) {
            button.classList.add('correct');
        } else if (button.innerText === answer && answer !== questions[currentQuestion].answer) {
            button.classList.add('incorrect');
        }
    });

    if (answer === questions[currentQuestion].answer) {
        score++;
    }
    
    setTimeout(() => {
        nextQuestion();
    }, 1000);
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    clearInterval(timer);
    document.getElementById("quiz").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("finalName").innerText = "Name: " + user;
    document.getElementById("finalScore").innerText = `Score: ${score} / ${questions.length} (${Math.round(score/questions.length * 100)}%)`;
    document.getElementById("timeSpent").innerText = `Total time: ${Math.floor(totalTime/60)}m ${totalTime%60}s`;

    saveToLeaderboard(user, score);
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    timeLeft = 30;
    totalTime = 0;
    document.getElementById("result").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("username").value = "";
}

// ---------------- Leaderboard ----------------
function saveToLeaderboard(name, score) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name, score, date: new Date().toLocaleString() });

    // Sort high-to-low and keep only top 5
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function showLeaderboard() {
    document.getElementById("result").style.display = "none";
    document.getElementById("leaderboard").style.display = "block";

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let listHtml = leaderboard.map(item => 
        `<li><strong>${item.name}</strong> - ${item.score} pts <br><small>${item.date}</small></li>`
    ).join("");

    document.getElementById("leaderboardList").innerHTML = listHtml || "<li>No scores yet!</li>";
}

function backToHome() {
    document.getElementById("leaderboard").style.display = "none";
    document.getElementById("login").style.display = "block";
}
document.getElementById("startQuizBtn").addEventListener("click", startQuiz);
document.getElementById("restartQuizBtn").addEventListener("click", restartQuiz);
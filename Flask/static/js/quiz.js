const questions = [
    {
        question: "Fake Question 1: How often do you eat meat?",
        options: ["Never", "Once a month", "Once a week", "Multiple times a week", "Every day"]
    },
    {
        question: "Fake Question 2: How often do you consume dairy?",
        options: ["Never", "Once a month", "Once a week", "Multiple times a week", "Every day"]
    },
    {
        question: "Fake Question 3: How often do you eat fruit?",
        options: ["Never", "Once a month", "Once a week", "Multiple times a week", "Every day"]
    },
  ];

let currentQuestion = 0;
const questionElement = document.getElementById("question");
const nextButton = document.getElementById("next");
nextButton.addEventListener("click", nextQuestion); // On click

function showQuestion() {
    const question = questions[currentQuestion];
    questionElement.innerText = question.question;
    console.log(question.question)
}

function nextQuestion(e) {
    e.preventDefault();
    currentQuestion = currentQuestion + 1;

    if (currentQuestion < questions.length) {
        const radioButtons = document.querySelectorAll('input[name="frequency"]');
        radioButtons.forEach((radio) => {
            radio.checked = false;
        });
        showQuestion();
    } else {
        const form = document.querySelector("form"); 
        form.innerHTML = `
            <h1>Results</h1>
            <p>Our diagnosis</p>
        `;
    }
}

showQuestion();

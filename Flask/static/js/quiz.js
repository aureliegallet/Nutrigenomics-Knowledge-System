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
nextButton.addEventListener("click", nextClicked); // On click

function showQuestion() {
    const question = questions[currentQuestion];
    questionElement.innerText = question.question;
}

function nextClicked(e){
    e.preventDefault();
    const answer = document.querySelector('input[name="frequency"]:checked');
    if (answer) {
        /* Send answer to backend */
        const answerJson = { 
            question: questions[currentQuestion].question,
            frequency: answer.value 
        };
        fetch('/add-to-kb', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answerJson),
        })
        .catch(error => {
            console.error('Error:', error);
        });

        /* Go to next question */
        nextQuestion()
    } else {
        console.log('You have to select an option.'); /* TODO: Make a div to display error message */
    }
}

function nextQuestion(e) {
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

/* TODO: Talk about when we should delete facts. */

const questions = [
    {
        question: "How old are you?",
        options: ["0-18", "19-30", "31-50", "51+"],
        next: 1
    },
    {
        question: "Do you eat vegetables?",
        options: ["Yes", "No"],
        next: {
            Yes: 2,
            No: 5 
        }
    },
    {
        question: "Do you eat leafy green vegetables (e.g. lettuce, spinach, cale)", 
        options: ["Yes", "No"],
        next: 3
    },
    {
        question: "Do you eat legumes (e.g., beans, lentils)?",
        options: ["Yes", "No"],
        next: 4
    }, 
    {
        question: "Do you eat other vegetables?",
        options: ["Yes", "No"],
        next: 5
    },
    {
        question: "Do you eat meat?",
        options: ["Yes", "No"],
        next: null
    },
];

let currentQuestion = 0;
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById("next");
nextButton.addEventListener("click", nextClicked);

function showQuestion() {
    /* Render question */
    const question = questions[currentQuestion];
    if (question.question.includes('</a>')) { /* Proper display for if there is a link in the question */
        questionElement.innerHTML = question.question;
    } else {
        questionElement.innerText = question.question;
    }
    
    /* Render options */
    optionsElement.innerHTML = '';

    question.options.forEach((option, idx) => {
        let optionName = `option${idx}`

        const radioInput = Object.assign(document.createElement('input'), {
            type: 'radio',
            id: optionName,
            name: 'option',
            value: option
        });    
        const label = Object.assign(document.createElement('label'), {
            htmlFor: optionName,
            innerText: option
        });

        /* Add options to div */
        optionsElement.appendChild(radioInput);
        optionsElement.appendChild(label);
        optionsElement.appendChild(document.createElement('br'));
    });
}

function nextClicked(e){
    e.preventDefault();
    const answer = document.querySelector('input[name="option"]:checked');
    if (answer) {
        /* Send answer to backend */
        const answerJson = { 
            question: questions[currentQuestion].question,
            option: answer.value 
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
        /* Check if we are currently branching according to the answer */
        let next = questions[currentQuestion].next
        if (typeof next === 'object' && next != null) {
            next = next[answer.value];
        }
        nextQuestion(next) 
    } else {
        console.log('You have to select an option.'); /* TODO: Make a div to display error message */
    }
}

function nextQuestion(next) {
    currentQuestion = next;
    console.log(next);
    
    if (currentQuestion != null) {
        const radioButtons = document.querySelectorAll('input[name="option"]');
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

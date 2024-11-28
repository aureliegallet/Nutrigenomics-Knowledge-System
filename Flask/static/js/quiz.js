let questions = {}
let currentQuestion = "age";
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById("next");
nextButton.addEventListener("click", nextClicked);
const folderElement = document.getElementById("folder");
const titleElement = document.getElementById("title");
const noteElement = document.getElementById("note");

async function loadQuestions() {
    /* Load json file */
    try {
        const response = await fetch('/static/json/kb.json');
        const data = await response.json();
        
        questions = data.Questions;
        showQuestion(); 
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}

function showQuestion() {
    /* Render question */
    const question = questions[currentQuestion];

    if (!question) {
        console.log("Question key is not found.");
        return;
    }

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

    /* Render notes */
    if (question.hasOwnProperty("title") && question.hasOwnProperty("note")) {
        titleElement.innerText = question.title
        noteElement.innerText = question.note
        folderElement.style.visibility = "visible"; 
    }
    else {
        folderElement.style.visibility = "hidden";
    }
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

function resetKB() {
    /* Send reset order to backend */
    fetch('/reset-kb', {
        method: 'DELETE', 
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .catch(error => {
        console.error('Error clearing facts:', error);
    });
}

loadQuestions();
/* TODO: Talk about when we should delete facts. */

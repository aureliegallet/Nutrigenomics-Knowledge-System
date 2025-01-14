let questions = {}
let currentQuestion = "age";
const MAXIMUMSCORE = 70;
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById("next");
nextButton.addEventListener("click", nextClicked);
const folderElement = document.getElementById("folder");
const titleElement = document.getElementById("title");
const noteElement = document.getElementById("note");
const errorElement = document.getElementById("error-notification");

async function loadQuestions() {
    /* Load json file */
    try {
        const response = await fetch('/static/json/kb.json');
        const data = await response.json();
        
        questions = data.Knowledge_Base;
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
        /* Hide error div */
        errorElement.style.visibility = "hidden"; 

        /* Send answer to backend */
        const answerJson = { 
            questionKey: currentQuestion,
            option: answer.value 
        };
        fetch('/update-kb', {
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
        /* Show error div */
        errorElement.style.visibility = "visible"; 
    }
}

function nextQuestion(next) {
    currentQuestion = next;
    
    if (currentQuestion != null) {
        const radioButtons = document.querySelectorAll('input[name="option"]');
        radioButtons.forEach((radio) => {
            radio.checked = false;
        });
        showQuestion();
    } else {
        const form = document.querySelector("form"); 
        fetch('/get-score')
            .then(response => response.json())  
            .then(data => {
                health = calculateHealth(data.Score)
                rawSuggestions = data.Suggestions
                form.innerHTML = `
                    <h1>Results</h1>
                    <p>Your gut health is ${health}.</p><br/>
                    <h2>Suggestions for Improvement:</h2>
                    <ul id="suggestions"></ul>
                    <p> Make sure to look at our Knowledge Page to find out specifically how to improve your diet. </p>
                    </br>
                    <img src="../static/img/gut.png" alt="gut" width=90%>
                    <p>Image taken from Microsoft Designer<p><br/>
                    <button id="OK" class="button">OK</button>
                `;
                const okButton = document.getElementById("OK");
                okButton.addEventListener("click", resetKB);

                let suggestions = document.getElementById('suggestions');
                for (let i = 0; i < rawSuggestions.length; i++) {
                    let item = document.createElement('li');
                    item.textContent = rawSuggestions[i];
                    suggestions.appendChild(item);
                }
            })
            .catch(error => {
                console.error("Error fetching score:", error);
            });   
    }
}

function calculateHealth(score) {
    score = (score/MAXIMUMSCORE) * 100 
    diagnosis = ""
    if (score <= 20) {
        diagnosis = "very poor"
    } else if (20 < score && score <= 40) {
        diagnosis = "poor"
    } else if (40 < score && score <= 60) {
        diagnosis = "normal"
    } else if (60 < score && score <= 80) {
        diagnosis = "good"
    } else if (80 < score) {
        diagnosis = "very good"
    }
    return diagnosis
}

function resetKB() {
    /* Send reset order to backend */
    fetch('/reset-kb', {
        method: 'DELETE', 
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error in resetting the knowledge base.');
        }
    })
    .catch(error => {
        console.error('Error clearing facts:', error);
    });
}

loadQuestions();

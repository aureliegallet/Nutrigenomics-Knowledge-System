let questions = {}
let maximumScore = 0;
let percentiles = {};
let currentQuestion = "age";
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById("next");
nextButton.addEventListener("click", nextClicked);
const folderElement = document.getElementById("folder");
const titleElement = document.getElementById("title");
const noteElement = document.getElementById("note");
const errorElement = document.getElementById("error-notification");

/* Function to get all the questions from the knowledge base */
async function loadQuestions() {
    /* Load json file */
    try {
        /* We use await because we should only start showing questions once we have them all. */
        const response = await fetch('/static/json/kb.json');
        const data = await response.json();
        
        questions = data.Knowledge_Base;
        maximumScore = data.Maximum_Score;
        percentiles = data.Percentiles;
        showQuestion(); 
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}

/* Function to display a question, its option and its note */
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

        /* Creates a radio button and label for each option */
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
        folderElement.style.visibility = "visible"; /* Makes folder visible when there is a note */
    }
    else {
        folderElement.style.visibility = "hidden"; /* Hides folder when there is no note */
    }
}

/* Function that dictates what happens when the user clicks on the "next" button */
function nextClicked(e){
    e.preventDefault();
    const answer = document.querySelector('input[name="option"]:checked'); /* Gets the user answer */
    if (answer) { /* Checks if the user has entered an answer */
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
            next = next[answer.value]; /* For when we had branching, selects correct branch */
        }
        nextQuestion(next) 
    } else { /* If no answer was chosen */
        /* Show error div */
        errorElement.style.visibility = "visible"; 
    }
}

/* Function that dictates what happens to move on to the next question */
function nextQuestion(next) {
    currentQuestion = next;
    
    if (currentQuestion != null) { /* Reset radio buttons */
        const radioButtons = document.querySelectorAll('input[name="option"]');
        radioButtons.forEach((radio) => {
            radio.checked = false;
        });
        showQuestion();
    } else { /* Move on to results */
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
                    </br>
                    <p> Make sure to look at our <a href="/knowledge" style="text-decoration: none;color: #1c6f56;">Knowledge Page</a> to find out specifically how to improve your diet. </p>
                    </br>
                    <img src="../static/img/gut.png" alt="gut" width=90%>
                    <p>Image taken from Microsoft Designer<p><br/>
                    <button id="OK" class="button">OK</button>
                `;
                const okButton = document.getElementById("OK"); 
                okButton.addEventListener("click", resetKB); /* Event listener to call for reset upon click */

                let suggestions = document.getElementById('suggestions'); 
                for (let i = 0; i < rawSuggestions.length; i++) { /* For all suggestions, creates a list element and fills text with suggestion text to add to the unordered list */
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
    score = (score/maximumScore) * 100 /* Make it out of 100 */
    diagnosis = "" /* Attribute a diagnosis according to the score */

    for (let percentile of percentiles) {
        if (percentile.minimum <= score && score <= percentile.max) {
            diagnosis = percentile.category;
            break; 
        }
    }
    return diagnosis;
    
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

loadQuestions(); /* First function call */

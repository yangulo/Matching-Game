/* 
 * Create a list that holds all of your cards 
 */
const elements = document.querySelector(".deck").getElementsByClassName("card");

/* 
 * Global variables 
 */
let shown_cards_counter = 0;
let card_value = "";
let temp_array = []
let temp_element = [];
let is_next_move = true;
let num_moves = 0;
let score = 0;
let failures = 0; 
let isTimmerRunning = false;
let page_timer = "";
let time_text = "";
let star_counter = 3;
let card_match = "";
let temp_array_match = [];

shuffle();

/* 
 * Shows flipped card which contains image to match and saves move 
 */
function showCard(event) {  
    timer(); 
    if (is_next_move) {
        if (shown_cards_counter <= 1) {
            event.target.parentElement.children[0].className = "hidden card_unflipped";
            event.target.parentElement.children[1].className = "card_img";

            temp_element.push(event.target.parentElement.children[0]);
            temp_element.push(event.target.parentElement.children[1]);

            shown_cards_counter += 1;

            card_value = event.target.parentElement.children[1].alt;
            temp_array.push(card_value);
        }

        if (shown_cards_counter == 2) {
            num_moves += 1;
            /* 
             * Update num_moves 
             */
            updateScore(num_moves);

            if (temp_array[0] == temp_array[1]) {
                score += 1;
                shown_cards_counter = 0;
                temp_array = [];
                temp_element = [];

                /* 
                 * Checks if game is over 
                */
                isGameOver();
            }

            if (temp_array[0] != temp_array[1]) {
                shown_cards_counter = 0;
                temp_array = [];
                failures += 1;

                /*
                 * Remove a start
                 */
                removeStart()

                /* 
                 * Raise condition, security user 
                 */
                let timeout_element = temp_element.slice()
                setTimeout(function () {
                    event.target.parentElement.children[0].className = "card_unflipped";
                    event.target.parentElement.children[1].className = "card_img hidden";

                    timeout_element[0].className = "card_unflipped";
                    timeout_element[1].className = "card_img hidden";

                    is_next_move = true;

                }, 1500);

                temp_element = [];
                is_next_move = false;
            }
        }
    }
}

function updateScore(num_moves) {
    localStorage.setItem("num_moves", num_moves.toString());
    document.getElementById("result").innerHTML = localStorage.getItem("num_moves");
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each list element
 *   - moves children[1] from a random element to the current element
 *   - moves children[1] from a current element to the random element
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle() {    
    /* 
     * Flipp all cards to restart game 
     */
    let current_array = reset_game();
    
    var current_index = current_array.length, randomIndex;
    while (current_index !== 0) {
        randomIndex = Math.floor(Math.random() * current_index);
        current_index -= 1;
        current_array[current_index].appendChild(current_array[randomIndex].children[1])
        current_array[randomIndex].appendChild(current_array[current_index].children[1])
    }
}

/* 
 * Shows alert cards have been shuffled 
 */
function showRefreshMessage() {
    let confirmResult = window.confirm(
        "Are you sure you want to refresh the game? Cards will be shuffled and your progress will be lost")
    if (confirmResult){
        clearInterval(page_timer);
        restartVariables();
    }
}

/* 
 * Game over 
 */
function isGameOver() {
    if (score == 8) {
        stopped_interval = clearInterval(page_timer);
        openDialog();
    }
}

/* 
 * Resets Game 
 */
function reset_game() {
    let elements = document.querySelector(".deck").getElementsByClassName("card");

    for (i=0; i<elements.length; i++) {
        elements[i].children[0].className="card_unflipped";
        elements[i].children[1].className="card_img hidden";
    }
    return elements
}

/*
 * Open dialog
 */
function openDialog() {
    document.getElementById("dialog").open = true;
    localStorage.setItem("time_user_finished", time_text);
    document.getElementById("time_finished").innerHTML = localStorage.getItem("time_user_finished");
    localStorage.setItem("total_num_moves", num_moves.toString());
    document.getElementById("total_moves").innerHTML = localStorage.getItem("total_num_moves");
    localStorage.setItem("final_score", star_counter);
    document.getElementById("avg_score").innerHTML = localStorage.getItem("final_score");
}

/*
 * Close dialog
 */
function closeDialog() {
    document.getElementById("dialog").open = false;
    restartVariables()
}

/*
 * Reset variables
 */
function restartVariables() {
    isTimmerRunning = false;
    time_text = "00:00:00"
    localStorage.setItem("reset_timer", time_text);
    document.getElementById("timer_displayed").innerHTML = localStorage.getItem("reset_timer");

    num_moves = 0;
    localStorage.setItem("num_moves", num_moves.toString());
    document.getElementById("result").innerHTML = localStorage.getItem("num_moves");
    
    score = 0

    failures = 0;
    star_counter = 3;
    let star_array = document.getElementsByClassName("single_star");
    while (star_array.length != 0) {
        document.querySelector(".stars").removeChild(document.getElementById("a_start"));
    }
    for (i = 0; i < star_counter; i++) {
        let li = document.createElement("li");
        li.setAttribute("id","a_start");
        let li_child = document.createElement("i");
        li.appendChild(li_child).className="fa fa-star";
        document.querySelector(".stars").appendChild(li).className="single_star";
    }
    shuffle();
}

/*
 * Remove a start 
 */
function removeStart() {
    let all_stars = document.getElementById("all_stars");
    
    if (failures == 6) {
        all_stars.removeChild(all_stars.children[0]);
        star_counter -= 1; 
    }
    if (failures == 11) {
        all_stars.removeChild(all_stars.children[0]);
        star_counter -= 1;  
    }
}

/*
 * Timer
 */
function timer() {
    var hour = 0;
    var min = 0;
    var sec = 0;

    if (isTimmerRunning) {
        return;
    }

    isTimmerRunning = true;
    
    page_timer = setInterval(function() { 
        time_text = '';

        if (min == 60) {
            hour ++;
            min = 0;
            sec = 0;
        }
        if (sec == 60) {
            min ++;
            sec = 0;
        }

        if (hour < 10) {
            time_text +=  '0' + hour;
        } else {
            time_text += ':' + hour;
        }
        
        if (min < 10) {
            time_text += ':0' + min;
        } else {
            time_text += ':' + min;
        }

        if (sec < 10) {
            time_text +=  ':0' + sec;
        }
        else {
            time_text += ':' + sec;
        }

        document.getElementById('timer_displayed').innerHTML = time_text;
        sec++;
    }, 1000);
}

/* 
 * TODO (future improvenment)
 * Animation match
 * Animation failure
 */

/*
 * A README file is included detailing the game and all dependencies.
 */
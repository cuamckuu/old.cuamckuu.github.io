"use strict";

class Transition {
    constructor(current, input, output, next) {
        this.current = current;
        this.input = input;
		this.output = output;
        this.next = next;
    }

    match(current, input) {
        return this.current === current && this.input === input;
    }
}

class FiniteStateMachine {
    constructor(initial_state) {
        this.initial_state = initial_state;
    }

    add_transitions(transitions) {
        this.transitions = transitions;
    }

    get_next(current, input) {
        for (let rule of this.transitions) {
            if (rule.match(current, input)) {
                let log = document.getElementById("log");
                log.innerHTML = rule.output;

                return rule.next;
            }
        }
    }

    accepts(sequence) {
        console.log(`Initial state is ${this.initial_state}`);

        let current = this.get_next(this.initial_state, sequence[0]);
        console.log(`State is ${current}`);

        for (let input of sequence.slice(1)) {
            current = this.get_next(current, input);
            console.log(`State is ${current}`);
        }

		return current;
    }
}

const sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener("DOMContentLoaded", function (e) {
    // Finite State Machine initialisation
    let transitions = [
        new Transition("W", "00", "Waiting", "W"),
        new Transition("W", "10", "Player1 Won", "W1"),
        new Transition("W", "01", "Player2 Won", "W2"),
        new Transition("W", "11", "Draft", "D"),
    ];

    let fsm = new FiniteStateMachine("W");
    fsm.add_transitions(transitions);

    let score1 = 0;
    let score2 = 0;

    // Find interface elements
    let lamp = document.getElementById("lamp-on");
    let score1_el = document.getElementById("score1");
    let score2_el = document.getElementById("score2");

    document.getElementById("restart-btn").addEventListener("click", function(_e) {
        // Set random delay
        let delay = 500 + Math.floor(Math.random() * 3000);
        sleep(delay).then(() => {
            // Turn-on lamp
            lamp.style.color = "#ffff00";

            // Decide who was faster
            let rnd = Math.random();
            let input;

            if (rnd < 0.4) {
                input = "10";
            } else if (rnd > 0.6) {
                input = "01";
            } else {
                input = "11";
            }

            sleep(700).then(() => {
                // Process input with FSM
                let res = fsm.accepts([input]);

                // Add score to winner
                if (res === "W1") {
                    score1++;
                } else if (res === "W2") {
                    score2++;
                } else {
                    score1++;
                    score2++;
                }

                // Update score elements
                score1_el.innerHTML = score1;
                score2_el.innerHTML = score2;

                // Turn-off lamp
                lamp.style.color = "#000000";
            });
        });
    })
});


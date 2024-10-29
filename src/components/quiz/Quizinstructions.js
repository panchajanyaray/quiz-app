import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

const QuizInstructions = () => (
    <Fragment>
        <div className="instructions container">
            <h1>How to Play the Game</h1>
            <p>Ensure you read this guide from start to finish.</p>
            <ul className="browser-default" id="main-list">
                <li>The game has a duration of 15 minutes and ends as soon as your time elapses.</li>
                <li>Each game consists of 15 questions.</li>
                <li>
                    Every question contains 4 options.
                </li>
                <li>Select the option which best answers the question by clicking it.</li>
            </ul>

     </div>
    </Fragment>
);

export default QuizInstructions;
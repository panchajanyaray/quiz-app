import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import className from 'classnames';
import questions from '../../questions.json';
import isEmpty from '../../utils/is-empty';

class Play extends Component {
    constructor (props) {
        super(props);
        this.state = {
            questions,
            currentQuestion: {},
            nextQuestion: {},
            previousQuestion: {},
            answer: '',
            numberofQuestions: 0,
            numberofAnsweredQuestions: 0,
            currentQuestionIndex: 0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            nextButtonDisabled: false,
            previousButtonDisabled: true,
            previousRandomNumbers: [],
            time: {}
        };
        this.interval = null;
    }

    componentDidMount () {
        const { questions, currentQuestion, nextQuestion, previousQuestion } = this.state;
        this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion);
        this.startTimer();
    }

    componentWillUnmount () {
        clearInterval(this.interval);
    }

    displayQuestions = (questions = this.state.questions, currentQuestion, nextQuestion, previousQuestion)=> {
        let { currentQuestionIndex } = this.state;
        if (!isEmpty(this.state.questions)) {
            questions = this.state.questions;
            currentQuestion = questions[currentQuestionIndex];
            nextQuestion = questions[currentQuestionIndex + 1];
            previousQuestion = questions[currentQuestionIndex + 1];
            const answer = currentQuestion.answer;
            this.setState({
                currentQuestion,
                nextQuestion,
                previousQuestion,
                numberofQuestions: questions.length,
                answer,
                previousRandomNumbers: []
            }, () => {
                this.handleDisableButton();
            });
        }
    };

    handleOptionClick = (e) => {
        if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
            this.correctAnswer();
        } else {
            this.wrongAnswer();
        }
    }

    handleButtonClick = (e) => {
        switch(e.target.id) {
            case 'next-button':
                this.handleNextButtonClick();
                break;
            case 'previous-button':
                this.handlePreviousButtonClick();
                break;
            case 'quit-button':
                this.handleQuitButtonClick();
                break;
            default:
                break;
        }
    }

    handleNextButtonClick = () => {
        if (this.state.nextQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex + 1
            }), () => {
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            })
        }
    };

    handlePreviousButtonClick = () => {
        if (this.state.previousQuestion !== undefined) {
            this.setState(prevState => ({
                currentQuestionIndex: prevState.currentQuestionIndex - 1
            }), () => {
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            });
        }
    };

    handleQuitButtonClick = () => {
      if (window.confirm('Are you sure you want to quit?')) {
         this.props.history.push('/');
      }
    };

    correctAnswer = () => {
        M.toast({
            html: 'Correct Answer!',
            classes: 'toast-valid',
            displayLength: 1500
    })
    this.setState(prevState => ({
        score: prevState.score + 1,
        correctAnswers: prevState.correctAnswers + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberofAnsweredQuestions: prevState.numberofAnsweredQuestions + 1
    }), () => {
        if (this.state.nextQuestion === undefined) {
            this.endGame();
        } else{
            this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
        }
    });

  }

  wrongAnswer = () => {
      navigator.vibrate(1000);
      M.toast({
        html: 'Wrong Answer!',
        classes: 'toast-invalid',
        displayLength: 1500
    })
    this.setState(prevState => ({
        wrongAnswers: prevState.wrongAnswers + 1,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        numberofAnsweredQuestions: prevState.numberofAnsweredQuestions + 1
    }), () => {
        if (this.state.nextQuestion === undefined) {
            this.endGame();
        } else{
            this.displayQuestions(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
        }
    });

  }

   startTimer = () => {
      const countDownTime = Date.now() + 150000;
      this.interval = setInterval(() => {
          const now = new Date();
          const distance = countDownTime-now;

          const minutes = Math.floor((distance % (1000 * 60 * 60))/(1000*60));
          const seconds = Math.floor((distance % (1000 * 60))/1000);

          if (distance < 0) {
              clearInterval(this.interval);
              this.setState({
                 time: {
                     minutes: 0,
                     seconds: 0
                 }
              }, () => {
                  this.endGame();
              });
          } else {
             this.setState({
                time: {
                    minutes,
                    seconds
                }
             });
          }

      }, 1000);
    }

    handleDisableButton = () => {
        if (this.state.previousQuestion === undefined || this.state.currentQuestionIndex === 0) {
            this.setState({
               previousButtonDisabled: true
           });
        } else {
            this.setState({
                previousButtonDisabled: false 
            });
        }
        
        if (this.state.nextQuestion === undefined || this.state.currentQuestionIndex + 1 === this.state.numberofQuestions) {
            this.setState({
                nextButtonDisabled: true
            });
         } else {
             this.setState({
                 nextButtonDisabled: false 
             });
         }
    }

    endGame = () => {
        alert('Quiz has ended!');
        const { state } = this;
        const playerStats = {
            score: state.score,
            numberofQuestions: state.numberofQuestions,
            numberofAnsweredQuestions: state.correctAnswers + state.wrongAnswers,
            correctAnswers: state.correctAnswers,
            wrongAnswers: state.wrongAnswers,
        };
        console.log(playerStats);
        setTimeout(() => {
            this.props.history.push('/play/quizSummary', playerStats);
        }, 1000);
    }
    
    render () {
        const { currentQuestion, currentQuestionIndex, numberofQuestions, time } = this.state;
        return (
            <Fragment>
                <Helmet><title>Quiz Page</title></Helmet>
                <div className="questions">
                    <h2>Quiz-Mode</h2>
                    <div>
                        <p>
                            <span className="left">{currentQuestionIndex + 1} of {numberofQuestions}</span>
                            <span className="right">{time.minutes}:{time.seconds}</span>
                        </p>
                    </div>
                    <h5>{currentQuestion.question}</h5>
                    <div className="options-container">
                        <p onClick={(this.handleOptionClick)} className="option">{currentQuestion.optionA}</p>
                        <p onClick={(this.handleOptionClick)} className="option">{currentQuestion.optionB}</p>
                    </div>
                    <div className="options-container">
                        <p onClick={(this.handleOptionClick)} className="option">{currentQuestion.optionC}</p>
                        <p onClick={(this.handleOptionClick)} className="option">{currentQuestion.optionD}</p>
                    </div>

                    <div className="button-container">
                        <button 
                            className={className('', {'disable': this.state.previousButtonDisabled})}
                            id="previous-button" 
                            onClick={this.handleButtonClick}>
                            Previous
                        </button>
                        <button
                           className={className('', {'disable': this.state.nextButtonDisabled})} 
                           id="next-button" 
                           onClick={this.handleButtonClick}>
                               Next
                           </button>
                        <button id="quit-button" onClick={this.handleButtonClick}>Quit</button>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Play;
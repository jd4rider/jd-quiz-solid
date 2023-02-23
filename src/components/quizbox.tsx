import { Component, createSignal, createEffect, createRenderEffect } from 'solid-js';
import type { Cat } from './front';
import Answers from './answers';

type Props = {
  difficulty: string,
  quizType: string,
  amount: number,
  selectedCategory: Cat,
  setStartQuiz: Function
}


const Quizbox: Component<Props> = (props: Props) => {
  const [quizQuestions, setQuizQuestions] = createSignal([]);
  const [questionCount, setQuestionCount] = createSignal<number>();
  const [currentQuestion, setCurrentQuestion] = createSignal(0);
  const [quizAnswers, setQuizAnswers] = createSignal([]);
  const [correct, setCorrect] = createSignal("");
  const [disabled, setDisabled] = createSignal(false);
  const [nextText, setNextText] = createSignal("Next Question");
  const [win, setWin] = createSignal(false);
  const [score, setScore] = createSignal(0);

  createRenderEffect(() => {
    let quizType = props.quizType.toLowerCase();
    if (props.quizType == 'True / False') quizType = 'boolean';
    else if (props.quizType == 'Multiple Choice') quizType = 'multiple';



    let url = "";
    if (props.difficulty.toLowerCase() === "any" && quizType === "any" && props.selectedCategory.id !== 0) {
      url = 'https://opentdb.com/api.php?amount=' + props.amount + '&category=' + props.selectedCategory.id;
    } else if (props.difficulty.toLowerCase() !== "any" && props.selectedCategory.id === 0 && quizType === "any") {
      url = 'https://opentdb.com/api.php?amount=' + props.amount + '&difficulty=' + props.difficulty.toLowerCase();
    } else if (props.difficulty.toLowerCase() !== "any" && props.selectedCategory.id !== 0 && quizType === "any") {
      url = 'https://opentdb.com/api.php?amount=' + props.amount + '&category=' + props.selectedCategory.id + '&difficulty=' + props.difficulty.toLowerCase();
    } else if (props.difficulty.toLowerCase() === "any" && props.selectedCategory.id === 0 && quizType !== "any") {
      url = 'https://opentdb.com/api.php?amount=' + props.amount + '&type=' + quizType;
    } else if (props.difficulty.toLowerCase() === "any" && props.selectedCategory.id !== 0 && quizType !== "any") {
      url = 'https://opentdb.com/api.php?amount=' + props.amount + '&category=' + props.selectedCategory.id + '&type=' + quizType;
    } else if (props.difficulty.toLowerCase() !== "any" && props.selectedCategory.id === 0 && quizType !== "any") {
      url = 'https://opentdb.com/api.php?amount=' + props.amount + '&difficulty=' + props.difficulty.toLowerCase() + '&type=' + quizType;
    } else if (props.difficulty.toLowerCase() !== "any" && props.selectedCategory.id !== 0 && quizType !== "any") {
      url = 'https://opentdb.com/api.php?amount=' + props.amount + '&category=' + props.selectedCategory.id + '&difficulty=' + props.difficulty.toLowerCase() + '&type=' + quizType;
    } else {
      url = 'https://opentdb.com/api.php?amount=' + props.amount;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setQuizQuestions(data.results)
        setQuestionCount(data.results.length)
        let answersss = [];
        for (let i in data.results) {
          const answerss = data.results[i].incorrect_answers.concat(data.results[i].correct_answer);
          const shuffledAnswers = answerss.sort(() => Math.random() - 0.5);
          answersss.push(shuffledAnswers);
        }
        console.log(answersss);
        setQuizAnswers(answersss);
      })
  })

  const nextHandler = (e) => {
    if (currentQuestion() < questionCount() - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setWin(true);
    }
    if (currentQuestion() == questionCount() - 1) {
      setNextText("Finish Quiz");
    }

    setDisabled(false);
    setCorrect("");
  }

  const againHandler = () => {
    props.setStartQuiz(false);
  }

  return (
    <div class="bg-white max-w-lg rounded overflow-hidden shadow-lg">
      {!win() && <div class="px-6 py-4">
        <h3 class="bg-gray-100 text-center py-3">
          Question #{currentQuestion() + 1} of {questionCount()}
          <br />
          Category - {props.selectedCategory.name}
          <br />
          Difficulty: {props.difficulty}
        </h3>
        {correct() == "correct" &&
          <div class="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3" role={"alert"}>
            <p class="text-sm text-center">That answer is Correct!</p>
            <p class="text-sm text-center">The answer you chose is:</p>
            <p class="text-base text-center font-bold italic" innerHTML={quizQuestions()[currentQuestion()].correct_answer}></p>
          </div>
        }
        {correct() == "incorrect" &&
          <div class="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3" role={"alert"}>
            <p class="text-sm text-center">That answer is Incorrect!</p>
            <p class="text-sm text-center">The correct answer is:</p>
            <p class="text-base text-center font-bold italic" innerHTML={quizQuestions()[currentQuestion()].correct_answer}></p>
          </div>
        }
        {quizQuestions().length > 0 && <div class="font-bold text-xl mb-2 text-center py-4" innerHTML={quizQuestions()[currentQuestion()].question}>
        </div>}
        <Answers answers={quizAnswers()}
          correct={correct()}
          setCorrect={setCorrect}
          disabled={disabled()}
          setDisabled={setDisabled}
          currentQuestion={currentQuestion()}
          quizQuestions={quizQuestions()}
          setScore={setScore} />
      </div>}

      {disabled() && <div class="px-6 pt-4 pb-2 text-center">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onclick={nextHandler}>
          {nextText()}
        </button>
      </div>}

      {win() && <div class="bg-white max-w-lg rounded overflow-hidden shadow-lg">
        <div class="px-6 py-4">
          <h3 class="bg-gray-100 text-center py-3 px-8">
            "Quiz Complete!"
          </h3>
          <div class="font-bold text-xl mb-2 text-center">
            Score: {score()} out of {questionCount()} correct!
            <h1 class="text-5xl">{(score() / questionCount()) * 100.0}%</h1>
            <div class="px-6 pt-4 pb-2 text-center">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick={againHandler}>
                Go Again...
              </button>
            </div>
          </div>
        </div>
      </div>}
    </div>
  )
};

export default Quizbox;

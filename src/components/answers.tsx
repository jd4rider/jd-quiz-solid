import { Component, createSignal } from 'solid-js';

type Props = {
  answers: Array<Array<string>>,
  currentQuestion: number,
  disabled: boolean,
  setDisabled: Function,
  correct: String,
  setCorrect: Function,
  quizQuestions: Array<any>,
  setScore: Function
}

const Answers: Component<Props> = (props: Props) => {
  const [selectedAnswer, setSelectedAnswer] = createSignal('');

  const answerHandler = (e) => {
    const selectedValue = (e.target as HTMLInputElement).value;

    if (selectedValue == props.quizQuestions[props.currentQuestion]?.correct_answer) {
      props.setCorrect("correct");
      props.setScore(c => c += 1);
    } else {
      props.setCorrect("incorrect")
    }
    setSelectedAnswer(selectedValue);
    props.setDisabled(true);
  }

  const setClass = (
    answer: String,
  ) => {
    if (props.correct == "incorrect" && answer == props.quizQuestions[props.currentQuestion]?.correct_answer) {
      return "bg-green-500 m-0.5 w-full text-white font-bold py-2 px-4 rounded cursor-not-allowed"
    } else if (props.correct == "incorrect" && answer == selectedAnswer()) {
      return "bg-red-500 m-0.5 w-full text-white font-bold py-2 px-4 rounded cursor-not-allowed"
    } else if (props.correct == "correct" && answer == selectedAnswer()) {
      return "bg-green-500 m-0.5 w-full text-white font-bold py-2 px-4 rounded cursor-not-allowed"
    } else if (props.disabled) {
      return "bg-blue-500 m-0.5 w-full text-white font-bold py-2 px-4 rounded cursor-not-allowed"
    } else {
      return "bg-blue-500 m-0.5 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    }
  }

  return (
    <>
      {
        props.answers[props.currentQuestion]?.map((answer) => (
          <button disabled={props.disabled}
            innerHTML={answer}
            class={setClass(answer)}
            value={answer}
            onclick={(e) => answerHandler(e)} />
        ))
      }
    </>
  )
}

export default Answers;

import { Component } from 'solid-js';

type Props = {
  answers: Array<Array<string>>,
  currentQuestion: number

}

const Answers: Component<Props> = (props: Props) => {
  return (
    <>
      {
        props.answers[props.currentQuestion]?.map((answer) => (
          <button class="bg-blue-500 m-0.5 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" value={answer} >
            <div innerHTML={answer}></div>
          </button>
        ))
      }
    </>
  )
}

export default Answers;

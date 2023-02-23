import { Component, createSignal, createEffect, createRenderEffect } from 'solid-js';
import Quizbox from './quizbox';

export type Cat = {
  id: number,
  name: string
};

const Front: Component = () => {

  const [numValue, setNumValue] = createSignal(10);
  const [categoryValue, setCategoryValue] = createSignal<Cat[]>([]);
  const [selectedCategory, setSelectedCategroy] = createSignal<Cat>({ id: 0, name: "Any Category" });
  const [difficultyValue, setDifficultyValue] = createSignal("Any");
  const [typeValue, setTypeValue] = createSignal("Any");
  const [startQuiz, setStartQuiz] = createSignal(false);

  createRenderEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then(response => response.json())
      .then(data => {
        setCategoryValue(data.trivia_categories)
      })
  })

  return (
    <main class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-400 to-blue-400">
      {!startQuiz() ? <form class="w-full max-w-sm" onsubmit={e => { e.preventDefault(); setStartQuiz(true) }} >
        <div class="md:flex md:items-center mb-6">
          <div class="md:w-1/3">
            <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="num-of-questions">
              No. of Questions
            </label>
          </div>
          <div class="md:w-2/3">
            <input class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="num-of-questions"
              type="number"
              value={numValue()}
              onchange={(e) => { setNumValue((e.target as HTMLInputElement).valueAsNumber) }}
              min={5}
              max={30} />
          </div>
        </div>
        <div class="md:flex md:items-center mb-6">
          <div class="md:w-1/3">
            <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="categories">
              Quiz Category
            </label>
          </div>
          <div class="md:w-2/3">
            <select id="categories"
              class="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              onchange={(e) => setSelectedCategroy({
                id: parseInt((e.target as HTMLSelectElement).value),
                name: (e.target as HTMLSelectElement).options[(e.target as HTMLSelectElement).selectedIndex].text
              })}>
              <option value="0" selected={true}>Any Category</option>
              {categoryValue().map((category) => {
                return <option value={category.id}>{category.name}</option>
              })}
            </select>
          </div>
        </div>
        <div class="md:flex md:items-center mb-6">
          <div class="md:w-1/3">
            <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="difficulty">
              Quiz Difficulty
            </label>
          </div>
          <div class="md:w-2/3">
            <select id="difficulty"
              class="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={difficultyValue()}
              onchange={(e) => setDifficultyValue((e.target as HTMLInputElement).value)}>
              <option selected={true}>Any</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>
        <div class="md:flex md:items-center mb-6">
          <div class="md:w-1/3">
            <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="quiztype">
              Quiz Question Types
            </label>
          </div>
          <div class="md:w-2/3">
            <select id="quiztype"
              class="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={typeValue()}
              onchange={(e) => setTypeValue((e.target as HTMLInputElement).value)}>
              <option selected={true}>Any</option>
              <option>Multiple Choice</option>
              <option>True / False</option>
            </select>
          </div>
        </div>
        <div class="md:flex md:items-center">
          <div class="md:w-1/3"></div>
          <div class="md:w-2/3">
            <button class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit" >
              Start Quiz
            </button>
          </div>
        </div>
      </form> :
        <>
          <Quizbox difficulty={difficultyValue()} quizType={typeValue()} amount={numValue()} setStartQuiz={setStartQuiz} selectedCategory={selectedCategory()} />
        </>
      }
    </main>
  );
};

export default Front;

import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import he from "he";

function App() {
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [inPlay, setInPlay] = useState(true);
  const [difficulty, setDifficulty] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Test
  const createQuestions = () => {
    function shuffle(array) {
      let counter = array.length;

      // While there are elements in the array
      while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }

      return array;
    }
    const { incorrect_answers, correct_answer } = questions[questionIndex];
    const arrayOfQuestions = shuffle([correct_answer, ...incorrect_answers]);
    return arrayOfQuestions;
  };

  const checkAnswer = (answer) => {
    let correctAnswer =
      answer == questions[questionIndex].correct_answer ? true : false;

    setScore((prevScore) => (correctAnswer ? prevScore + 1 : prevScore));
    if (questionIndex == questions.length - 1) {
      setInPlay(false);
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const resetGame = () => {
    fetchQuestions();
    setScore(0);
    setQuestionIndex(0);
    setInPlay(true);
  };

  const fetchQuestions = (
    amount = 10,
    category = 14,
    difficulty = "easy",
    type = "multiple"
  ) => {
    setLoading(true);
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`;
    fetch(url)
      .then((data) => data.json())
      .then((resp) => {
        setQuestions(resp.results);
        setLoading(false);
      });
  };

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div className=" h-screen w-screen bg-indigo-500">
      {questions.length != 0 && inPlay && (
        <div>
          <div className="flex justify-center  font-vraag md:px-8 text-white font-bold text-2xl pt-32 py-12 ">
            {he.decode(questions[questionIndex].question)}
          </div>
          <div className="items-center flex flex-col justify-center">
            {createQuestions().map((question) => {
              return (
                <button
                  className="font-vraag font-bold bg-white h-12 w-4/12 my-2 rounded-lg shadow-lg hover:text-white hover:bg-black"
                  onClick={() => checkAnswer(question)}
                >
                  {he.decode(question)}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="pt-12 flex justify-center font-bold text-white font-family">
        {" "}
        Your score is:{" "}
      </div>
      <div className="pt-2 flex justify-center font-bold text-white font-family">
        {score}
      </div>
      {!inPlay && (
        <div>
          <form>
            <select
              onChange={(e) => {
                e.preventDefault();
                setDifficulty(e.target.value);
              }}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
            </select>
          </form>
          <div className="flex flex-col items-center">
            <button
              className="hover:text-white hover:bg-black text-xl bg-white px-24 py-12 rounded-lg shadow-lg"
              onClick={() => resetGame(10, 14, difficulty)}
            >
              Try again!
            </button>

            <div className="text-3xl pt-12 flex justify-center font-bold text-white font-family">
              Game over
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

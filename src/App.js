import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import he from 'he'

function App() {
const [questions, setQuestions] = useState([]);
const [questionIndex, setQuestionIndex] = useState(0);
const [score,setScore] = useState(0);
const [inPlay, setInPlay] = useState(true);
const [difficulty, setDifficulty] = useState();
const [loading, setLoading] = useState(false);

useEffect(() =>{
  fetchQuestions();
},[]);

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
  const {incorrect_answers, correct_answer} = questions[questionIndex];
  const arrayOfQuestions = shuffle([correct_answer, ...incorrect_answers]);
  return arrayOfQuestions;
}

const checkAnswer = (answer) => {
    let correctAnswer = answer == questions[questionIndex].correct_answer ? true : false;

    setScore(prevScore => correctAnswer ? prevScore + 1 : prevScore)
    if(questionIndex == questions.length -1 ) {
      setInPlay(false);
    } else {
    setQuestionIndex(prev => prev + 1);
    }
}

const resetGame = () => {
  fetchQuestions();
    setScore(0);
    setQuestionIndex(0);
    setInPlay(true);
    
}

const fetchQuestions = (amount = 10, category = 14, difficulty ='easy', type='multiple') => {
    setLoading(true);
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`;
    fetch(url).then(data => data.json()).then(resp => {setQuestions(resp.results);setLoading(false)});

}

if (loading) {
  return <div>Loading</div>
}


  return (
    <div className="h-screen w-screen bg-indigo-300">
        {(questions.length != 0 && inPlay) && 
          <div>
            <div className="">{he.decode(questions[questionIndex].question)}</div>
            <div className="items-center flex flex-col justify-center">{createQuestions().map(question => {
              return <button className="font-display font-thin bg-white h-12 w-4/12 my-2 rounded-lg shadow-lg" onClick={() => checkAnswer(question)}>{he.decode(question)}</button>
            })}</div>
          </div>
        }
        <div className="font-bold text-white font-family"> Your score is: </div>
        <div>{score}</div>
        {!inPlay && <div><form><select onChange={(e) =>{e.preventDefault(); setDifficulty(e.target.value)}}>
            <option value='easy'>Easy</option>
            <option value='medium'>Medium</option>
          </select></form><button onClick={() => resetGame(10, 14, difficulty)}>Try again!</button><div>Game over</div></div>

        }
    </div>
  );
};



export default App;

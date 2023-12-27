import { useEffect, useReducer } from 'react';
import { toast } from "sonner";
import { answerList } from "./WordList";

const initialState = {
  rounds: ["", "", "", "", "", ""],
  shouldCheckAnswer: Array(6).fill(false),
  currentGuess: 0,
  isWin: false,
};

interface State {
  rounds: string[];
  shouldCheckAnswer: boolean[];
  currentGuess: number;
  isWin: boolean;
}

type Action =
  | { type: 'SET_ROUNDS'; payload: string[] }
  | { type: 'SET_SHOULD_CHECK_ANSWER'; payload: boolean[] }
  | { type: 'SET_CURRENT_GUESS'; payload: number }
  | { type: 'SET_IS_WIN'; payload: boolean };

const wordleReducer = (state:State, action:Action) => {
  switch (action.type) {
    case 'SET_ROUNDS':
      return { ...state, rounds: action.payload };
    case 'SET_SHOULD_CHECK_ANSWER':
      return { ...state, shouldCheckAnswer: action.payload };
    case 'SET_CURRENT_GUESS':
      return { ...state, currentGuess: action.payload };
    case 'SET_IS_WIN':
      return { ...state, isWin: action.payload };
    default:
      return state;
  }
};

interface LetterRowProps {
  rounds: string;
  checkAnswer: boolean[];
  guess: number;
}
const wordStyle = "flex justify-center pt-3 text-white";

const answer =
  answerList[Math.floor(Math.random() * answerList.length)].toUpperCase();

const LetterRow = ({ rounds, checkAnswer, guess }: LetterRowProps) => {
  const letter = rounds.split("");
  console.log(checkAnswer)

  const bgColor = (index: number) => {
    if (checkAnswer[guess]) {
      if (letter[index] === answer[index]) {
        return "bg-green-700";
      }
      if (answer.includes(letter[index])) {
        return "bg-yellow-500";
      }
      return "";
    }
  };

  const borderColor = (index: number) => {
    if (letter[index]) {
      return "border-white";
    }
    return "border-gray-500";
  };

  return (
    <div className="grid grid-cols-5 gap-y-3">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div
            className={`h-16 w-16 rounded-lg border ${borderColor(
              index,
              
            )} bg-gray-800 text-center text-4xl text-white ${bgColor(index)}`}
            key={index}
          >
            <p className="pt-3">{letter[index]}</p>
          </div>
        ))}
    </div>
  );
};

export default function Wordle() {
  const [state, dispatch] = useReducer(wordleReducer, initialState);
  const { rounds, shouldCheckAnswer, currentGuess, isWin } = state;

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Enter" && rounds[currentGuess] === answer) {
      dispatch({ type: 'SET_IS_WIN', payload: true });
      const updatedCheckArray = [...shouldCheckAnswer];
      updatedCheckArray[currentGuess] = true;
      dispatch({ type: 'SET_SHOULD_CHECK_ANSWER', payload: updatedCheckArray });
      toast.success("You win!");
      return;
    }

    if (
      e.key === "Enter" &&
      rounds[currentGuess].length === 5 &&
      currentGuess < 5
    ) {
      dispatch({ type: 'SET_CURRENT_GUESS', payload: currentGuess + 1 });
      const updatedCheckArray = [...shouldCheckAnswer];
      updatedCheckArray[currentGuess] = true;
      dispatch({ type: 'SET_SHOULD_CHECK_ANSWER', payload: updatedCheckArray });
      return;
    }

    if (e.key === "Backspace" && rounds[currentGuess] !== answer) {
      const newRounds = () => {
        const newRounds = [...rounds];
        newRounds[currentGuess] = newRounds[currentGuess].slice(0, -1);
        return newRounds;
      }
      dispatch({ type: 'SET_ROUNDS', payload: newRounds() });
    }

    if (e.key.match(/^[A-z]$/) && rounds[currentGuess].length < 5) {
      const newRounds = () => {
        const newRounds = [...rounds];
        newRounds[currentGuess] = newRounds[currentGuess] + e.key.toUpperCase();
        return newRounds;
      }
      dispatch({ type: 'SET_ROUNDS', payload: newRounds() });
    }


  };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [rounds, currentGuess]);

  return (
    <>
      <div className="flex p-5">
        <p className="m-auto text-3xl text-gray-300">Wordle</p>
      </div>
      <div className="m-auto grid w-96 gap-x-1 gap-y-2 bg-gray-800">
        {rounds.map((_, index) => (
          <LetterRow
            key={index}
            rounds={rounds[index]}
            checkAnswer={shouldCheckAnswer}
            guess={index}
          />
        ))}
      </div>
      <div className={wordStyle}>Chance : {6 - currentGuess}</div>
      <div className={wordStyle}>{isWin ? "You win!" : ""}</div>
      <div className={"absolute bottom-0 right-10 text-gray-700"}>
        Answer : {answer}
      </div>
    </>
  );
}

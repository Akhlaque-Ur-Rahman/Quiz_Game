import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, CheckCircle, XCircle, MapPin, Calculator, Globe } from 'lucide-react';
import clsx from 'clsx';
import create from 'zustand';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

interface Category {
  name: string;
  icon: React.ReactNode;
  questions: Question[];
}

interface Answer {
  questionId: number;
  selected: number;
  correct: boolean;
}

interface QuizState {
  score: number;
  answers: Answer[];
  incrementScore: () => void;
  addAnswer: (answer: Answer) => void;
  reset: () => void;
}

const useQuizStore = create<QuizState>((set) => ({
  score: 0,
  answers: [],
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  addAnswer: (answer) => set((state) => ({ answers: [...state.answers, answer] })),
  reset: () => set({ score: 0, answers: [] }),
}));

const categories: Category[] = [
  {
    name: 'Geography',
    icon: <MapPin className="h-8 w-8" />,
    questions: [
      { id: 1, text: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin', 'Madrid'], correct: 1 },
      { id: 2, text: 'Which is the longest river?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correct: 1 },
      { id: 3, text: 'What is the largest ocean?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correct: 2 },
    ],
  },
  {
    name: 'Math',
    icon: <Calculator className="h-8 w-8" />,
    questions: [
      { id: 1, text: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correct: 1 },
      { id: 2, text: 'What is 5 * 3?', options: ['10', '15', '20', '25'], correct: 1 },
      { id: 3, text: 'What is the square root of 16?', options: ['2', '4', '8', '16'], correct: 1 },
    ],
  },
  {
    name: 'General',
    icon: <Globe className="h-8 w-8" />,
    questions: [
      { id: 1, text: 'What color is the sky?', options: ['Green', 'Blue', 'Red', 'Yellow'], correct: 1 },
      { id: 2, text: 'How many days in a week?', options: ['5', '6', '7', '8'], correct: 2 },
      { id: 3, text: 'What is the capital of Japan?', options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'], correct: 2 },
    ],
  },
];

const QuizGame: React.FC = () => {
  const { score, answers, incrementScore, addAnswer, reset } = useQuizStore();
  const [gameState, setGameState] = useState<'selectCategory' | 'quiz' | 'results'>('selectCategory');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
    setGameState('quiz');
    reset();
  };

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    const isCorrect = index === selectedCategory!.questions[currentQuestion].correct;
    if (isCorrect) {
      incrementScore();
    }
    addAnswer({
      questionId: selectedCategory!.questions[currentQuestion].id,
      selected: index,
      correct: isCorrect,
    });
    setShowResult(true);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (currentQuestion < selectedCategory!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setGameState('results');
    }
  };

  const restartQuiz = () => {
    reset();
    setGameState('selectCategory');
    setSelectedCategory(null);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowResult(false);
  };

  if (gameState === 'selectCategory') {
    return (
      <Card className="w-full max-w-md bg-gray-800 text-white shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-primary text-white p-6">
          <CardTitle className="text-2xl font-heading">Select a Category</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 gap-4">
          {categories.map((cat) => (
            <Button
              key={cat.name}
              onClick={() => selectCategory(cat)}
              className="flex items-center justify-start p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
            >
              {cat.icon}
              <span className="ml-4 text-lg">{cat.name}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'results') {
    const total = selectedCategory!.questions.length;
    const correct = score;
    const incorrect = total - correct;
    const percentage = Math.round((correct / total) * 100);

    return (
      <Card className="w-full max-w-md bg-gray-800 text-white shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-primary text-white p-6">
          <CardTitle className="text-2xl font-heading">Quiz Dashboard</CardTitle>
          <p className="text-sm opacity-80">Category: {selectedCategory!.name}</p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-3xl font-bold text-secondary">{correct}</p>
              <p className="text-sm opacity-80">Correct</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-error">{incorrect}</p>
              <p className="text-sm opacity-80">Incorrect</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{total}</p>
              <p className="text-sm opacity-80">Total</p>
            </div>
          </div>
          <div>
            <p className="text-lg mb-2">Completion: {percentage}%</p>
            <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-secondary h-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <Button onClick={restartQuiz} className="w-full bg-secondary hover:bg-secondary/90">Play Again</Button>
        </CardContent>
      </Card>
    );
  }

  const question = selectedCategory!.questions[currentQuestion];

  return (
    <Card className="w-full max-w-md bg-gray-800 text-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary text-white p-6">
        <CardTitle className="text-2xl font-heading">Quiz Game - {selectedCategory!.name}</CardTitle>
        <p className="text-sm opacity-80">Question {currentQuestion + 1} of {selectedCategory!.questions.length}</p>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-lg font-body mb-6">{question.text}</p>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={clsx(
                'w-full justify-start text-left py-3 px-4 rounded-lg transition-all',
                selectedOption === index && showResult
                  ? index === question.correct
                    ? 'bg-secondary text-white'
                    : 'bg-error text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              )}
            >
              {option}
              {selectedOption === index && showResult && (
                index === question.correct ? <CheckCircle className="ml-auto h-5 w-5" /> : <XCircle className="ml-auto h-5 w-5" />
              )}
            </Button>
          ))}
        </div>
        {showResult && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{selectedOption === question.correct ? 'Correct!' : 'Incorrect. The correct answer is ' + question.options[question.correct]}</p>
          </div>
        )}
        {showResult && (
          <Button onClick={nextQuestion} className="w-full mt-6 bg-primary hover:bg-primary/90">
            {currentQuestion < selectedCategory!.questions.length - 1 ? 'Next Question' : 'View Results'}
          </Button>
        )}
        <p className="mt-4 text-sm opacity-80">Score: {score}</p>
      </CardContent>
    </Card>
  );
};

export default QuizGame;
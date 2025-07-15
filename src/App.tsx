import React from 'react'
import QuizGame from './components/QuizGame.tsx'

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <QuizGame />
    </div>
  )
}

export default App
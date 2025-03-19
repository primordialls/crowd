import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <img src="src/assets/hag.jpg" alt="React Logo" className="testImage" />
      <div className='choiceContainer' >
        <button className = "choice" onClick={() => console.log('React button clicked')}>
          <h1>This is AI</h1>
        </button>
        <button className = "choice" onClick={() => console.log('Vite button clicked')}>
        <h1>This is not AI</h1>
        </button>
      </div>
    </>
  )
}

export default App

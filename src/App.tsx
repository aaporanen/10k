import * as React from 'react'
import './App.css'
import type IThrowResult from './models/IThrowResult';
import ThrowingArea from './components/ThrowingArea';
import ScoreArea from './components/ScoreArea';
import '@fontsource/roboto/400.css';

function App() {

  const style: React.CSSProperties = {
    display: 'flex',
  }

  const [throwHistory, setThrowHistory] = React.useState<IThrowResult[]>([]);

  const handleTake = (result: IThrowResult) => {
    setThrowHistory(history => [...history, result]);
  }

  return <div style={style}>
    <div
      style={{
        width: '80vw'
      }}
    >
      <ThrowingArea onTake={handleTake} />
    </div>
    <div
      style={{
        width: '20vw'
      }}
    >
      <ScoreArea throwHistory={throwHistory} />
    </div>
  </div>
}

export default App

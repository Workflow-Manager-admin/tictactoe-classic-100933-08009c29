import React, { useState } from 'react';
import './App.css';

/*
  MAIN CONTAINER for TicTacToe Classic
  Two Player mode, 3x3 board, win/draw detection, and restart option.
  Color Palette:
    --primary:   #2196F3 (Blue)
    --secondary: #FFFFFF (White)
    --accent:    #FF9800 (Orange)
  Theme: Light
*/

// Color CSS variables for inline styling (board/buttons)
const COLORS = {
  primary: '#2196F3',
  secondary: '#FFFFFF',
  accent: '#FF9800',
  gridBorder: '#CCCCCC',
};

const initialBoard = () => Array(9).fill(null);

// PUBLIC_INTERFACE
function App() {
  // State: board, whose turn, game state, winner
  const [board, setBoard] = useState(initialBoard());
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState('playing'); // 'playing' | 'won' | 'draw'
  const [winner, setWinner] = useState(null);

  // PUBLIC_INTERFACE
  function handleCellClick(idx) {
    // Only allow clicking if game not finished and cell empty
    if (status !== 'playing' || board[idx]) return;
    const boardCopy = [...board];
    boardCopy[idx] = xIsNext ? 'X' : 'O';
    setBoard(boardCopy);

    const result = calculateWinner(boardCopy);
    if (result) {
      setStatus('won');
      setWinner(result);
    } else if (boardCopy.every(Boolean)) {
      setStatus('draw');
      setWinner(null);
    } else {
      setXIsNext(!xIsNext);
    }
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(initialBoard());
    setXIsNext(true);
    setStatus('playing');
    setWinner(null);
  }

  // PUBLIC_INTERFACE
  function calculateWinner(bd) {
    // Winning indexes
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6],            // diagonals
    ];
    for (let [a, b, c] of lines) {
      if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) {
        return bd[a];
      }
    }
    return null;
  }

  // Styles
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: COLORS.secondary,
  };

  const boardContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 32,
    background: COLORS.secondary,
    padding: 24,
    borderRadius: 20,
    boxShadow: '0 4px 16px 0 rgba(33,150,243,0.10), 0 2px 4px rgba(30,30,60,0.08)',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 70px)',
    gridTemplateRows: 'repeat(3, 70px)',
    gap: '0',
    border: `4px solid ${COLORS.primary}`,
    borderRadius: 10,
    background: COLORS.secondary,
    boxShadow: '0 2px 8px 0 rgba(33,150,243,0.13)',
    marginBottom: 30,
  };

  const cellStyle = (active) => ({
    width: 70,
    height: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: active === 'X' ? COLORS.primary : active === 'O' ? COLORS.accent : '#222',
    background: COLORS.secondary,
    border: `2px solid #DDDDDD`,
    cursor: active || status !== 'playing' ? 'default' : 'pointer',
    transition: 'background 0.12s, border 0.14s',
    outline: 'none',
    borderRight: 'none',
    borderBottom: 'none',
  });

  // Remove right/bottom border for last row/column to get grid effect
  function getBorderFix(idx) {
    const borders = {};
    if ((idx + 1) % 3 === 0) borders.borderRight = `2px solid transparent`; // last cell in row
    if (idx >= 6) borders.borderBottom = `2px solid transparent`; // last row
    return borders;
  }

  const statusTextStyle = {
    fontSize: '1.15rem',
    fontWeight: 500,
    margin: '12px 0 24px 0',
    color: status === 'won'
      ? COLORS.accent
      : status === 'draw'
        ? COLORS.primary
        : '#222',
    minHeight: 30,
    textAlign: 'center',
  };

  const turnTextStyle = {
    fontSize: '1.18rem',
    fontWeight: 600,
    color: '#222',
    background: `linear-gradient(90deg, ${COLORS.primary} 10%, ${COLORS.accent} 90%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: 24,
  };

  const restartBtnStyle = {
    background: COLORS.primary,
    color: '#fff',
    borderRadius: 5,
    border: 'none',
    fontSize: '1.1rem',
    fontWeight: 600,
    padding: '12px 32px',
    cursor: 'pointer',
    transition: 'background 0.15s',
    marginTop: 10,
    outline: 'none',
    letterSpacing: 0.5,
    boxShadow: `0 1px 7px 0 rgba(33,150,243,0.13)`,
  };

  // Render helpers
  function renderStatus() {
    if (status === 'won') {
      return <>Player <span style={{ color: winner === 'X' ? COLORS.primary : COLORS.accent, fontWeight: 700 }}>{winner}</span> wins!</>;
    }
    if (status === 'draw') {
      return <>It's a draw!</>;
    }
    return <>&nbsp;</>;
  }

  function renderTurn() {
    if (status === 'playing') {
      return (
        <>Turn: <span style={{ color: xIsNext ? COLORS.primary : COLORS.accent }}>{xIsNext ? 'X' : 'O'}</span></>
      );
    } else if (status === 'won') {
      return (
        <>Game Over</>
      );
    } else if (status === 'draw') {
      return <>Game Over</>;
    }
  }

  return (
    <div style={containerStyle}>
      {/* Title and description */}
      <nav className="navbar" style={{ background: COLORS.primary, marginBottom: 24 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="logo" style={{ color: COLORS.secondary, fontSize: '1.35rem', fontWeight: 600 }}>
            <span className="logo-symbol" style={{ color: COLORS.accent, fontSize: 23 }}>&#x25CB;</span>
            TicTacToe Classic
          </div>
        </div>
      </nav>
      <main>
        <div style={boardContainerStyle}>
          <div style={turnTextStyle}>{renderTurn()}</div>
          <div style={gridStyle}>
            {board.map((cell, idx) => (
              <button
                key={idx}
                aria-label={`Cell ${idx + 1}`}
                style={{ ...cellStyle(cell), ...getBorderFix(idx) }}
                onClick={() => handleCellClick(idx)}
                tabIndex={status === 'playing' && !cell ? 0 : -1}
                disabled={!!cell || status !== 'playing'}
              >
                {cell}
              </button>
            ))}
          </div>
          <div style={statusTextStyle}>{renderStatus()}</div>
          <button type="button" style={restartBtnStyle} onClick={handleRestart}>
            Restart Game
          </button>
        </div>
      </main>
      <footer style={{ marginTop: 42, textAlign: 'center', color: '#888', fontSize: '0.98rem' }}>
        Classic 2-player<br />Developed with React
      </footer>
    </div>
  );
}

export default App;
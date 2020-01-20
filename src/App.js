import React, { useState } from "react";
import "./index.scss";
import classnames from "classnames";

const CELL_TYPES = {
  TYPE_O: 0,
  TYPE_X: 1
};
const GAME_MODE = {
  STARTED: 0,
  STOPED: 1
};
const MATRIX_SIZE = 3;

function App() {
  const [matrix, setMatrix] = useState(getMatrix(MATRIX_SIZE));
  const [currentCellType, setCurrentCellType] = useState(CELL_TYPES.TYPE_X);
  const [gameMode, setGameMode] = useState(GAME_MODE.STARTED);

  function newGame() {
    setCurrentCellType(CELL_TYPES.TYPE_X);
    setMatrix(getMatrix(MATRIX_SIZE));
    setGameMode(GAME_MODE.STARTED);
  }
  function getMatrix(matrixSize) {
    const matrix = [];
    for (let row = 0; row < matrixSize; row += 1) {
      matrix[row] = [];
      for (let cell = 0; cell < matrixSize; cell += 1) {
        matrix[row][cell] = null;
      }
    }
    return matrix;
  }
  function onClick(event) {
    if (gameMode === GAME_MODE.STOPED) {
      return false;
    }
    const { cell, row } = event.currentTarget.dataset;
    matrix[row][cell] = currentCellType;
    setCurrentCellType(
      currentCellType === CELL_TYPES.TYPE_X
        ? CELL_TYPES.TYPE_O
        : CELL_TYPES.TYPE_X
    );
    if (check(matrix, row, cell, currentCellType)) {
      setGameMode(GAME_MODE.STOPED);
    }
    setMatrix([...matrix]);
  }

  function check(matrix, y, x, currentCellType) {
    const col = matrix.every(item => item[x] === currentCellType);
    const row = matrix[y].every(item => item === currentCellType);
    let diag1 = true;
    let diag2 = true;
    for (let i = 0, x = 0; i < MATRIX_SIZE; i += 1, x += 1) {
      if (matrix[i][x] !== currentCellType) {
        diag1 = false;
      }
    }

    for (let i = MATRIX_SIZE - 1, x = 0; x < MATRIX_SIZE; i -= 1, x += 1) {
      if (matrix[i][x] !== currentCellType) {
        diag2 = false;
      }
    }

    return col || row || diag1 || diag2;
  }

  function getResult() {
    if (gameMode === GAME_MODE.STOPED) {
      return (
        <div className="grid__result">
          <div>
            <h3>
              The {currentCellType === CELL_TYPES.TYPE_X ? "O" : "X"} player
              won!
            </h3>
            <div className="grid__result_restart" onClick={newGame}>
              Restart the game
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="app">
      <div className="controls">
        <button className="controls__button" onClick={newGame}>
          New Game
        </button>
      </div>
      <div className="grid">
        {matrix.map((row, rowIndex) => {
          const cells = row.map((cell, cellIndex) => {
            const cellStyles = classnames({
              grid__cell: true,
              "is-selected": cell !== null,
              "type-x": cell === CELL_TYPES.TYPE_X,
              "type-o": cell === CELL_TYPES.TYPE_O
            });
            return (
              <div
                key={cellIndex}
                data-row={rowIndex}
                data-cell={cellIndex}
                onClick={onClick}
                className={cellStyles}
              />
            );
          });
          return (
            <div key={rowIndex} className="grid__row">
              {cells}
            </div>
          );
        })}
        {getResult()}
      </div>
    </div>
  );
}

export default App;

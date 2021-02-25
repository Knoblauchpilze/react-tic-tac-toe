import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  if (props.winning) {
    return (
      <button className="winning_square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  else {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: props.width,
      height: props.height,
    };
  }

  render() {
    const cells = [];

    const winningSquares = [];
    const winner = calculateWinner(this.props.squares)
    if (winner) {
      winningSquares.push(winner.a, winner.b, winner.c);
    }

    for (let y = 0 ; y < this.state.height ; y++) {
      const row = [];

      for (let x = 0 ; x < this.state.width ; x++) {
        row.push(
          <Square
            key={y * this.state.width + x}
            winning={winningSquares.includes(y * this.state.width + x)}
            value={this.props.squares[y * this.state.width + x]}
            onClick={() => this.props.onClick(x, y)}
          />
        );
      }

      cells.push(
        <div className="board-row" key={y}>
          {row}
        </div>
      );
    }

    return (
      <div>
        {cells}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 4,
      height: 5,
      history: [
        {
          squares: Array(4 * 5).fill(null),
          x: null,
          y: null,
          isDraw: false,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      movesAscendingOrder: true,
    };
  };

  handleClick(x, y) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[y * this.state.width + x] || current.isDraw) {
      return;
    }

    squares[y * this.state.width + x] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          x: x,
          y: y,
          isDraw: !squares.some(function (el) {
            return el === null;
          }),
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState(
      {
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      }
    );
  }

  invertMovesOrder() {
    this.setState(
      {
        movesAscendingOrder: !this.state.movesAscendingOrder,
      }
    )
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const winner = calculateWinner(current.squares.slice());
    let status;

    if (winner) {
      status = "Winner: " + winner.name;
    }
    else {
      if (current.isDraw) {
        status = "Nobody wins";
      }
      else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
    }

    let moves = history.map((step, move) => {
      const desc = move ?
      "Go to move #" + move + " (" + step.x + ", " + step.y + ")" :
      "Go to game start";

      if (move === this.state.stepNumber) {
        return (
          <li key = {move}>
            <button className="current_move" onClick = {() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      } else {
        return (
          <li key = {move}>
            <button onClick = {() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
    });

    if (!this.state.movesAscendingOrder) {
      moves = moves.reverse();
    }

    let order = "Sort in ascending order";
    if (this.state.movesAscendingOrder) {
      order = "Sort in descending order";
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            width =  {this.state.width}
            height = {this.state.height}
            onClick = {(i, j) => this.handleClick(i, j)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="game-info">
            <button onClick = {() => this.invertMovesOrder()}>{order}</button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    // First line
    [0, 1, 2],
    [1, 2, 3],
    // Second line
    [4, 5, 6],
    [5, 6, 7],
    // Third line
    [8, 9, 10],
    [9, 10, 11],
    // Fourth line
    [12, 13, 14],
    [13, 14, 15],
    // Fifth line
    [16, 17, 18],
    [17, 18, 19],

    // First column
    [0, 4, 8],
    [4, 8, 12],
    [8, 12, 16],
    // Second column
    [1, 5, 9],
    [5, 9, 13],
    [9, 13, 17],
    // Third column
    [2, 6, 10],
    [6, 10, 14],
    [10, 14, 18],
    // Fourth column
    [3, 7, 11],
    [7, 11, 15],
    [11, 15, 19],

    // Left to right diagonal
    [0, 5, 10],
    [1, 6, 11],
    [4, 9, 14],
    [5, 10, 15],
    [8, 13, 18],
    [9, 14, 19],

    // Right to left diagonal
    [2, 5, 8],
    [3, 6, 9],
    [7, 10, 13],
    [6, 9, 12],
    [11, 14, 17],
    [10, 13, 16],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        name: squares[a],
        a: a,
        b: b,
        c: c,
      };
    }
  }
  return null;
}
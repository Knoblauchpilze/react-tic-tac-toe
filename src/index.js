import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: props.width,
      height: props.height,
    };
  }

  renderSquare(x, y) {
    return (
      <Square
        value={this.props.squares[y * this.state.width + x]}
        onClick={() => this.props.onClick(x, y)}
      />
    );
  }

  render() {
    const cells = [];

    for (let y = 0 ; y < this.state.height ; y++) {
      const row = [];

      for (let x = 0 ; x < this.state.width ; x++) {
        row.push(
          <Square
            key={y * this.state.width + x}
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
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  };

  handleClick(x, y) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[y * this.state.width + x]) {
      return;
    }

    squares[y * this.state.width + x] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
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

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const winner = calculateWinner(current.squares.slice());
    let status;

    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, move) => {
      const desc = move ?
      "Go to move #" + move :
      "Go to game start";
      return (
        <li key = {move}>
          <button onClick = {() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

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
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
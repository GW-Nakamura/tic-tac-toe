import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={props.style}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  
  // renderSquare(i) {
  //   return (
  //     <Square
  //       value={this.props.squares[i]}
  //       onClick={() => this.props.onClick(i)}
  //     />
  //   );
  // }

  renderSquare2() {
    return (
      <>
        {
          Array(3).fill(0).map((val, y) => {
            return (
              <div className="board-row" name={y.toString()} key={y.toString()}>
              {
                Array(3).fill(0).map((val2, x) => {
                  let cellNum = y * 3 + x;
                  let winLine = this.props.winLine;

                  // 勝利ラインに色付けする
                  let style = {
                    background: null,
                  };
                  if (winLine && winLine.indexOf(cellNum) >= 0) {
                    console.log("winLine=" + winLine + ' cellNum=' + cellNum);
                    console.log(winLine.indexOf(cellNum));
                    style = {
                      background: "gray"
                    };
                  }
            
                  return (
                    <Square
                      value={this.props.squares[cellNum]}
                      onClick={() => this.props.onClick(cellNum)}
                      style={style}
                      cellNum={cellNum}
                      key={cellNum.toString()}
                    />
                  );
                })
              }
              </div>
            );
          })
        }
      </>
    )
  }
  
  render() {
    return (
      <>
        {this.renderSquare2()}
      </>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        place: null, //
      }],
      stepNumber: 0,
      xIsNext: true,
      sort: true,
      winLine: null,
    };
  }
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let retWinner = calculateWinner(squares);
    let winner = retWinner[0];
    let winLine = retWinner[1];

    if (winner || squares[i]) {
      
      this.setState({
        // 勝利ライン色付け用
        winLine: winLine,
      });
      
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        place: i, //
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  changeSort() {
    this.setState({
      sort: !this.state.sort,
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const retWinner = calculateWinner(current.squares);
    let winner = retWinner[0];
    let winLine = retWinner[1];
    const moves = history.map((step, move) => {
      const y = Math.floor(step.place / 3) + 1;
      const x = step.place % 3 + 1;
            
      const desc = move ?
        'Go to move #' + move + " (" + x + "," + y + ")":
        'Go to game start';
      
      const style = {
        fontWeight: (move === this.state.stepNumber) ? 'bold' : 'normal',
      };
      
      return (
        <li name={move.toString()} key={move.toString()}>
          <button onClick={() => this.jumpTo(move)} style={style} >{desc}</button>
        </li>
      );
    });
    
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      if (this.state.stepNumber < 9) {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      } else {
        status = '*** Draw ***';
      }
    }
    // console.log(history);
    // console.log(moves);
    let sortedMoves = [...moves]
    let sortLabel = '昇順';
    let reversed = '';
    if (this.state.sort === true) {
      sortedMoves = [...moves].reverse()
      sortLabel = '降順';
      reversed = 'reversed';
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winLine={winLine}
          />
        </div>
        <div className="game-info">
          <button onClick={() => this.changeSort()}>{sortLabel}</button>
          <div>{status}</div>
          <div>{winLine}</div>
          <ol reversed={reversed}>{sortedMoves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
      // console.log('win=' + lines[i] + ' ' + squares[a]);
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
}

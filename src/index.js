import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
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

    renderSquare2(i) {
      return (
        <div>
          {
            Array(3).fill(0).map((val, y) => {
              return (
                <div className="board-row">
                {
                  Array(3).fill(0).map((val2, x) => {
                    return (
                      <Square
                        value={this.props.squares[y * 3 + x]}
                        onClick={() => this.props.onClick(y * 3 + x)}
                      />
                    );
                  })
                }
                </div>
              );
            })
          }
        </div>
      )
    }
    
    
    render() {
      return (
        <div>
          {this.renderSquare2(0)}
                  
          {/* <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div> */}
        </div>
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
      };
    }
    
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
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
   
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const moves = history.map((step, move) => {
        const y = Math.floor(step.place / 3) + 1;
        const x = step.place % 3 + 1;
              
        const desc = move ?
          'Go to move #' + move + " (" + x + "," + y + ")":
          'Go to game start';
        
        const style = {
          fontWeight: (move == this.state.stepNumber) ? 'bold' : 'normal',
        };
        
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)} style={style} >{desc}</button>
          </li>
        );
      });
      
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      // console.log(history);
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
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
        return squares[a];
      }
    }
    return null;
  }
  
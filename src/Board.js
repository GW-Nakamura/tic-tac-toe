import React from 'react';
import Square from './Square';

export default class Board extends React.Component {
  
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

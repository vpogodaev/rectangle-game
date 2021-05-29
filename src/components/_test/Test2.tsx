import React from 'react';

import './styles.scss';

enum Players {
  PLAYER_1 = 'player1',
  PLAYER_2 = 'player2',
}

declare interface IPoint {
  x: number;
  y: number;
}

export default function Test2() {
  //return <Board width={10} height={10} />;
  //return <Rectangle width={3} height={4} player={Players.PLAYER_1} />;
  return (
    <>
      <Board width={10} height={10}>
        <Rectangle
          width={3}
          height={4}
          player={Players.PLAYER_1}
          corner={{ x: 0, y: 0 }}
        />
        <Rectangle
          width={2}
          height={3}
          player={Players.PLAYER_1}
          corner={{ x: 3, y: 1 }}
        />
        <Rectangle
          width={2}
          height={2}
          player={Players.PLAYER_2}
          corner={{ x: 8, y: 8 }}
        />
      </Board>
    </>
  );
}

function Rectangle({
  width = 10,
  height = 10,
  player,
  corner,
}: {
  width: number;
  height: number;
  player: Players;
  corner: IPoint;
}) {
  let className = `rectangle rectangle_${player}`;
  const { x, y } = corner;
  const style = {
    width: width * 50 + (width - 1) * 2,
    height: height * 50 + (height - 1) * 2,
    top: 1 + y * 50 + y * 2,
    left: 1 + x * 50 + x * 2,
  };

  return (
    <div className={className} style={style}>
      <div className="rectangle__weight">{width * height}</div>
    </div>
  );
}

function Board({
  width = 10,
  height = 10,
  children,
}: {
  width: number;
  height: number;
  children: any;
}) {
  const square = width * height;
  const backGroundCells = new Array(square);

  for (let i = 0; i < square; i++) {
    backGroundCells[i] = <Cell />;
  }

  const style = {
    gridTemplate: `repeat(${height}, 1fr) / repeat(${width}, 1fr)`,
  };

  return (
    <>
      <div className="board" style={style}>
        <div className="board__background">{backGroundCells}</div>
        {children}
      </div>
    </>
  );
}

function Cell() {
  return <div className="cell"></div>;
}

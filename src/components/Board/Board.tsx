//import React, { useEffect, useState } from 'react';

import { IPoint } from '../../models/common/interfaces';
import Cell from '../Cell/Cell';
import './styles.scss';

export default function Board({
  width = 10,
  height = 10,
  children = null,
  onMouseHoverCell,
  onMouseClickCell,
}: {
  width: number;
  height: number;
  children?: any;
  onMouseHoverCell: (point: IPoint) => void;
  onMouseClickCell: (point: IPoint) => void;
}) {
  const square = width * height;
  const backGroundCells = new Array(square);

  const handleMouseHoverCell = (point: IPoint) => {
    onMouseHoverCell(point);
  };
  const handleMouseClickCell = (point: IPoint) => {
    onMouseClickCell(point);
    //console.log([point.x, point.y]);
  };

  let index = 0;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      backGroundCells[index++] = (
        <Cell
          point={{ x: j, y: i }}
          onMouseHover={handleMouseHoverCell}
          onMouseClick={handleMouseClickCell}
        />
      );
    }
  }

  const style = {
    gridTemplate: `repeat(${height}, 1fr) / repeat(${width}, 1fr)`,
  };

  return (
    <>
      <div className="board">
        <div className="board__background" style={style}>
          {backGroundCells}
        </div>
        {children}
      </div>
    </>
  );
}

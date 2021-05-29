import React, { useEffect, useState } from 'react';
import Field from '../../models/Field';
import Square from '../Square/Square';

import './styles.scss';

declare interface IRectangle {
  width: number;
  height: number;
  /** left upper corner */
  point: {
    x: number;
    y: number;
  };
}

export default function Board({
  width = 10,
  height = 10,
}: {
  width: number;
  height: number;
}) {
  const [field, setField] = useState<Field>(new Field(width, height));
  
  const fieldCells = new Array(height);

  //for

  return <div className="board"></div>;

  // const [board, setBoard] = useState<string[][]>();
  // const [player1, setPlayer1] = useState<IRectangle[]>();
  // const [player2, setPlayer2] = useState<IRectangle[]>();

  // useEffect(() => {
  //   const createRow = (count: number, firstId: number): string[] => {
  //     const row = new Array(count);
  //     for (let i = 0; i < count; i++) {
  //       row[i] = `s-${firstId++}`;
  //     }
  //     return row;
  //   };

  //   const field : string[][] = new Array(height);
  //   let id = 1;
  //   for(let i = 0; i < field.length; i++) {
  //     field[i] = createRow(width, id++);
  //   }

  //   setBoard(field);

  //   // т.к. onmount
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const array: JSX.Element[] = new Array(width * height);
  // for (let i = 0; i < width * height; i++) {
  //   array.push(<Square id={`s-${i + 1}`} />);
  // }

  // const cellStatuses: [][] = new Array(height).fill(
  //   Array.from({ length: width }, () => true)
  // );

  // const player1 = {
  //   rectangles: [{ width: 6, height: 3, point: { x: 0, y: 0 } }],
  // };

  // const style = {
  //   gridTemplate: `repeat(${height}, 1fr) / repeat(${width}, 1fr)`,
  // };

  // return (
  //   <div className="board" style={style}>
  //     {array}
  //   </div>
  // );
  // return <div className="board">{field}</div>;
}

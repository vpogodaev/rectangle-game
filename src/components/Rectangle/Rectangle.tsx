import React from 'react';
import { Players } from '../../models/common/enums';
import { IPoint } from '../../models/common/interfaces';

import './styles.scss';

export default function Rectangle({
  width = 10,
  height = 10,
  player,
  corner,
}: {
  width: number;
  height: number;
  player: Players.PLAYER_1 | Players.PLAYER_2;
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

  console.log('Rectangle', corner);
  

  return (
    <div className={className} style={style}>
      <div className="rectangle__weight">{width * height}</div>
    </div>
  );
}

import React from 'react';
import { CellStatus } from '../../models/common/enums';
//import { Players } from '../../models/common/enums';
import { IBox, IPoint } from '../../models/common/interfaces';

import './styles.scss';

type TRectangleProps = {
  size: IBox;
  player: CellStatus;
  corner: IPoint;
};

export const Rectangle: React.FC<TRectangleProps> = ({
  size,
  player,
  corner,
}) => {
  const { x, y } = corner;
  const { width, height } = size;

  let className = `rectangle rectangle_${player}`;
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
};

import React from 'react';
import { CellStatus } from '../../models/common/enums';
//import { Players } from '../../models/common/enums';
import { IBox, IPoint } from '../../models/common/interfaces';
import TRectangle from '../../models/types/TRectangle';

import './styles.scss';

type TRectangleProps = {
  // size: IBox;
  // player: CellStatus;
  // corner: IPoint;
  rectangle: TRectangle;
};

export const Rectangle: React.FC<TRectangleProps> = ({
  // size,
  // player,
  // corner,
  rectangle,
}) => {
  // убрать это
  if (!rectangle.corner) {
    return <div></div>;
  }
  const { x, y } = rectangle.corner;
  const { width, height } = rectangle;

  //console.log(rectangle.canBePlaced);

  let className = `rectangle rectangle_${rectangle.player} ${
    rectangle.canBePlaced ? '' : 'rectangle_red'
  }`;
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

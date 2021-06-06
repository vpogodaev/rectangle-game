import React from 'react';
import TRectangle from '../../models/types/TRectangle';

import './styles.scss';

type TRectangleProps = {
  rectangle: TRectangle;
};

export const Rectangle: React.FC<TRectangleProps> = ({
  rectangle,
}) => {
  // убрать это
  if (!rectangle.corner) {
    return <div></div>;
  }
  const { x, y } = rectangle.corner;
  const { width, height } = rectangle;

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

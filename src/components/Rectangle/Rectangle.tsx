import { observer } from 'mobx-react-lite';
import React from 'react';
import RectangleModel from '../../models/types/Rectangle';

import './styles.scss';

type TRectangleProps = {
  rectangle: RectangleModel;
};

// todo: должно быть не тут (наверное)
const square = 30;

export const Rectangle: React.FC<TRectangleProps> = observer(
  ({ rectangle }) => {
    const { x, y } = rectangle.corner;
    const { width, height } = rectangle;

    let className = `rectangle rectangle_${rectangle.player} ${
      rectangle.canBePlaced || rectangle.placed ? '' : 'rectangle_red'
    }`;
    const style = {
      width: width * square + (width - 1) * 2,
      height: height * square + (height - 1) * 2,
      top: 1 + y * square + y * 2,
      left: 1 + x * square + x * 2,
    };

    return (
      <div className={className} style={style}>
        <div className="rectangle__weight">{width * height}</div>
      </div>
    );
  }
);

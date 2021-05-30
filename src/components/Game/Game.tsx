import { useEffect, useState } from 'react';
import { Players } from '../../models/common/enums';
import { IPoint } from '../../models/common/interfaces';
import TRectangle from '../../models/types/TRectangle';
import Board from '../Board/Board';
import Rectangle from '../Rectangle/Rectangle';
import './styles.scss';

export default function Game({
  fieldWidth,
  fieldHeight,
}: {
  fieldWidth: number;
  fieldHeight: number;
}) {
  const [curPlayer, setCurPlayer] = useState<Players>(Players.NONE);
  const [rectangles, setRectangles] = useState<TRectangle[]>(
    new Array<TRectangle>()
  );

  useEffect(() => {
    setRectangles([new TRectangle(3, 4, Players.PLAYER_1, { x: 1, y: 0 })]);
  }, []);

  const handleMouseHoverCell = (point: IPoint) => {
    console.log(point);
  };
  const handleMouseClickCell = (point: IPoint) => {
    const newRectangles = rectangles.slice();
    newRectangles[0].corner = point;
    setRectangles(newRectangles);
    console.log('handleMouseClickCell', point);
  };

  const drawRectangles = () => {
    const displayRectangles = new Array(rectangles?.length);
    for (let i = 0; i < rectangles.length; i++) {
      const rec = rectangles[i];
      const corner = rec.corner ? rec.corner : { x: 0, y: 0 };
      displayRectangles[i] = (
        <Rectangle
          width={rec.width}
          height={rec.height}
          player={rec.player}
          corner={corner}
        />
      );
    }

    return displayRectangles;
  };

  const displayRectangles = drawRectangles();
  console.log('displayRectangles', displayRectangles);

  return (
    <Board
      width={fieldWidth}
      height={fieldHeight}
      children={displayRectangles}
      onMouseHoverCell={handleMouseHoverCell}
      onMouseClickCell={handleMouseClickCell}
    ></Board>
  );
}

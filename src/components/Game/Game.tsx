import { useEffect, useState } from 'react';
import { CellStatus } from '../../models/common/enums';
//import { Players } from '../../models/common/enums';
import { IPoint } from '../../models/common/interfaces';
import TCell from '../../models/types/TCell';
import TField from '../../models/types/TField';
import TRectangle from '../../models/types/TRectangle';
import { Board } from '../Board/Board';
import { Dices } from '../Dices/Dices';
import { History } from '../History/History';
import { Rectangle } from '../Rectangle/Rectangle';
import './styles.scss';

export default function Game({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  //const [curPlayer, setCurPlayer] = useState<Players>(Players.NONE);
  const [rectangles, setRectangles] = useState<TRectangle[]>(
    new Array<TRectangle>()
  );
  const [field, setField] = useState<TField>(new TField({ width, height }));

  useEffect(() => {
    const rects = [
      new TRectangle(2, 3, CellStatus.PLAYER_1, { x: 0, y: 0 }),
      new TRectangle(3, 2, CellStatus.PLAYER_2, { x: 0, y: 0 }),
      new TRectangle(1, 3, CellStatus.PLAYER_1, { x: 2, y: 0 }),
    ];
    setRectangles(rects);
    field.placeRectangle(rects[0], true);
    field.placeRectangle(rects[1], true);
  }, []);

  const handleMouseHoverCell = (cell: TCell) => {
    const newRectangles = rectangles.slice();
    newRectangles[2].corner = cell.point;
    newRectangles[2].canBePlaced = field.canPlaceRectangle(rectangles[2]);
    setRectangles(newRectangles);
  };
  const handleMouseClickCell = (cell: TCell) => {
    //console.log(field.canPlaceRectangle(rectangles[2]));
  };
  const handleMouseRightClickCell = (cell: TCell) => {
    const newRectangles = rectangles.slice();
    const tmp = newRectangles[2].width;
    newRectangles[2].width = newRectangles[2].height;
    newRectangles[2].height = tmp;
    setRectangles(newRectangles);
  };

  const drawRectangles = () => {
    const displayRectangles = new Array(rectangles?.length);
    for (let i = 0; i < rectangles.length; i++) {
      //const rec = rectangles[i];
      //const corner = rec.corner ? rec.corner : { x: 0, y: 0 };
      displayRectangles[i] = (
        <Rectangle
          // size={{ width: rec.width, height: rec.height }}
          // player={rec.player}
          // corner={corner}
          rectangle={rectangles[i]}
        />
      );
    }

    return displayRectangles;
  };

  const displayRectangles = drawRectangles();

  return (
    <div className="game">
      <div></div>
      <Board
        field={field}
        onMouseHoverCell={handleMouseHoverCell}
        onMouseClickCell={handleMouseClickCell}
        onMouseRightClickCell={handleMouseRightClickCell}
      >
        {displayRectangles}
      </Board>
      <History />
      <Dices />
    </div>
  );
}

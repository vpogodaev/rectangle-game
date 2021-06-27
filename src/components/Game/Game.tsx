import { useContext, useEffect } from 'react';
import { Players, GameStatus } from '../../models/common/enums';
import { ICell } from '../../models/common/interfaces';
import { Board } from '../Board/Board';
import { Dices } from '../Dices/Dices';
import { Score } from '../Score/Score';
import { Rectangle as RectangleComponent } from '../Rectangle/Rectangle';
import './styles.scss';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../App/App';
import Rectangle from '../../models/types/Rectangle';

export const Game: React.FC = observer(() => {
  const context = useContext(StoreContext);

  useEffect(() => {
    context.startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseHoverCell = (cell: ICell) => {
    context.moveRectangleTo(cell.point);
  };

  const handleMouseClickCell = () => {
    context.placeRectangle();
  };

  const handleMouseRightClickCell = () => {
    context.rollRectangle();
  };

  const handlePassBtn = () => {
    context.passMove();
  };

  const drawRectangles = () => {
    const getDrawableRectangle = (r: Rectangle, k: string) => (
      <RectangleComponent rectangle={r} key={k} />
    );

    const { curRectangle, rectangles } = context;

    const displayRectangles = new Array(rectangles?.length);
    for (let i = 0; i < rectangles.length; i++) {
      displayRectangles[i] = getDrawableRectangle(rectangles[i], `r-${i}`);
    }

    if (curRectangle) {
      displayRectangles.push(getDrawableRectangle(curRectangle, 'r-tmp'));
    }

    return displayRectangles;
  };

  const displayRectangles = drawRectangles();

  const onDicesRolledHandler = () => {
    context.rollDices();
  };

  const canRoll =
    context.gameStatus === GameStatus.PRIORITY_CHOOSE
      ? true
      : context.gameStatus === GameStatus.DICE_ROLL;

  const handleGiveUpBtn = () => {
    context.giveUp();
  };
  const canGiveUp =
    context.gameStatus === GameStatus.RECTANGLE_PLACE &&
    ((context.curPlayer === Players.PLAYER_1 && context.passes.player1 > 1) ||
      (context.curPlayer === Players.PLAYER_2 && context.passes.player2 > 1));

  const canPass =
    context.curRectangle &&
    !context.field.hasFieldSpaceForRectangle(
      context.curRectangle,
      context.rectangles.length < 2
    );

  // div-ы перед доской и костями для позиционирования в гриде
  // потом посмотреть, как сделать это нормально
  return (
    <div className="game">
      <div></div>
      <Board
        field={context.field}
        onMouseHoverCell={handleMouseHoverCell}
        onMouseClickCell={handleMouseClickCell}
        onMouseRightClickCell={handleMouseRightClickCell}
      >
        {displayRectangles}
      </Board>
      <Score
        gameStatus={context.gameStatus}
        curPlayer={context.curPlayer}
        score={context.score}
      />
      <div></div>
      <Dices
        dices={context.dices}
        canRoll={canRoll}
        onDicesRolled={onDicesRolledHandler}
      />
      <div className="btns">
        <button className="btn" onClick={handlePassBtn} disabled={!canPass}>
          Пропуск
        </button>
        <button className="btn" onClick={handleGiveUpBtn} disabled={!canGiveUp}>
          Закончить
        </button>
      </div>
    </div>
  );
});

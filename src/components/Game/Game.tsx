import { useContext, useEffect, useState } from 'react';
import { Players, GameStatus, DiceNum } from '../../models/common/enums';
import { IBox, ICell, IScore } from '../../models/common/interfaces';
//import TCell from '../../models/types/TCell';
import Field from '../../models/types/Field';
import TRectangle from '../../models/types/TRectangle';
import { Board } from '../Board/Board';
import { Dices } from '../Dices/Dices';
import { Score } from '../Score/Score';
import { Rectangle } from '../Rectangle/Rectangle';
import './styles.scss';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../App/App';

declare type TGameProps = {
  size: IBox;
};

declare interface IPasses {
  player1: number;
  player2: number;
}

export const Game: React.FC<TGameProps> = observer(({ size }) => {
  // const [curPlayer, setCurPlayer] = useState<Players>(Players.NONE);
  // const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.STOPPED); //useState<GameStatus>(GameStatus.STOPPED);
  // const [score, setScore] = useState<IScore>({ player1: 0, player2: 0 });
  // const [rectangles, setRectangles] = useState<TRectangle[]>(
  //   new Array<TRectangle>()
  // );
  // const [field] = useState<Field>(new Field(size));
  // const [curRectangle, setCurRectangle] = useState<TRectangle | null>(null);
  // const [canPass, setCanPass] = useState<boolean>(false);
  // const [passes, setPasses] = useState<IPasses>({ player1: 0, player2: 0 });

  const context = useContext(StoreContext);
  // Необходимо кинуть кубики для определения очередности
  useEffect(() => {
    context.startGame();

    // prod
    // setCurPlayer(Players.PLAYER_1);
    // setGameStatus(GameStatus.PRIORITY_CHOOSE);

    // test
    // const rects = [
    //   new TRectangle(3, 5, Players.PLAYER_1, { x: 0, y: 0 }),
    //   new TRectangle(4, 3, Players.PLAYER_2, { x: 4, y: 5 }),
    //   new TRectangle(3, 1, Players.PLAYER_1, { x: 3, y: 0 }),
    //   new TRectangle(1, 3, Players.PLAYER_2, { x: 5, y: 2 }),
    // ];
    // setRectangles(rects);
    // field.placeRectangle(rects[0], true);
    // field.placeRectangle(rects[1], true);
    // rects.slice(2).forEach((r) => field.placeRectangle(r));
    // setCurPlayer(Players.PLAYER_1);
    // setGameStatus(GameStatus.DICE_ROLL);

    // const rects = [
    //   new TRectangle(2, 3, Players.PLAYER_1, { x: 0, y: 0 }),
    //   new TRectangle(2, 3, Players.PLAYER_2, { x: 0, y: 0 }),
    //   new TRectangle(4, 2, Players.PLAYER_1, { x: 2, y: 2 }),
    //   new TRectangle(1, 3, Players.PLAYER_2, { x: 21, y: 15 }),
    // ];
    // setRectangles(rects);
    // field.placeRectangle(rects[0], true);
    // field.placeRectangle(rects[1], true);
    // rects.slice(2).forEach((r) => field.placeRectangle(r));

    // setCurPlayer(Players.PLAYER_1);
    // setGameStatus(GameStatus.DICE_ROLL);
  }, []);

  // useEffect(() => {
  //   //console.log('gameStatus', gameStatus);

  //   // если выбор очередности
  //   if (gameStatus === GameStatus.PRIORITY_CHOOSE) {
  //     if (score.player1 === 0 && score.player2 === 0) {
  //       return;
  //     }

  //     if (curPlayer === Players.PLAYER_1) {
  //       // если бросал кубики первый игрок, то просто переключаем на второго
  //       setCurPlayer(Players.PLAYER_2);
  //     } else {
  //       // если счет одинаковый, то нужно снова переключить на первого игрока
  //       if (score.player1 === score.player2) {
  //         setCurPlayer(Players.PLAYER_1);
  //       } else {
  //         // иначе меняем статус, ставим нужного игрока, обнуляем счет
  //         if (score.player1 > score.player2) {
  //           setCurPlayer(Players.PLAYER_1);
  //         } else {
  //           setCurPlayer(Players.PLAYER_2);
  //         }
  //         setGameStatus(GameStatus.DICE_ROLL);
  //         setScore({ player1: 0, player2: 0 });
  //       }
  //     }
  //   } else if (gameStatus === GameStatus.RECTANGLE_PLACE) {
  //     //todo: change
  //     setCurPlayer(
  //       curPlayer === Players.PLAYER_1 ? Players.PLAYER_2 : Players.PLAYER_1
  //     );
  //     setGameStatus(GameStatus.DICE_ROLL);
  //   }
  // }, [score]);

  const handleMouseHoverCell = (cell: ICell) => {
    const { gameStatus, curRectangle, rectangles, field } = context;

    if (gameStatus !== GameStatus.RECTANGLE_PLACE) {
      return;
    }
    if (!curRectangle) {
      console.error('handleMouseHoverCell curRectangle is not set', curRectangle);
      return;
    }
    if (
      curRectangle.placed ||
      !field.canMoveRectangleToPoint(curRectangle, cell.point)
    ) {
      return;
    }
    
    curRectangle.moveTo(cell.point);
    curRectangle.setCanBePlaced(
      field.canPlaceRectangle(curRectangle, rectangles.length < 2)
    );
  };
  const handleMouseClickCell = (cell: ICell) => {
    // if (!curRectangle) {
    //   return;
    // }
    // if (field.canPlaceRectangle(curRectangle, rectangles.length < 2)) {
    //   const newRectangles = rectangles.slice();
    //   field.placeRectangle(curRectangle, rectangles.length < 2);
    //   newRectangles.push(curRectangle);
    //   setRectangles(newRectangles);
    //   setCurRectangle(null);
    //   const newPasses = { ...passes };
    //   let { player1, player2 } = score;
    //   if (curPlayer === Players.PLAYER_1) {
    //     player1 += curRectangle.width * curRectangle.height;
    //     newPasses.player1 = 0;
    //   } else {
    //     player2 += curRectangle.width * curRectangle.height;
    //     newPasses.player2 = 0;
    //   }
    //   setPasses(newPasses);
    //   setScore({ player1, player2 });
    // }
    // if (!field.getFreeCellsCount()) {
    //   setGameStatus(GameStatus.FINISHED);
    // }
  };

  const handleMouseRightClickCell = (cell: ICell) => {
    // if (!curRectangle) {
    //   return;
    // }
    // if (!field.canRollRectangle(curRectangle)) {
    //   return;
    // }
    // const { width, height, player, corner, placed } = curRectangle;
    // const newRectangle = new TRectangle(width, height, player, corner, placed);
    // newRectangle.roll();
    // setCurRectangle(newRectangle);
  };

  const handlePassBtn = () => {
    // if (gameStatus !== GameStatus.RECTANGLE_PLACE) {
    //   return;
    // }
    // // setCurPlayer(
    // //   curPlayer === Players.PLAYER_1 ? Players.PLAYER_2 : Players.PLAYER_1
    // // );
    // if (curPlayer === Players.PLAYER_1) {
    //   setCurPlayer(Players.PLAYER_2);
    //   setPasses({ ...passes, player1: passes.player1 + 1 });
    // } else {
    //   setCurPlayer(Players.PLAYER_1);
    //   setPasses({ ...passes, player2: passes.player2 + 1 });
    // }
    // setCurRectangle(null);
    // setCanPass(false);
    // setGameStatus(GameStatus.DICE_ROLL);
  };

  const drawRectangles = () => {
    const getDrawableRectangle = (r: TRectangle, k: string) => (
      <Rectangle rectangle={r} key={k} />
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
  // context.gameStatus === GameStatus.PRIORITY_CHOOSE
  //   ? handlePriorityDicesRoll
  //   : handleGameDicesRoll;

  const canRoll =
    context.gameStatus === GameStatus.PRIORITY_CHOOSE
      ? true
      : context.gameStatus === GameStatus.DICE_ROLL
      ? true
      : false;

  const handleGiveUpBtn = () => {
    //setGameStatus(GameStatus.FINISHED);
  };
  const canGiveUp =
    context.gameStatus === GameStatus.RECTANGLE_PLACE &&
    ((context.curPlayer === Players.PLAYER_1 && context.passes.player1 > 1) ||
      (context.curPlayer === Players.PLAYER_2 && context.passes.player2 > 1));

  const canPass = false;

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
          Pass
        </button>
        <button className="btn" onClick={handleGiveUpBtn} disabled={!canGiveUp}>
          Give up
        </button>
      </div>
    </div>
  );
});

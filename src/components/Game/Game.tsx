import { useEffect, useState } from 'react';
import { Players, GameStatus, DiceNum } from '../../models/common/enums';
import { IScore } from '../../models/common/interfaces';
import TCell from '../../models/types/TCell';
import TField from '../../models/types/TField';
import TRectangle from '../../models/types/TRectangle';
import { Board } from '../Board/Board';
import { Dices } from '../Dices/Dices';
import { Score } from '../Score/Score';
import { Rectangle } from '../Rectangle/Rectangle';
import './styles.scss';

declare interface IPasses {
  player1: number;
  player2: number;
}

export default function Game({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const [curPlayer, setCurPlayer] = useState<Players>(Players.NONE);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.STOPPED); //useState<GameStatus>(GameStatus.STOPPED);
  const [score, setScore] = useState<IScore>({ player1: 0, player2: 0 });
  const [rectangles, setRectangles] = useState<TRectangle[]>(
    new Array<TRectangle>()
  );
  const [field, setField] = useState<TField>(new TField({ width, height }));
  const [curRectangle, setCurRectangle] = useState<TRectangle | null>(null);
  const [canPass, setCanPass] = useState<boolean>(false);
  const [passes, setPasses] = useState<IPasses>({ player1: 0, player2: 0 });

  // Необходимо кинуть кубики для определения очередности
  useEffect(() => {
    // prod
    setCurPlayer(Players.PLAYER_1);
    setGameStatus(GameStatus.PRIORITY_CHOOSE);

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

  useEffect(() => {
    console.log('gameStatus', gameStatus);

    // если выбор очередности
    if (gameStatus === GameStatus.PRIORITY_CHOOSE) {
      if (score.player1 === 0 && score.player2 === 0) {
        return;
      }

      if (curPlayer === Players.PLAYER_1) {
        // если бросал кубики первый игрок, то просто переключаем на второго
        setCurPlayer(Players.PLAYER_2);
      } else {
        // если счет одинаковый, то нужно снова переключить на первого игрока
        if (score.player1 === score.player2) {
          setCurPlayer(Players.PLAYER_1);
        } else {
          // иначе меняем статус, ставим нужного игрока, обнуляем счет
          if (score.player1 > score.player2) {
            setCurPlayer(Players.PLAYER_1);
          } else {
            setCurPlayer(Players.PLAYER_2);
          }
          setGameStatus(GameStatus.DICE_ROLL);
          setScore({ player1: 0, player2: 0 });
        }
      }
    } else if (gameStatus === GameStatus.RECTANGLE_PLACE) {
      //todo: change
      setCurPlayer(
        curPlayer === Players.PLAYER_1 ? Players.PLAYER_2 : Players.PLAYER_1
      );
      setGameStatus(GameStatus.DICE_ROLL);
    }
  }, [score]);

  const handlePriorityDicesRoll = (dice1: DiceNum, dice2: DiceNum) => {
    if (gameStatus !== GameStatus.PRIORITY_CHOOSE) {
      console.error(
        'handlePriorityDiceRoll call in wrong game status',
        gameStatus
      );
      return;
    }

    const dices = dice1 + dice2;
    const newScore = { ...score };
    if (curPlayer === Players.PLAYER_1) {
      newScore.player1 = dices;
    } else {
      newScore.player2 = dices;
    }

    setScore(newScore);
  };

  const handleGameDicesRoll = (dice1: DiceNum, dice2: DiceNum) => {
    if (curPlayer === Players.NONE) {
      console.error('handleGameDicesRoll cannot define player', curPlayer);
      return;
    }

    //ttest
    //const rectangle = new TRectangle(5, 4, curPlayer);
    const rectangle = new TRectangle(dice1, dice2, curPlayer);
    setCurRectangle(rectangle);
    setGameStatus(GameStatus.RECTANGLE_PLACE);

    //ttest
    const has = field.hasFieldSpaceForRectangle(
      rectangle,
      rectangles.length < 2
    );
    // console.log(`has place = ${has}`, rectangles.length);
    // console.log(rectangle);

    if (has) {
      setCanPass(false);
    } else {
      setCanPass(true);
    }
  };

  const handleMouseHoverCell = (cell: TCell) => {
    if (gameStatus !== GameStatus.RECTANGLE_PLACE) {
      return;
    }

    if (!curRectangle) {
      console.error('handleMouseHoverCell curRectangle is not set', curPlayer);
      return;
    }

    if (
      curRectangle.placed ||
      !field.canMoveRectangleToPoint(curRectangle, cell.point)
    ) {
      return;
    }

    const newRectangles = rectangles.slice();
    curRectangle.moveTo(cell.point);
    curRectangle.canBePlaced = field.canPlaceRectangle(
      curRectangle,
      rectangles.length < 2
    );
    setRectangles(newRectangles);
  };

  const handleMouseClickCell = (cell: TCell) => {
    if (!curRectangle) {
      return;
    }

    if (field.canPlaceRectangle(curRectangle, rectangles.length < 2)) {
      const newRectangles = rectangles.slice();
      field.placeRectangle(curRectangle, rectangles.length < 2);
      newRectangles.push(curRectangle);
      setRectangles(newRectangles);
      setCurRectangle(null);

      const newPasses = { ...passes };

      let { player1, player2 } = score;
      if (curPlayer === Players.PLAYER_1) {
        player1 += curRectangle.width * curRectangle.height;
        newPasses.player1 = 0;
      } else {
        player2 += curRectangle.width * curRectangle.height;
        newPasses.player2 = 0;
      }

      setPasses(newPasses);
      setScore({ player1, player2 });
    }

    if (!field.getFreeCellsCount()) {
      setGameStatus(GameStatus.FINISHED);
    }
  };

  const handleMouseRightClickCell = (cell: TCell) => {
    if (!curRectangle) {
      return;
    }

    if (!field.canRollRectangle(curRectangle)) {
      return;
    }

    const { width, height, player, corner, placed } = curRectangle;
    const newRectangle = new TRectangle(width, height, player, corner, placed);
    newRectangle.roll();

    setCurRectangle(newRectangle);
  };

  const handlePassBtn = () => {
    if (gameStatus !== GameStatus.RECTANGLE_PLACE) {
      return;
    }
    // setCurPlayer(
    //   curPlayer === Players.PLAYER_1 ? Players.PLAYER_2 : Players.PLAYER_1
    // );
    if (curPlayer === Players.PLAYER_1) {
      setCurPlayer(Players.PLAYER_2);
      setPasses({ ...passes, player1: passes.player1 + 1 });
    } else {
      setCurPlayer(Players.PLAYER_1);
      setPasses({ ...passes, player2: passes.player2 + 1 });
    }

    setCurRectangle(null);
    setCanPass(false);
    setGameStatus(GameStatus.DICE_ROLL);
  };

  const drawRectangles = () => {
    const getDrawableRectangle = (r: TRectangle, k: string) => (
      <Rectangle rectangle={r} key={k} />
    );

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

  const onDicesRolledHandler =
    gameStatus === GameStatus.PRIORITY_CHOOSE
      ? handlePriorityDicesRoll
      : handleGameDicesRoll;
  const canRoll =
    gameStatus === GameStatus.PRIORITY_CHOOSE
      ? true
      : gameStatus === GameStatus.DICE_ROLL
      ? true
      : false;

  const handleGiveUpBtn = () => {
    setGameStatus(GameStatus.FINISHED);
  };
  const canGiveUp =
    gameStatus === GameStatus.RECTANGLE_PLACE &&
    ((curPlayer === Players.PLAYER_1 && passes.player1 > 1) ||
      (curPlayer === Players.PLAYER_2 && passes.player2 > 1));

  // div-ы перед доской и костями для позиционирования в гриде
  // потом посмотреть, как сделать это нормально
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
      <Score gameStatus={gameStatus} curPlayer={curPlayer} score={score} />
      <div></div>
      <Dices canRoll={canRoll} onDicesRolled={onDicesRolledHandler} />
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
}

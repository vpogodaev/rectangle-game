import { useEffect, useState } from 'react';
import { Players, GameStatus, DiceNum } from '../../models/common/enums';
import { IScore } from '../../models/common/interfaces';
import TCell from '../../models/types/TCell';
import TField from '../../models/types/TField';
import TRectangle from '../../models/types/TRectangle';
import { Board } from '../Board/Board';
import { Dices } from '../Dices/Dices';
import { History } from '../History/History';
import { Rectangle } from '../Rectangle/Rectangle';
import './styles.scss';

// 1. Необходимо определить очередность

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

  // Необходимо кинуть кубики для определения очередности
  useEffect(() => {
    setCurPlayer(Players.PLAYER_1);
    setGameStatus(GameStatus.PRIORITY_CHOOSE);
  }, []);

  useEffect(() => {
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
      setCurPlayer(curPlayer === Players.PLAYER_1 ? Players.PLAYER_2 : Players.PLAYER_1);
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

    const rectangle = new TRectangle(dice1, dice2, curPlayer);
    setCurRectangle(rectangle);
    setGameStatus(GameStatus.RECTANGLE_PLACE);
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
    curRectangle.corner = cell.point;
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

      let { player1, player2 } = score;
      if (curPlayer === Players.PLAYER_1) {
        player1 += curRectangle.width * curRectangle.height;
      } else {
        player2 += curRectangle.width * curRectangle.height;
      }
      setScore({ player1, player2 });
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
      <History gameStatus={gameStatus} curPlayer={curPlayer} score={score} />
      <div></div>
      <Dices canRoll={canRoll} onDicesRolled={onDicesRolledHandler} />
    </div>
  );
}

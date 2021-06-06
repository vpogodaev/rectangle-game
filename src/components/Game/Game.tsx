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
    }
  }, [score]);

  const handlePriorityDicesRoll = (dice1: DiceNum, dice2: DiceNum) => {
    console.log('handlePriorityDicesRoll');

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

  const handleGameDicesRoll = (dice1: DiceNum, dice2: DiceNum) => {};

  // const switchStatus = () => {
  //   if (gameStatus === GameStatus.STOPPED) {
  //     setGameStatus(GameStatus.PRIORITY_CHOOSE);
  //     setDiceRollHandler(() => handlePriorityDiceRoll);

  //     switchPlayers();
  //   }
  //   else if (gameStatus === GameStatus.DICE_ROLL) {
  //     if (curPlayer === Players.PLAYER_1) {
  //       switchPlayers();
  //     } else {
  //       if (score.player1 === score.player2) {
  //         switchPlayers();
  //       } else {
  //         if (score.player1 > score.player2) {
  //           setCurPlayer(Players.PLAYER_1);
  //         } else
  //       }
  //       setGameStatus(GameStatus.DICE_ROLL);
  //     }
  //   }
  // }

  // const switchPlayers = () => {
  //   if (gameStatus === GameStatus.PRIORITY_CHOOSE) {
  //     if (curPlayer !== Players.PLAYER_1) {
  //       setCurPlayer(Players.PLAYER_1);
  //     } else {
  //       setCurPlayer(Players.PLAYER_2);
  //     }
  //   }
  // }

  const handleMouseHoverCell = (cell: TCell) => {
    return;
    // const rectangle = rectangles[2]; //todo: change

    // if (
    //   rectangle.placed ||
    //   !field.canMoveRectangleToPoint(rectangle, cell.point)
    // ) {
    //   return;
    // }

    // const newRectangles = rectangles.slice();
    // newRectangles[2].corner = cell.point;
    // newRectangles[2].canBePlaced = field.canPlaceRectangle(rectangles[2]);
    // setRectangles(newRectangles);
  };

  const handleMouseClickCell = (cell: TCell) => {
    // if (field.canPlaceRectangle(rectangles[2])) {
    //   const newRectangles = rectangles.slice();
    //   newRectangles[2].place();
    //   setRectangles(newRectangles);
    // }
    //console.log(field.canPlaceRectangle(rectangles[2]));
  };

  const handleMouseRightClickCell = (cell: TCell) => {
    // const rectangle = rectangles[2]; //todo: change
    // if (!field.canRollRectangle(rectangles[2])) {
    //   return;
    // }
    // const newRectangles = rectangles.slice();
    // newRectangles[2].roll();
    // setRectangles(newRectangles);
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
  
  const onDicesRolledHandler = gameStatus === GameStatus.PRIORITY_CHOOSE ? handlePriorityDicesRoll : handleGameDicesRoll;

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
      <Dices canRoll={true} onDicesRolled={onDicesRolledHandler} />
    </div>
  );
}

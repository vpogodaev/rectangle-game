import { GameStatus, Players } from '../../models/common/enums';
import { IScore } from '../../models/common/interfaces';
import './styles.scss';

declare type TScoreProps = {
  gameStatus: GameStatus;
  curPlayer: Players;
  score: IScore;
};

const status = {
  '0': 'Игра не начата',
  '1': 'Определение очередности',
  '2': 'Бросок костей',
  '3': 'Расположение фигуры',
  '4': 'Конец!',
};

const player = {
  none: '',
  player1: 'Игрок 1',
  player2: 'Игрок 2',
};

export const Score: React.FC<TScoreProps> = ({
  gameStatus,
  curPlayer,
  score,
}) => {
  // это нечитабельно, конечно
  const scoreSubHeader =
    gameStatus === GameStatus.DICE_ROLL ||
    gameStatus === GameStatus.RECTANGLE_PLACE ||
    gameStatus === GameStatus.PRIORITY_CHOOSE
      ? 'Ходит '
      : gameStatus === GameStatus.FINISHED
      ? score.player1 === score.player2
        ? 'Ничья'
        : 'Победил '
      : '';
  const playerSubHeader =
    gameStatus === GameStatus.FINISHED
      ? score.player1 === score.player2
        ? ''
        : score.player1 > score.player2
        ? player[Players.PLAYER_1]
        : player[Players.PLAYER_2]
      : player[curPlayer];

  return (
    <div className="score">
      <h2 className="score__header">{status[gameStatus]}</h2>
      <h3>
        {scoreSubHeader}
        <span className="score-header__player">
          {playerSubHeader}
        </span>
      </h3>
      Счет:
      <div className="score__main">
        <div className="score__player">Игрок 1:</div>
        <div className="score__score">{score.player1}</div>
        <div className="score__player">Игрок 2:</div>
        <div className="score__score">{score.player2}</div>
      </div>
    </div>
  );
};

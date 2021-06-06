import { GameStatus, Players } from '../../models/common/enums';
import { IScore } from '../../models/common/interfaces';
import './styles.scss';

declare type THistoryProps = {
  gameStatus: GameStatus;
  curPlayer: Players;
  score: IScore;
};

export const History: React.FC<THistoryProps> = ({ gameStatus, curPlayer, score }) => {
  const headerStatus = {
    '0': 'Игра не начата',
    '1': 'Определение очередности',
    '2': 'Бросок костей',
    '3': 'Расположение фигуры',
    '4': 'Конец!',
  };

  const subHeaderPlayer = {
    'none': '',
    'player1': 'Игрок 1',
    'player2': 'Игрок 2'
  }

  return (
    <div className="history">
      <h2>{headerStatus[gameStatus]}</h2>
      <h3>Ходит {subHeaderPlayer[curPlayer]}</h3>
      Счет:
      <div className="score">
        <div className="score__player">Игрок 1:</div><div className="score__score">{score.player1}</div>
        <div className="score__player">Игрок 2:</div><div className="score__score">{score.player2}</div>
      </div>
    </div>
  );
};

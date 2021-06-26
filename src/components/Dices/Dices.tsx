import { useState } from 'react';
import { DiceNum } from '../../models/common/enums';
import { Dice } from './Dice/Dice';
import './styles.scss';

declare type TDicesProps = {
  dices: [DiceNum, DiceNum];
  canRoll: boolean;
  onDicesRolled: () => void;
};

export const Dices: React.FC<TDicesProps> = ({
  canRoll,
  dices,
  onDicesRolled,
}) => {
  const [rerender, setRerender] = useState<0 | 1>(0);

  const rollBtnClickHandler = () => {
    onDicesRolled();
    setRerender(rerender ? 0 : 1);
  };

  return (
    <div className="dices-wrapper">
      <Dice diceNum={dices[0]} rerender={rerender} />
      <button
        className="roll-btn"
        onClick={rollBtnClickHandler}
        disabled={!canRoll}
      >
        Roll
      </button>
      <Dice diceNum={dices[1]} rerender={rerender} />
    </div>
  );
};

import { useState } from 'react';
import { DiceNum } from '../../models/common/enums';
import { Dice } from './Dice/Dice';
import './styles.scss';

declare type TDicesProps = {
  canRoll: boolean;
  onDicesRolled: (dice1: DiceNum, dice2: DiceNum) => void;
};

export const Dices: React.FC<TDicesProps> = ({ canRoll, onDicesRolled }) => {
  const [dice1, setDice1] = useState<DiceNum>(DiceNum._1);
  const [dice2, setDice2] = useState<DiceNum>(DiceNum._1);
  const [rerender, setRerender] = useState<0 | 1>(0);

  const randomDiceNum = (): DiceNum => {
    const num: number = Math.floor(Math.random() * 6) + 1;
    // @ts-ignore
    return DiceNum[`_${num}`];
  };

  const rollBtnClickHandler = () => {
    const newDice1 = randomDiceNum();
    const newDice2 = randomDiceNum();
    setDice1(newDice1);
    setDice2(newDice2);
    setRerender(rerender ? 0 : 1);
    onDicesRolled(newDice1, newDice2);
  };

  return (
    <div className="dices-wrapper">
      <Dice diceNum={dice1} rerender={rerender} />
      <button className="roll-btn" onClick={rollBtnClickHandler} disabled={!canRoll}>
        Roll
      </button>
      <Dice diceNum={dice2} rerender={rerender} />
    </div>
  );
};

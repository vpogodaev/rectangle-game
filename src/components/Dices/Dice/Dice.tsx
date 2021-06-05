import { DiceNum } from '../../../models/common/enums';
import './styles.scss';

declare type TDiceProps = {
  diceNum: DiceNum;
  rerender: 0 | 1;
};

export const Dice: React.FC<TDiceProps> = ({
  diceNum,
  rerender,
}): JSX.Element => {
  const _1 = () => {
    return (
      <>
        <div className="dice__dot dice__dot_d22"></div>
      </>
    );
  };
  const _2 = () => {
    return (
      <>
        <div className="dice__dot dice__dot_d13"></div>
        <div className="dice__dot dice__dot_d31"></div>
      </>
    );
  };
  const _3 = () => {
    return (
      <>
        <div className="dice__dot dice__dot_d13"></div>
        <div className="dice__dot dice__dot_d22"></div>
        <div className="dice__dot dice__dot_d31"></div>
      </>
    );
  };
  const _4 = () => {
    return (
      <>
        <div className="dice__dot dice__dot_d11"></div>
        <div className="dice__dot dice__dot_d13"></div>
        <div className="dice__dot dice__dot_d31"></div>
        <div className="dice__dot dice__dot_d33"></div>
      </>
    );
  };
  const _5 = () => {
    return (
      <>
        <div className="dice__dot dice__dot_d11"></div>
        <div className="dice__dot dice__dot_d13"></div>
        <div className="dice__dot dice__dot_d22"></div>
        <div className="dice__dot dice__dot_d31"></div>
        <div className="dice__dot dice__dot_d33"></div>
      </>
    );
  };
  const _6 = () => {
    return (
      <>
        <div className="dice__dot dice__dot_d11"></div>
        <div className="dice__dot dice__dot_d13"></div>
        <div className="dice__dot dice__dot_d21"></div>
        <div className="dice__dot dice__dot_d23"></div>
        <div className="dice__dot dice__dot_d31"></div>
        <div className="dice__dot dice__dot_d33"></div>
      </>
    );
  };

  const diceFactory = {
    '1': _1(),
    '2': _2(),
    '3': _3(),
    '4': _4(),
    '5': _5(),
    '6': _6(),
  };

  return (
    <div className="dice" key={rerender}>
      {diceFactory[diceNum]}
    </div>
  );
};

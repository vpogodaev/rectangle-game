import { action, makeObservable, observable } from 'mobx';
import { DiceNum, GameStatus, Players } from '../models/common/enums';
import { IBox, IPasses, IScore } from '../models/common/interfaces';
import Field from '../models/types/Field';
import Rectangle from '../models/types/Rectangle';

/**
 * Максимальное количество точек на кубике
 */
const MAX_DOTS = 6;

export default class GameStore {
  /**
   *
   */
  constructor(size: IBox) {
    makeObservable(this, {
      gameStatus: observable,
      dices: observable,
      score: observable,
      curPlayer: observable,
      curRectangle: observable,
      startGame: action,
      rollDices: action,
    });

    this.field = new Field(size);
    this.curPlayer = Players.NONE;
    this.gameStatus = GameStatus.STOPPED;
    this.score = { player1: 0, player2: 0 };
    this.rectangles = new Array<Rectangle>();
    this.curRectangle = null;
    this.dices = [DiceNum._1, DiceNum._1];
    this.passes = { player1: 0, player2: 0 };
  }

  field: Field;
  curPlayer: Players;
  gameStatus: GameStatus;
  score: IScore;
  rectangles: Rectangle[];
  curRectangle: Rectangle | null;
  dices: [DiceNum, DiceNum];
  passes: IPasses;

  startGame = () => {
    this.curPlayer = Players.PLAYER_1;
    this.gameStatus = GameStatus.PRIORITY_CHOOSE;
  };

  rollDices = () => {
    if (
      ![GameStatus.DICE_ROLL, GameStatus.PRIORITY_CHOOSE].includes(
        this.gameStatus
      )
    ) {
      console.error(
        `"rollDices" function called with gameStatus = ${this.gameStatus}`
      );

      return;
    }

    const randomDiceNum = (): DiceNum => {
      const num: number = Math.floor(Math.random() * MAX_DOTS) + 1;
      // @ts-ignore
      return DiceNum[`_${num}`];
    };

    this.dices = [randomDiceNum(), randomDiceNum()];

    if (this.gameStatus === GameStatus.PRIORITY_CHOOSE) {
      this.rollPriorityDices();
    } else {
      this.rollSizeDices();
    }

    if (this.curPlayer === Players.PLAYER_1) {
      // если бросал кубики первый игрок, то просто переключаем на второго
      this.curPlayer = Players.PLAYER_2;
    } else {
      // если счет одинаковый, то нужно снова переключить на первого игрока
      if (this.score.player1 === this.score.player2) {
        this.curPlayer = Players.PLAYER_1;
      } else {
        // иначе меняем статус, ставим нужного игрока, обнуляем счет
        this.curPlayer =
          this.score.player1 > this.score.player2
            ? Players.PLAYER_1
            : Players.PLAYER_2;

        this.gameStatus = GameStatus.DICE_ROLL;
        this.score = { player1: 0, player2: 0 };
      }
    }
  };

  private rollPriorityDices = () => {
    // красиво, но слишком заумно, т.к. у нас всегда 2 элемента
    // const playerScore = this.dices.reduce((d1, d2) => d1 + d2);
    const playerScore = this.dices[0] + this.dices[1];

    if (this.curPlayer === Players.PLAYER_1) {
      this.score.player1 = playerScore;
    } else {
      this.score.player2 = playerScore;
    }
  };

  private rollSizeDices = () => {
    const curPlayer = this.curPlayer;

    if (curPlayer === Players.NONE) {
      console.error('rollSizeDices cannot define player', curPlayer);
      return;
    }

    const rectangle = new Rectangle(this.dices[0], this.dices[1], curPlayer);
    this.curRectangle = rectangle;
    this.gameStatus = GameStatus.RECTANGLE_PLACE;

    // const has = this.field.hasFieldSpaceForRectangle(
    //   rectangle,
    //   this.rectangles.length < 2
    // );

    // if (has) {
    //   setCanPass(false);
    // } else {
    //   setCanPass(true);
    // }
  };
}

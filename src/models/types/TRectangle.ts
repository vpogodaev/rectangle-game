import { Players } from '../common/enums';
import { IPoint } from '../common/interfaces';

export default class TRectangle {
  /**
   *
   */
  constructor(width: number, height: number, player: Players.PLAYER_1 | Players.PLAYER_2, corner: IPoint | null = null) {
    this.width = width;
    this.height = height;
    this.corner = corner;
    this.player = player;
  }
  width: number;
  height: number;
  /** left upper corner */
  corner: IPoint | null;
  player: Players.PLAYER_1 | Players.PLAYER_2;
}

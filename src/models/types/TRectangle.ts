//import { Players } from '../common/enums';
import { CellStatus } from '../common/enums';
import { IPoint } from '../common/interfaces';

export default class TRectangle {
  /**
   *
   */
  constructor(
    width: number,
    height: number,
    player: CellStatus.PLAYER_1 | CellStatus.PLAYER_2,
    corner: IPoint = { x: 0, y: 0 },
    placed: boolean = false
  ) {
    this.width = width;
    this.height = height;
    this.corner = corner;
    this.player = player;
    this.placed = placed;
    this.canBePlaced = true;
  }
  width: number;
  height: number;
  /** left upper corner */
  corner: IPoint;
  player: CellStatus.PLAYER_1 | CellStatus.PLAYER_2;
  placed: boolean;
  canBePlaced: boolean;

  place(corner?: IPoint) {
    if (corner) {
      this.corner = corner;
    }
    if (!this.corner) {
      return false;
    }
    this.placed = true;
  }

  roll() {
    const tmp = this.width;
    this.width = this.height;
    this.height = tmp;
  }
}

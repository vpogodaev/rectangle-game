import { Players } from '../common/enums';
import { IPoint } from '../common/interfaces';

export default class TRectangle {
  /**
   *
   */
  constructor(
    width: number,
    height: number,
    player: Players.PLAYER_1 | Players.PLAYER_2,
    corner: IPoint = { x: 0, y: 0 },
    placed: boolean = false
  ) {
    this.width = width;
    this.height = height;
    this.player = player;
    this.corner = corner;
    this.placed = placed;
    this.canBePlaced = false;
  }

  width: number;
  height: number;
  /** left upper corner */
  corner: IPoint;
  player: Players.PLAYER_1 | Players.PLAYER_2;
  placed: boolean;
  canBePlaced: boolean;

  moveTo(point: IPoint) {
    const { x, y } = point;
    this.corner = { x, y };
  }

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

  copy(): TRectangle {
    return new TRectangle(
      this.width,
      this.height,
      this.player,
      this.corner,
      this.placed
    );
  }
}

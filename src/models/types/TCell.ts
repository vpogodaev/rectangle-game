import { Players } from '../common/enums';
import { IPoint } from '../common/interfaces';

export default class TCell {
  /**
   *
   */
  constructor(status: Players, point: IPoint) {
    this.status = status;
    this.point = point;
  }

  status: Players;
  point: IPoint;
}

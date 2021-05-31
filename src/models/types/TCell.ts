import { CellStatus } from '../common/enums';
import { IPoint } from '../common/interfaces';

export default class TCell {
  /**
   *
   */
  constructor(status: CellStatus, point: IPoint) {
    this.status = status;
    this.point = point;
  }

  status: CellStatus;
  point: IPoint;
}

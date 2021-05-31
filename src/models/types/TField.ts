import { CellStatus } from '../common/enums';
import { IBox } from '../common/interfaces';
import TCell from './TCell';
import TRectangle from './TRectangle';

export {};

export default class TField {
  /**
   *
   */
  constructor(size: IBox) {
    this.width = size.width;
    this.height = size.height;
    this.field = this.initField();
  }

  width: number;
  height: number;
  field: TCell[][];

  placeRectangle = (rectangle: TRectangle) : boolean => {
    if (!rectangle.corner) {
      return false;
    }

    // нужна ли эта проверка, если предполагается, что до того как ставить, будет вызвана эта функция?
    // пускай пока будет, можно будет не уточнять снаружи перед вызовом
    if (!this.canPlaceRectangle(rectangle)) {
      return false;
    }

    const { x, y } = rectangle.corner;
    const { width, height } = rectangle;

    const maxRH = height + y;
    const maxRW = width + x;

    for (let i = y; i < (this.height > maxRH ? maxRH : this.height); i++) {
      for (let j = x; j < (this.width > maxRW ? maxRW : this.width); j++) {
        this.field[i][j].status = rectangle.player;
      }
    }

    return true;
  }

  canPlaceRectangle = (rectangle: TRectangle) : boolean => {
    // todo: потом поменять условие
    if (!rectangle.corner) {
      return false;
    }

    const { x, y } = rectangle.corner;
    const { width, height } = rectangle;

    const maxRH = height + y;
    const maxRW = width + x;

    for (let i = y; i < (this.height > maxRH ? maxRH : this.height); i++) {
      for (let j = x; j < (this.width > maxRW ? maxRW : this.width); j++) {
        if (this.field[i][j].status !== CellStatus.NONE) {
          return false;
        }
      }
    }

    return true;
  };

  private initField(): TCell[][] {
    const field = new Array(this.height);
    for (let i = 0; i < this.height; i++) {
      const row = new Array(this.width);
      for (let j = 0; j < this.width; j++) {
        row[j] = new TCell(CellStatus.NONE, { x: j, y: i });
      }
      field[i] = row;
    }

    return field;
  }
}

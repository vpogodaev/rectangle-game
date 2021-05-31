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
  field: TCell[][]; // нужно обращаться через [y][x]

  placeRectangle = (rectangle: TRectangle, first: boolean = false): boolean => {
    if (first) {
      return this.placeFirstRectangle(rectangle);
    }

    if (!rectangle.corner) {
      return false;
    }

    // нужна ли эта проверка, если предполагается, что до того как ставить, будет вызвана эта функция?
    // пускай пока будет, можно будет не уточнять снаружи перед вызовом
    if (!this.canPlaceRectangle(rectangle)) {
      return false;
    }

    this._placeRectangle(rectangle);

    return true;
  };

  canPlaceRectangle = (rectangle: TRectangle): boolean => {
    // todo: потом поменять условие
    if (!rectangle.corner || rectangle.placed) {
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

    const aroundCells: TCell[] = this.getCellsAroundRectangle(rectangle);
    
    if (aroundCells.some((c) => c.status === rectangle.player)) {
      return true;
    }

    return false;
  };

  private _placeRectangle(rectangle: TRectangle) {
    const { x, y } = rectangle.corner!;
    const { width, height } = rectangle;

    const maxRH = height + y;
    const maxRW = width + x;

    for (let i = y; i < (this.height > maxRH ? maxRH : this.height); i++) {
      for (let j = x; j < (this.width > maxRW ? maxRW : this.width); j++) {
        this.field[i][j].status = rectangle.player;
      }
    }

    rectangle.place();
  }

  private placeFirstRectangle(rectangle: TRectangle): boolean {
    if (
      this.field.some((row) =>
        row.some((cell) => cell.status === rectangle.player)
      )
    ) {
      return false;
    }

    if (rectangle.player === CellStatus.PLAYER_1) {
      rectangle.corner = { x: 0, y: 0 };
    } else {
      const x = this.width - rectangle.width;
      const y = this.height - rectangle.height;
      rectangle.corner = { x, y };
    }
    this._placeRectangle(rectangle);

    return true;
  }

  private getCellsAroundRectangle(rectangle: TRectangle): TCell[] {
    const recCells: Set<TCell> = new Set<TCell>(
      this.getRectangleCells(rectangle)
    );

    const set: Set<TCell> = new Set<TCell>();
    recCells.forEach((recCell) => {
      const { x, y } = recCell.point;
      const aroundCells = [];
      let i = 0;
      if (x > 0 && !recCells.has(this.field[y][x - 1])) {
        aroundCells[i++] = this.field[y][x - 1];
      }
      if (x < this.width && !recCells.has(this.field[y][x + 1])) {
        aroundCells[i++] = this.field[y][x + 1];
      }
      if (y > 0 && !recCells.has(this.field[y - 1][x])) {
        aroundCells[i++] = this.field[y - 1][x];
      }
      if (y < this.height && !recCells.has(this.field[y + 1][x])) {
        aroundCells[i++] = this.field[y + 1][x];
      }

      aroundCells.forEach((aroundCell) => {
        if (!set.has(aroundCell)) {
          set.add(aroundCell);
        }
      });
    });

    return Array.from(set.values());
  }

  private getRectangleCells(rectangle: TRectangle): TCell[] {
    if (!rectangle.corner) {
      return [];
    }

    const { x, y } = rectangle.corner;
    const { width, height } = rectangle;

    const maxRH = height + y;
    const maxRW = width + x;

    const cells: TCell[] = [];
    let ind = 0;
    for (let i = y; i < (this.height > maxRH ? maxRH : this.height); i++) {
      for (let j = x; j < (this.width > maxRW ? maxRW : this.width); j++) {
        cells[ind++] = this.field[i][j];
      }
    }

    return cells;
  }

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

import { Players } from '../common/enums';
import { IBox, IPoint } from '../common/interfaces';
import TCell from './TCell';
import TRectangle from './TRectangle';

export {};

/**
 * Игровое поле
 */
export default class TField {
  /**
   *
   * @param size Размеры поля
   */
  constructor(size: IBox) {
    this.width = size.width;
    this.height = size.height;
    this.field = this.initField();
  }

  /** Ширина */
  width: number;
  /** Высота */
  height: number;
  /** Массив клеток. Обращаться через [y][x] */
  field: TCell[][];

  /**
   * Расположить прямоугольник на поле
   * @param rectangle Прямоугольник
   * @param first Первый прямоугольник игрока или нет. TODO: это можно проверить и в самом классе, переделать
   * @returns true - если удалось расположить, false - если не удалось
   */
  placeRectangle = (rectangle: TRectangle, first: boolean = false): boolean => {
    // Особый сценарий для первого
    if (first) {
      return this.placeFirstRectangle(rectangle);
    }

    // нужна ли эта проверка, если предполагается, что до того как ставить, будет вызвана эта функция?
    // пускай пока будет, можно будет не уточнять снаружи перед вызовом
    if (!this.canPlaceRectangle(rectangle, first)) {
      return false;
    }

    // "Реальная" функция расположения
    this._placeRectangle(rectangle);
    // Закрепляем сам прямоугольник
    rectangle.place();

    return true;
  };

  /**
   * Можно ли расположить прямоугольник там, где он сейчас находится
   * @param rectangle Прямоугольник
   * @param first Первый прямоугольник игрока или нет. TODO: это можно проверить и в самом классе, переделать
   * @returns true - можно, false - нельзя
   */
  canPlaceRectangle = (
    rectangle: TRectangle,
    first: boolean = false
  ): boolean => {
    // todo: потом поменять условие?
    if (rectangle.placed) {
      return false;
    }

    // x, y -- левый верхний угол
    const { x, y } = rectangle.corner;
    const { width, height } = rectangle;

    // Особая проверка для первого прямоугольника игрока.
    // Для первого игрока всё просто, для второго нужно вычислить.
    // todo: 1. либо убрать проверки у первого, либо добавить у второго 2. вынести?
    if (first) {
      if (rectangle.player === Players.PLAYER_1) {
        if (this.field[0][0].status !== Players.NONE) {
          console.error(
            'canPlaceRectangle first player corner is taken',
            this.field[0][0]
          );
          return false;
        }

        return x === 0 && y === 0;
      } else {
        const xToPlace = this.width - width;
        const yToPlace = this.height - height;

        return x === xToPlace && y === yToPlace;
      }
    }

    // правый нижний угол
    const maxRH = height + y;
    const maxRW = width + x;

    // Если вышли за рамки поля -- нельзя
    for (let i = y; i < (this.height > maxRH ? maxRH : this.height); i++) {
      for (let j = x; j < (this.width > maxRW ? maxRW : this.width); j++) {
        if (this.field[i][j].status !== Players.NONE) {
          return false;
        }
      }
    }

    // Берем клетки вокруг прямоугольника, там дожен быть этот же игрок
    const aroundCells: TCell[] = this.getCellsAroundRectangle(rectangle);
    if (aroundCells.some((c) => c.status === rectangle.player)) {
      return true;
    }

    return false;
  };

  canMoveRectangleToPoint = (rectangle: TRectangle, point: IPoint): boolean => {
    const { width, height } = rectangle;
    const { x, y } = point;

    if (width + x > this.width || height + y > this.height) {
      return false;
    }
    return true;
  };

  canRollRectangle = (rectangle: TRectangle): boolean => {
    // а можно копировать объект вместе со всеми методами?
    const tmpRectangle = { ...rectangle, roll: rectangle.roll };
    tmpRectangle.roll();
    if (
      this.canMoveRectangleToPoint(
        tmpRectangle as TRectangle,
        tmpRectangle.corner
      )
    ) {
      return true;
    }

    return false;
  };

  hasFieldSpaceForRectangle = (
    rectangle: TRectangle,
    isFirst: boolean
  ): boolean => {
    const cellsToPlace: TCell[] = [];
    const minHeight =
      rectangle.height < rectangle.width ? rectangle.height : rectangle.width;
    const minWidth =
      rectangle.width < rectangle.height ? rectangle.width : rectangle.height;
    this.field.forEach((row) => {
      if (row[0].point.y + minHeight > this.height) {
        return;
      }
      cellsToPlace.push(
        ...row.filter(
          (c) => c.status === Players.NONE && c.point.x + minWidth < this.width
        )
      );
    });

    const check = (r: TRectangle): boolean => {
      // foreach не подходит, т.к. он не выходит из check'а
      for (let i = 0; i < cellsToPlace.length; i++) {
        r.moveTo(cellsToPlace[i].point);

        if (this.canPlaceRectangle(r, isFirst)) {
          return true;
        }
      }

      return false;
    };

    const tmpRect = rectangle.copy();
    if (check(tmpRect)) {
      return true;
    }
    tmpRect.roll();
    if (check(tmpRect)) {
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

    if (rectangle.player === Players.PLAYER_1) {
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
      if (x < this.width - 1 && !recCells.has(this.field[y][x + 1])) {
        aroundCells[i++] = this.field[y][x + 1];
      }
      if (y > 0 && !recCells.has(this.field[y - 1][x])) {
        aroundCells[i++] = this.field[y - 1][x];
      }
      if (y < this.height - 1 && !recCells.has(this.field[y + 1][x])) {
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
        row[j] = new TCell(Players.NONE, { x: j, y: i });
      }
      field[i] = row;
    }

    return field;
  }
}

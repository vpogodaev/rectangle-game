import { action, makeObservable, observable } from 'mobx';
import { Players } from '../common/enums';
import { IBox, ICell, IPoint } from '../common/interfaces';
//import TCell from './TCell';
import TRectangle from './TRectangle';

export {};

/**
 * Игровое поле
 */
export default class Field {
  /**
   *
   * @param size Размеры поля
   */
  constructor(size: IBox) {
    // т.к. тут почти все не нуждается в отслеживании, проще вручную
    makeObservable(this, {
      field: observable,
      placeRectangle: action,
    });

    this.width = size.width;
    this.height = size.height;
    this.field = this.initField();
  }

  /** Ширина */
  width: number;
  /** Высота */
  height: number;
  /** Массив клеток. Обращаться через [y][x] */
  field: ICell[][];

  /**
   * Расположить прямоугольник на поле - клетки помечаются как занятые
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

    // Проверяем, что прямоугольник на пустых клетках
    const rCells = this.getRectangleCells(rectangle);
    if (rCells === -1 || rCells.some((c) => c.status !== Players.NONE)) {
      return false;
    }

    // Берем клетки вокруг прямоугольника, там дожен быть этот же игрок
    const aroundCells: ICell[] | -1 = this.getCellsAroundRectangle(rectangle);
    if (aroundCells === -1) {
      return false;
    }
    if (aroundCells.some((c) => c.status === rectangle.player)) {
      return true;
    }

    return false;
  };

  /**
   * Можно ли передвинуть прямоугольник к указанной точке
   * @param rectangle Прямоугольник
   * @param point Точка, куда необходимо передвинуть
   * @returns true - можно, false - нельзя
   */
  canMoveRectangleToPoint = (rectangle: TRectangle, point: IPoint): boolean => {
    const { width, height } = rectangle;
    const { x, y } = point;

    if (width + x > this.width || height + y > this.height) {
      return false;
    }
    return true;
  };

  /**
   * Можно ли развернуть прямоугольник. Т.е. есть ли место для его разворота
   * @param rectangle Прямоугольник
   * @returns true - можно, false - нельзя
   */
  canRollRectangle = (rectangle: TRectangle): boolean => {
    // а можно копировать объект вместе со всеми методами?
    //const tmpRectangle = { ...rectangle, roll: rectangle.roll };
    const tmpRectangle = rectangle.copy();
    tmpRectangle.roll();
    if (this.canMoveRectangleToPoint(tmpRectangle, tmpRectangle.corner)) {
      return true;
    }

    return false;
  };

  /**
   * Получение количества незанятых клеток
   * todo: нигде не используется, убрать
   * @returns Количество клеток
   */
  getFreeCellsCount = (): number => {
    let count = 0;
    this.field.forEach((r) =>
      r.forEach((c) => {
        if (c.status === Players.NONE) {
          count++;
        }
      })
    );
    return count;
  };

  /**
   * Есть ли место на поле под прямоугольник. Т.е. этот прямоугольник присоединить к области игрока
   * @param rectangle Прямоугольник
   * @param first Первый прямоугольник игрока или нет. TODO: это можно проверить и в самом классе, переделать
   * @returns true - можно, false - нельзя
   */
  hasFieldSpaceForRectangle = (
    rectangle: TRectangle,
    isFirst: boolean
  ): boolean => {
    // угловые клетки, которые подходят в первом приближении (т.е. без учета остальных)
    const cellsToPlaceIn: ICell[] = [];
    const minHeight =
      rectangle.height < rectangle.width ? rectangle.height : rectangle.width;
    const minWidth =
      rectangle.width < rectangle.height ? rectangle.width : rectangle.height;
    this.field.forEach((row) => {
      if (row[0].point.y + minHeight > this.height) {
        return;
      }
      cellsToPlaceIn.push(
        ...row.filter(
          (c) => c.status === Players.NONE && c.point.x + minWidth <= this.width
        )
      );
    });

    const check = (r: TRectangle): boolean => {
      // foreach не подходит, т.к. он не выходит из check'а
      for (let i = 0; i < cellsToPlaceIn.length; i++) {
        r.moveTo(cellsToPlaceIn[i].point);

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

  /**
   * Функция для расположения прямоугольника на поле.
   * Логика в отдельной функции, т.к. вызывается в обычном расположении и в расположении первого прямоугольника
   * @param rectangle Прямоугольник
   */
  private _placeRectangle(rectangle: TRectangle) {
    const { x, y } = rectangle.corner!;
    const { width, height } = rectangle;

    const maxRH = height + y;
    const maxRW = width + x;

    // Тут нужны дополнительные проверки, чтобы не выйти за поле или наоборот не возникла ситуация, когда кусок прямоугольника не отметится на поле?
    for (let i = y; i < (this.height > maxRH ? maxRH : this.height); i++) {
      for (let j = x; j < (this.width > maxRW ? maxRW : this.width); j++) {
        this.field[i][j].status = rectangle.player;
      }
    }

    rectangle.place();
  }

  /**
   * Функция по расположению первого прямоугольника на поле. Первый прямоугольник -- особый случай, должен быть расположен в углу и не присоединен к другим.
   * todo:
   *  1) пересмотреть - возможно метод не нужен, т.к. есть проверки первый-не первый, можно ли расположить и т.д.
   *  2) если оставляем, возможно необходимо переделывать проверки, т.к. тут отдельно расчитывается угол, в который ставится прямоугольник,
   *      т.е. можно хоть из центра его воткнуть, в этом методе всё равно пересчитаем угол для расположения
   * @param rectangle Прямоугольник
   * @returns true - удалось расположить, false - не удалось todo: возможно стоит переделать на exception, т.к. возвращать что-то излишне
   */
  private placeFirstRectangle(rectangle: TRectangle): boolean {
    if (
      this.field.some((row) =>
        row.some((cell) => cell.status === rectangle.player)
      )
    ) {
      return false;
    }

    if (rectangle.player === Players.PLAYER_1) {
      rectangle.moveTo({ x: 0, y: 0 });
    } else {
      const x = this.width - rectangle.width;
      const y = this.height - rectangle.height;
      rectangle.moveTo({ x, y });
    }

    this._placeRectangle(rectangle);

    return true;
  }

  /**
   * Получение клеток, которые находятся по периметру прямоугольника (без угловых, т.к. они не нужны)
   * @param rectangle Прямоугольник
   * @returns Массив клеток | -1 - если не удалось получить прямоугольник
   */
  private getCellsAroundRectangle(rectangle: TRectangle): ICell[] | -1 {
    const r = this.getRectangleCells(rectangle);
    if (r === -1) {
      return -1;
    }
    const recCells: Set<ICell> = new Set<ICell>(r);

    const set: Set<ICell> = new Set<ICell>();
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

  /**
   * Получить клетки прямоугольника
   * @param rectangle Прямоугольник
   * @returns Массив клеток прямоугольника | -1, если прямоугольник не может тут располагаться
   */
  private getRectangleCells(rectangle: TRectangle): ICell[] | -1 {
    if (!rectangle.corner) {
      return [];
    }

    const { x, y } = rectangle.corner;
    const { width, height } = rectangle;

    const maxRH = height + y;
    const maxRW = width + x;

    const cells: ICell[] = [];
    let ind = 0;
    for (let i = y; i < (this.height > maxRH ? maxRH : this.height); i++) {
      for (let j = x; j < (this.width > maxRW ? maxRW : this.width); j++) {
        cells[ind++] = this.field[i][j];
      }
    }

    // Это проверка, если количество клеток не равно длине на высоту, значит прямоугольник не влез (или типа того)
    // todo: заменить на exception?
    if (ind !== width * height) {
      return -1;
    }

    return cells;
  }

  /**
   * Создание клеток под поле
   * @returns Массив клеток
   */
  private initField(): ICell[][] {
    const field = new Array(this.height);
    for (let i = 0; i < this.height; i++) {
      const row = new Array(this.width);
      for (let j = 0; j < this.width; j++) {
        row[j] = { status: Players.NONE, point: { x: j, y: i } };
      }
      field[i] = row;
    }

    return field;
  }
}

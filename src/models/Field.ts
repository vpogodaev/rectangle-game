export {};

enum CellStatus {
  NONE = 0,
  PLAYER_1,
  PLAYER_2,
}

declare interface IPoint {
  x: number;
  y: number;
}

declare interface IRectangle {
  width: number;
  height: number;
  /** left upper corner */
  corner: IPoint;
}

declare interface IPlayer {
  rectangles: IRectangle[];
}

declare interface IFieldCell {
  status: CellStatus;
  rectangle: IRectangle;
}

export default class Field {
  /**
   *
   */
  constructor(width: number, height: number) {
    this.field = this._createField(width, height);
  }

  field: IFieldCell[][];

  placeRectangle = (
    rectangle: IRectangle,
    status: CellStatus.PLAYER_1 | CellStatus.PLAYER_2
  ): boolean => {
    if (!this._canPlaceRectangle(rectangle)) {
      return false;
    }

    const overI = rectangle.corner.y + rectangle.height;
    const overJ = rectangle.corner.x + rectangle.width;

    for (let i = rectangle.corner.y; i < overI; i++) {
      for (let j = rectangle.corner.x; j < overJ; j++) {
        this.field[i][j].status = status;
      }
    }

    return true;
  };

  // rollRectangle = (rectangle: IRectangle): boolean => {
  //   return false;
  // };

  // moveRectangle = (rectangle: IRectangle, newPoint: IPoint): boolean => {
  //   if (!this._canMoveRectangle(rectangle, newPoint)) {
  //     return false;
  //   }
  //   return true;
  // };

  // private _canMoveAndRollRectangle = () => {};

  // private _canMoveRectangle(rectangle: IRectangle, newPoint: IPoint): boolean {
  //   if (rectangle.corner === newPoint) {
  //     return false;
  //   }
  //   return true;
  // }

  // private _canRollRectangle = (
  //   oldRectangle: IRectangle,
  //   newRectangle: IRectangle
  // ): boolean => {
  //   const overI = newRectangle.corner.y + newRectangle.height;
  //   const overJ = newRectangle.corner.x + newRectangle.width;

  //   for (let i = newRectangle.corner.y; i < overI; i++) {
  //     if (i > this.field.length) {
  //       return false;
  //     }
  //     for (let j = newRectangle.corner.x; j < overJ; j++) {
  //       if (j > this.field[i].length) {
  //         return false;
  //       }
  //       if (
  //         this.field[i][j].status !== CellStatus.NONE
  //         // this.field[i][j].rectangle.corner.x !== oldRectangle.corner.x &&
  //         // this.field[i][j].rectangle.corner.y !== oldRectangle.corner.y
  //       ) {
  //         return false;
  //       }
  //     }
  //   }

  //   return true;
  // };

  private _canPlaceRectangle = (rectangle: IRectangle): boolean => {
    const overI = rectangle.corner.y + rectangle.height;
    const overJ = rectangle.corner.x + rectangle.width;

    for (let i = rectangle.corner.y; i < overI; i++) {
      if (i > this.field.length) {
        return false;
      }
      for (let j = rectangle.corner.x; j < overJ; j++) {
        if (j > this.field[i].length) {
          return false;
        }
        if (this.field[i][j].status !== CellStatus.NONE) {
          return false;
        }
      }
    }

    return true;
  };

  private _createField = (width: number, height: number): IFieldCell[][] => {
    const array = new Array(height);
    for (let i = 0; i < array.length; i++) {
      const subArray = new Array(width);
      for (let j = 0; j < subArray.length; j++) {
        subArray[j] = { status: CellStatus.NONE, rectangle: null };
      }
      array[i] = subArray;
    }

    return array;
  };
}
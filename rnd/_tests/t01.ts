export {};

const boardHeight = 5;
const boardWidth = 5;

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

const createField = (width: number, height: number): IFieldCell[][] => {
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

const field = createField(boardWidth, boardHeight);

const player1: IPlayer = {
  rectangles: [],
};
const player2: IPlayer = {
  rectangles: [],
};

const canPlaceRectangle = (rectangle: IRectangle): boolean => {
  for (
    let i = rectangle.corner.y;
    i < rectangle.corner.y + rectangle.height;
    i++
  ) {
    if (i > field.length) {
      return false;
    }
    for (
      let j = rectangle.corner.x;
      j < rectangle.corner.x + rectangle.width;
      j++
    ) {
      if (j > field[i].length) {
        return false;
      }
      if (field[i][j].status !== CellStatus.NONE) {
        return false;
      }
    }
  }

  return true;
};

const placeRectangle = (
  rectangle: IRectangle,
  status: CellStatus.PLAYER_1 | CellStatus.PLAYER_2
): boolean => {
  if (!canPlaceRectangle(rectangle)) {
    return false;
  }

  for (
    let i = rectangle.corner.y;
    i < rectangle.corner.y + rectangle.height;
    i++
  ) {
    for (
      let j = rectangle.corner.x;
      j < rectangle.corner.x + rectangle.width;
      j++
    ) {
      field[i][j].status = status;
    }
  }

  return true;
};

console.log(field.length);

const rectangle: IRectangle = { corner: { x: 2, y: 2 }, width: 2, height: 3 };

console.log(field);

console.log(placeRectangle(rectangle, CellStatus.PLAYER_1));

console.log(field);

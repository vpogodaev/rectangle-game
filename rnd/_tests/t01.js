"uАse strict";
exports.__esModule = true;
var boardHeight = 5;
var boardWidth = 5;
var CellStatus;
(function (CellStatus) {
    CellStatus[CellStatus["NONE"] = 0] = "NONE";
    CellStatus[CellStatus["PLAYER_1"] = 1] = "PLAYER_1";
    CellStatus[CellStatus["PLAYER_2"] = 2] = "PLAYER_2";
})(CellStatus || (CellStatus = {}));
var createField = function (width, height) {
    // return new Array(height).fill(
    //   Array.from({ length: width }, () => {
    //     return { status: CellStatus.NONE, rectangle: null };
    //   })
    // );
    // return [...new Array(height)].map(() => {
    //   return { status: CellStatus.none, rectangle: null };
    // });
    var array = new Array(height);
    for (var i = 0; i < array.length; i++) {
        var subArray = new Array(width);
        for (var j = 0; j < subArray.length; j++) {
            subArray[j] = { status: CellStatus.NONE, rectangle: null };
        }
        array[i] = subArray;
    }
    return array;
};
var field = createField(boardWidth, boardHeight);
var player1 = {
    rectangles: []
};
var player2 = {
    rectangles: []
};
var canPlaceRectangle = function (rectangle) {
    for (var i = rectangle.corner.y; i < rectangle.corner.y + rectangle.height; i++) {
        if (i > field.length) {
            return false;
        }
        for (var j = rectangle.corner.x; j < rectangle.corner.x + rectangle.width; j++) {
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
var placeRectangle = function (rectangle, status) {
    if (!canPlaceRectangle(rectangle)) {
        return false;
    }
    for (var i = rectangle.corner.y; i < rectangle.corner.y + rectangle.height; i++) {
        for (var j = rectangle.corner.x; j < rectangle.corner.x + rectangle.width; j++) {
            field[i][j].status = status;
        }
    }
    return true;
};
console.log(field.length);
var rectangle = { corner: { x: 2, y: 2 }, width: 2, height: 3 };
console.log(field);
console.log(placeRectangle(rectangle, CellStatus.PLAYER_1));
console.log(field);

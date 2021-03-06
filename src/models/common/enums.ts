export enum Players {
  NONE = "none",
  PLAYER_1 = 'player1',
  PLAYER_2 = 'player2',
}

export enum DiceNum {
  _1 = 1,
  _2 = 2,
  _3 = 3,
  _4 = 4,
  _5 = 5,
  _6 = 6,
}

export enum GameStatus {
  STOPPED = 0,
  PRIORITY_CHOOSE,
  DICE_ROLL,
  RECTANGLE_PLACE,
  FINISHED,
}

import { Players } from "./enums";

export declare interface IPoint {
  x: number;
  y: number;
}

export declare interface IBox {
  width: number;
  height: number;
}

export declare interface IScore {
  player1: number;
  player2: number;
}

export declare interface ICell {
  status: Players;
  point: IPoint;
}

export declare interface IPasses {
  player1: number;
  player2: number;
}
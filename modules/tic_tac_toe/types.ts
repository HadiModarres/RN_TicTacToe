export type TicTacToeSymbol = "x" | "o";

export type TicTacToeBoard = Map<string, TicTacToeSymbol>;

export type TicTacToeCell = {
  markedSymobol?: TicTacToeSymbol;
};

export type BoardPoint = {
  column: number;
  row: number;
};

export type Direction =
  | "north"
  | "south"
  | "west"
  | "east"
  | "north_east"
  | "south_east"
  | "north_west"
  | "south_west";

export type WinCondition = {
  symbol: TicTacToeSymbol;
  /**
   * the point where placing the symbol caused the win condition
   */
  initiatedPoint: BoardPoint;
  firstSegment: BoardPoint[];
  secondSegment: BoardPoint[];
};

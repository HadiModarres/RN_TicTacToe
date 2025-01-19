import {
  BoardPoint,
  Direction,
  TicTacToeBoard,
  TicTacToeSymbol,
  WinCondition,
} from "./types";

/**
 * This class impelements the logic for a TicTacToe game.
 * It allows a variable board size, and the complexity of placing markers is O(1) and independent of board size.
 * It detects multiple win conditions, e.g. north-south connected line and east-west connected line. This can be used
 * by the consuming entity to for example show UI for multiple win conditions.
 *
 */
export class TicTacToe {
  private winMatchCount = 3; // number of symbols in a sequence to win
  private readonly boardSize: number;
  private readonly board: TicTacToeBoard;
  private readonly winCondition: WinCondition[];

  /**
   * @param boardSize the size of the board, minimum is 3
   * @throws Error if the board size is invalid
   */
  constructor(boardSize: number) {
    if (boardSize < 3) {
      throw Error("board size must be at least 3");
    }
    this.boardSize = boardSize;
    this.board = new Map();
    this.winCondition = [];
  }

  /**
   * @returns boolean whether the marker was placed successfully.
   * @throws Error if the point is invalid
   *
   */
  place_marker(symbol: TicTacToeSymbol, row: number, column: number): boolean {
    const boardPoint: BoardPoint = {
      column,
      row,
    };

    if (!this.is_point_valid(boardPoint)) {
      throw Error("invalid input");
    }

    // check if this cell is already filled
    if (this.is_point_filled(boardPoint)) {
      return false;
    }

    // a player has won and game has ended, game behaviour from this point is undefined, so refuse to place marker
    if (this.winCondition.length > 0) {
      return false;
    }

    this.board.set(this.mapKey(boardPoint), symbol);
    this.check_win_conditions(boardPoint);

    return true;
  }

  is_board_filled(): boolean {
    return this.board.size === this.boardSize ** 2;
  }

  get_symbol(boardPoint: BoardPoint): TicTacToeSymbol | undefined {
    return this.board.get(this.mapKey(boardPoint));
  }

  get_win_conditions() {
    return this.winCondition;
  }

  // a new marker can cause multiple win conditions, this method will handle all of them
  private check_win_conditions(boardPoint: BoardPoint) {
    this.check_win_condition_segments(boardPoint, "north", "south");
    this.check_win_condition_segments(boardPoint, "west", "east");
    this.check_win_condition_segments(boardPoint, "north_west", "south_east");
    this.check_win_condition_segments(boardPoint, "south_west", "north_east");
  }

  // checks number of matching symbols in both sides of a point to see if a win condition is met
  private check_win_condition_segments(
    boardPoint: BoardPoint,
    firstDirection: Direction,
    secondDirection: Direction,
  ) {
    const symbol = this.board.get(this.mapKey(boardPoint));
    if (!symbol) {
      return false;
    }

    const firstSegmentPoints = this.matching_symbols_in_direction(
      this.get_next_point_direction(boardPoint, firstDirection),
      firstDirection,
      symbol,
    );
    const secondSegmentPoints = this.matching_symbols_in_direction(
      this.get_next_point_direction(boardPoint, secondDirection),
      secondDirection,
      symbol,
    );

    if (
      firstSegmentPoints.length + secondSegmentPoints.length + 1 >=
      this.winMatchCount
    ) {
      this.winCondition.push({
        firstSegment: firstSegmentPoints,
        secondSegment: secondSegmentPoints,
        initiatedPoint: boardPoint,
        symbol: symbol,
      });
    }
  }

  // find the list of all points in a direction that have the same symbol
  private matching_symbols_in_direction(
    boardPoint: BoardPoint,
    direction: Direction,
    symbol: TicTacToeSymbol,
  ): BoardPoint[] {
    if (
      !this.is_point_valid(boardPoint) || // reached the end of the board
      this.board.get(this.mapKey(boardPoint)) !== symbol // reached a different symbol or empty cell
    ) {
      return [];
    }

    return [
      boardPoint,
      ...this.matching_symbols_in_direction(
        this.get_next_point_direction(boardPoint, direction),
        direction,
        symbol,
      ),
    ];
  }

  // given a point and a direction, return the next point in that direction
  private get_next_point_direction(
    boardPoint: BoardPoint,
    direction: Direction,
  ): BoardPoint {
    const { column, row } = boardPoint;
    switch (direction) {
      case "north":
        return {
          column,
          row: row - 1,
        };
      case "south":
        return {
          column,
          row: row + 1,
        };
      case "east":
        return {
          column: column + 1,
          row: row,
        };
      case "west":
        return {
          column: column - 1,
          row: row,
        };
      case "north_east":
        return {
          column: column + 1,
          row: row - 1,
        };
      case "south_east":
        return {
          column: column + 1,
          row: row + 1,
        };
      case "north_west":
        return {
          column: column - 1,
          row: row - 1,
        };
      case "south_west":
        return {
          column: column - 1,
          row: row + 1,
        };
    }
  }

  private is_point_valid(boardPoint: BoardPoint) {
    const { row, column } = boardPoint;
    if (
      row < 0 ||
      column < 0 ||
      row >= this.boardSize ||
      column >= this.boardSize
    ) {
      return false;
    }

    return true;
  }

  private is_point_filled(boardPoint: BoardPoint) {
    return !!this.board.get(this.mapKey(boardPoint));
  }

  private mapKey(boardPoint: BoardPoint): string {
    return `${boardPoint.row},${boardPoint.column}`;
  }
}

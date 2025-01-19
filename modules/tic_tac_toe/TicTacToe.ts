import {
  BoardPoint,
  Direction,
  TicTacToeBoard,
  TicTacToeSymbol,
  WinCondition,
} from "./types";

export class TicTacToe {
  private readonly boardSize: number;
  private readonly board: TicTacToeBoard;
  private readonly winCondition: WinCondition[];
  private winMatchCount = 3;
  constructor(boardSize: number) {
    this.boardSize = boardSize;
    this.board = new Map();
    this.winCondition = [];
  }

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

    // a player has won and game has ended, game behaviour from this point is undefined
    if (this.winCondition.length > 0) {
      return false;
    }

    this.board.set(this.mapKey(boardPoint), symbol);
    this.check_win_condition(boardPoint);

    return true;
  }

  is_board_filled(): boolean {
    return this.board.size == this.boardSize ** 2;
  }

  get_symbol(boardPoint: BoardPoint): TicTacToeSymbol | undefined {
    return this.board.get(this.mapKey(boardPoint));
  }

  get_win_conditions() {
    return this.winCondition;
  }

  private check_win_condition(boardPoint: BoardPoint) {
    this.check_win_condition_segments(boardPoint, "north", "south");
    this.check_win_condition_segments(boardPoint, "west", "east");
    this.check_win_condition_segments(boardPoint, "north_west", "south_east");
    this.check_win_condition_segments(boardPoint, "south_west", "north_east");
  }

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
      this.getNextPointInDirection(boardPoint, firstDirection),
      firstDirection,
      symbol,
    );
    const secondSegmentPoints = this.matching_symbols_in_direction(
      this.getNextPointInDirection(boardPoint, secondDirection),
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

  private matching_symbols_in_direction(
    boardPoint: BoardPoint,
    direction: Direction,
    symbol: TicTacToeSymbol,
  ): BoardPoint[] {
    if (!this.is_point_valid(boardPoint)) {
      return [];
    }
    if (this.board.get(this.mapKey(boardPoint)) == symbol) {
      return [
        boardPoint,
        ...this.matching_symbols_in_direction(
          this.getNextPointInDirection(boardPoint, direction),
          direction,
          symbol,
        ),
      ];
    }

    return [];
  }

  private getNextPointInDirection(
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

import { TicTacToe } from "./TicTacToe";
import { WinCondition } from "./types";

describe("TicTacToe", () => {
  it("cannot make a board of size less than 3", () => {
    expect(() => new TicTacToe(2)).toThrow();
  });

  it("can mark with symbols", () => {
    const game = new TicTacToe(3);

    expect(game.place_marker("x", 0, 0)).toBe(true);
    expect(game.place_marker("o", 1, 2)).toBe(true);

    expect(game.get_symbol({ column: 0, row: 0 })).toBe("x");
    expect(game.get_symbol({ column: 2, row: 1 })).toBe("o");
    expect(game.get_symbol({ column: 2, row: 2 })).toBeUndefined();
    expect(game.get_symbol({ column: 1, row: 0 })).toBeUndefined();
  });

  it("prevents marking a point that is already marked", () => {
    const game = new TicTacToe(3);

    expect(game.place_marker("x", 0, 0)).toBe(true);
    expect(game.place_marker("o", 1, 1)).toBe(true);

    expect(game.place_marker("o", 0, 0)).toBe(false);
    expect(game.place_marker("x", 1, 1)).toBe(false);
    expect(game.place_marker("x", 1, 1)).toBe(false);

    expect(game.get_symbol({ column: 0, row: 0 })).toBe("x");
    expect(game.get_symbol({ column: 1, row: 1 })).toBe("o");
  });

  it("throws when marking an invalid point", () => {
    const game = new TicTacToe(3);

    expect(game.place_marker("x", 0, 0)).toBe(true);
    expect(() => game.place_marker("x", -1, 0)).toThrow();
    expect(() => game.place_marker("x", 3, 2)).toThrow();
  });

  it("detecs win condition and prevents marking after", () => {
    const game = new TicTacToe(3);
    game.place_marker("x", 0, 0);
    game.place_marker("o", 1, 1);
    game.place_marker("x", 2, 0);
    game.place_marker("o", 1, 0);
    game.place_marker("x", 0, 1);
    game.place_marker("o", 1, 2);

    const exptectedWinCondition: WinCondition = {
      symbol: "o",
      initiatedPoint: { column: 2, row: 1 },
      firstSegment: [
        { column: 1, row: 1 },
        { column: 0, row: 1 },
      ],
      secondSegment: [],
    };

    expect(game.get_win_conditions()).toStrictEqual([exptectedWinCondition]);
    expect(game.place_marker("x", 2, 1)).toBe(false);
  });

  it("detecs multiple win conditions", () => {
    // todo
  });

  it("detects when board is filled", () => {
    const game = new TicTacToe(3);

    expect(game.is_board_filled()).toBe(false);

    game.place_marker("x", 0, 0);
    game.place_marker("o", 2, 2);
    game.place_marker("x", 1, 1);
    game.place_marker("o", 2, 0);
    game.place_marker("x", 2, 1);
    game.place_marker("o", 0, 1);
    game.place_marker("x", 1, 0);
    game.place_marker("o", 1, 2);

    expect(game.is_board_filled()).toBe(false);

    game.place_marker("x", 0, 2);

    expect(game.is_board_filled()).toBe(true);
  });

  it("can handle large boards", () => {
    const game = new TicTacToe(1e6);

    expect(game.place_marker("x", 0, 0)).toBe(true);
    expect(game.place_marker("o", 0, 1)).toBe(true);
    expect(game.place_marker("x", 5e5, 5e5)).toBe(true);
    expect(game.place_marker("o", 5e5, 5e5)).toBe(false);

    expect(game.get_symbol({ column: 5e5, row: 5e5 })).toBe("x");
  });
});

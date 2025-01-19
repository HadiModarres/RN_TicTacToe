import { TicTacToe } from "@/modules/tic_tac_toe/TicTacToe";
import { TicTacToeSymbol, WinCondition } from "@/modules/tic_tac_toe/types";
import { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ColorValue,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Animated, { BounceInLeft, FadeIn } from "react-native-reanimated";
import { Audio, AVPlaybackSource } from "expo-av";
import { useLocalSearchParams } from "expo-router";

const swipe1Sound = require("../assets/sounds/swipe-1.mp3") as any;
const swipe2Sound = require("../assets/sounds/swipe-2.mp3") as any;
const winSound = require("../assets/sounds/win.mp3") as any;
const blockSound = require("../assets/sounds/block.mp3") as any;

export default function Game() {
  const params = useLocalSearchParams();
  const boardSize = parseInt(params.boardSize as string);
  const [gameLogic, setGameLogic] = useState(new TicTacToe(boardSize));
  const [gameEnded, setGameEnded] = useState(false);
  const [, setCounter] = useState(0);
  const [currentTurnSymbol, setCurrentTurnSymbol] =
    useState<TicTacToeSymbol>("x");

  const winCondition = gameLogic.get_win_conditions().at(0);

  const onPressCell = async (rowIndex: number, colIndex: number) => {
    const success = gameLogic.place_marker(
      currentTurnSymbol,
      rowIndex,
      colIndex,
    );
    if (!success) {
      await playSound(blockSound);
      return;
    }

    if (currentTurnSymbol === "x") {
      await playSound(swipe1Sound);
      setCurrentTurnSymbol("o");
    } else {
      await playSound(swipe2Sound);
      setCurrentTurnSymbol("x");
    }

    const winConditionReached = gameLogic.get_win_conditions().length > 0;

    if (winConditionReached) {
      await playSound(winSound);
    }

    if (winConditionReached || gameLogic.is_board_filled()) {
      setGameEnded(true);
    }
    setCounter((c) => c + 1);
  };

  const resetGame = () => {
    setGameLogic(new TicTacToe(boardSize));
    setCurrentTurnSymbol("x");
    setGameEnded(false);
  };

  const boardSizeRange = Array.from({ length: boardSize });

  return (
    <View style={styles.gameArea}>
      {boardSizeRange.map((_, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: "row" }}>
          {boardSizeRange.map((_, colIndex) => {
            return (
              <Cell
                key={`cell-${rowIndex}-${colIndex}`}
                highlight={getHighlightTypeForCell(
                  colIndex,
                  rowIndex,
                  winCondition,
                )}
                markedSymbol={gameLogic.get_symbol({
                  column: colIndex,
                  row: rowIndex,
                })}
                onPress={() => onPressCell(rowIndex, colIndex)}
              />
            );
          })}
        </View>
      ))}

      {gameEnded && <PlayAgainButton onPress={resetGame} />}
    </View>
  );
}

const playSound = async (soundPath: AVPlaybackSource) => {
  const { sound } = await Audio.Sound.createAsync(soundPath);
  try {
    await sound.playAsync();
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};

// determine if a cell should be highlighted and which type of highlight
const getHighlightTypeForCell = (
  colIndex: number,
  rowIndex: number,
  winCondition?: WinCondition,
): CellHighlight | undefined => {
  if (!winCondition) {
    return undefined;
  }

  let cellHighlight: CellHighlight | undefined;
  if (
    winCondition.initiatedPoint.column === colIndex &&
    winCondition.initiatedPoint.row === rowIndex
  ) {
    cellHighlight = "last_connecting";
  }
  if (
    [...winCondition.firstSegment, ...winCondition.secondSegment].find(
      (c) => c.column === colIndex && c.row === rowIndex,
    )
  ) {
    cellHighlight = "matched_line";
  }

  return cellHighlight;
};

// Cell
type CellHighlight = "matched_line" | "last_connecting";
type CellProps = {
  markedSymbol?: TicTacToeSymbol;
  onPress: () => void;
  highlight?: CellHighlight;
};
const cellHighlightBackgroundColor: Record<CellHighlight, ColorValue> = {
  last_connecting: "#FFD700",
  matched_line: "#98FB98",
};
const Cell = ({ markedSymbol, onPress, highlight }: CellProps) => {
  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={{
          ...styles.gameCell,
          backgroundColor: highlight
            ? cellHighlightBackgroundColor[highlight]
            : "white",
        }}
      >
        {!!markedSymbol && (
          <Animated.Text entering={FadeIn} style={{ fontSize: 32 }}>
            {markedSymbol === "x" ? "X" : "O"}
          </Animated.Text>
        )}
      </Animated.View>
    </Pressable>
  );
};
// End Cell

const PlayAgainButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Animated.View style={{ marginTop: 48 }} entering={BounceInLeft}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#FF4500",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameArea: {
    backgroundColor: "#87CEEB",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
    height: "100%",
  },
  gameCell: {
    backgroundColor: "#FFF8DC",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FF4500",
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    aspectRatio: 1,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

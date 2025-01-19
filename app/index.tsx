import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function NewGameScreen() {
  const handleSelectSize = (size: number) => {
    router.push({ pathname: "/game", params: { boardSize: size } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Board Size</Text>
      <View style={styles.optionsContainer}>
        {[3, 4, 5].map((size) => (
          <TouchableOpacity
            key={size}
            style={styles.button}
            onPress={() => handleSelectSize(size)}
          >
            <Text style={styles.buttonText}>
              {size} x {size}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    margin: 10,
    borderWidth: 2,
    borderColor: "#FF4500",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeHeader}>Welcome!</Text>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[styles.fullButton, { backgroundColor: "#007AFF" }]}
          onPress={() => router.push("/daily-survey" as any)}
        >
          <Ionicons name="sunny-outline" size={48} color="white" />
          <Text style={styles.buttonText}>Daily Survey</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.fullButton,
            { backgroundColor: "#5856D6", marginBottom: 20 },
          ]}
          onPress={() => router.push("/weekly-survey" as any)}
        >
          <Ionicons name="calendar-outline" size={48} color="white" />
          <Text style={styles.buttonText}>Weekly Survey</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  welcomeHeader: {
    fontSize: 40,
    fontWeight: "900",
    textAlign: "center",

    color: "#1C1C1E",
  },
  buttonWrapper: {
    flex: 1,
    padding: 15,
    gap: 15,
  },
  fullButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 10,
  },
});

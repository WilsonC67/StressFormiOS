import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sharing from "expo-sharing";
import { File, Paths } from "expo-file-system";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Welcome() {
  const router = useRouter();
  const STORAGE_KEY = "testDataCollection";

  const handleExportData = async (): Promise<void> => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (!jsonValue) return Alert.alert("No data to export.");

      const filename = `testData_${Date.now()}.json`;
      const file = new File(Paths.document, filename);
      await file.create({ intermediates: true });
      await file.write(jsonValue);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri);
      } else {
        Alert.alert("Sharing not available on this device.");
      }
    } catch (err) {
      console.error("Export Error:", err);
      Alert.alert("Error", "Failed to export data.");
    }
  };

  const handleClearData = async () => {
    Alert.alert("Confirm Clear", "Delete all saved data?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem(STORAGE_KEY);
          Alert.alert("Success", "Data cleared.");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>

      <View style={styles.gridContainer}>
        <View style={styles.row}>
          <ActionButton
            title="Start Survey"
            onPress={() => router.push("/survey")}
            color="#007AFF"
            icon="clipboard-outline"
          />
          <ActionButton
            title="Export Data"
            onPress={handleExportData}
            color="#34C759"
            icon="share-outline"
          />
        </View>
        <View style={styles.row}>
          <ActionButton
            title="Clear Cache"
            onPress={handleClearData}
            color="#FF3B30"
            icon="trash-outline"
          />
          <ActionButton
            title="History"
            onPress={() => Alert.alert("Coming Soon")}
            color="#5856D6"
            icon="time-outline"
          />
        </View>
      </View>
    </View>
  );
}

const ActionButton = ({
  title,
  onPress,
  color,
  icon,
}: {
  title: string;
  onPress: () => void;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: color }]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Ionicons name={icon} size={40} color="white" style={styles.icon} />
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 20,
    paddingBottom: 40, // Space at the bottom for home indicator
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1C1C1E",
    marginBottom: 10,
    textAlign: "center",
  },
  gridContainer: {
    flex: 1, // Takes up all remaining vertical space
    gap: 15,
  },
  row: {
    flex: 1, // Each row takes 50% of the grid height
    flexDirection: "row",
    gap: 15,
  },
  button: {
    flex: 1, // Each button takes 50% of the row width
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    marginBottom: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});

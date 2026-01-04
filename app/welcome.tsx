import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sharing from "expo-sharing";
import { File, Paths } from "expo-file-system";
import { requireNativeModule } from "expo-modules-core";
import { useRouter } from "expo-router";

const ScreenTimeReport = requireNativeModule("ScreenTimeReport");

interface AppData {
  usageLast7DaysByCategoryHours?: Record<string, number>;
  stressData?: any;
  [key: string]: any;
}

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

      <View style={styles.buttonContainer}>
        <ActionButton title="Start Survey" onPress={() => router.push("/survey")} color="#007AFF" />
        <ActionButton title="Export Results" onPress={handleExportData} color="#34C759" />
        <ActionButton title="Clear Cache" onPress={handleClearData} color="#FF3B30" />
      </View>
    </View>
  );
}

const ActionButton = ({
  title,
  onPress,
  color,
}: {
  title: string;
  onPress: () => void;
  color: string;
}) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: color }]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1C1C1E",
    marginBottom: 40,
    letterSpacing: -0.5,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
});

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { requireNativeModule } from "expo-modules-core";

const ScreenTimeReport = requireNativeModule("ScreenTimeReport");

export default function ScreenTimeIntro() {
  const router = useRouter();

  const handleOpenReport = async () => {
    try {
      await ScreenTimeReport.requestAuthorization();
      await ScreenTimeReport.presentWeeklyCategoryUsageReport();
    } catch (e: any) {
      Alert.alert("Error", "Could not load Screen Time report: " + e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Screen Time Check</Text>
      
      <View style={styles.instructionBlock}>
        <Text style={styles.text}>
          We need to check your usage for the week.
        </Text>
        <Text style={styles.text}>
          Tap the button below to view your report. Memorize or write down the values, then come back here to enter them.
        </Text>
      </View>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleOpenReport}>
        <Text style={styles.secondaryButtonText}>View Screen Time Report</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.primaryButton} 
        onPress={() => router.push("/screen-time-input" as any)}
      >
        <Text style={styles.primaryButtonText}>I'm Ready to Enter Data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#1C1C1E",
  },
  instructionBlock: {
    marginBottom: 40,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 26,
    color: "#3A3A3C",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 18,
    width: "100%",
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#E5E5EA",
    paddingVertical: 18,
    width: "100%",
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
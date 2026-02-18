import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { requireNativeModule } from "expo-modules-core";
import { uploadData } from "@/services/sync"; // Imported for Android flow

// Connect to the Native Module
const ScreenTimeReport = requireNativeModule("ScreenTimeReport");

export default function DailySurvey() {
  const router = useRouter();
  const [answers, setAnswers] = useState({ 1: 5, 2: 5, 3: 5 });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const data = {
      type: "daily",
      mood: answers[1],
      anxiety: answers[2],
      sleep: answers[3],
      timestamp: new Date().toISOString(),
      manualScreenTime: {}, // Will be populated below for Android
    };

    try {
      // ---------------------------------------------------------
      // ANDROID SPECIFIC FLOW
      // ---------------------------------------------------------
      if (Platform.OS === "android") {
        // 1. Check/Request Permissions
        const hasPermission = await ScreenTimeReport.hasAndroidPermission();
        if (!hasPermission) {
          Alert.alert(
            "Permission Required",
            "To complete the survey, we need access to usage stats to calculate screen time automatically. Please grant access in the settings.",
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => setLoading(false),
              },
              {
                text: "Open Settings",
                onPress: async () => {
                  await ScreenTimeReport.requestAndroidPermission();
                  setLoading(false);
                },
              },
            ],
          );
          return;
        }

        // 2. Get Data (Last 24h, Rounded to nearest hour, Categorized)
        const androidUsage = await ScreenTimeReport.getAndroidDailyUsage();

        // Populate the key expected by the server
        data.manualScreenTime = androidUsage;

        // 3. Save Locally
        const existingRaw = await AsyncStorage.getItem("testDataCollection");
        let collection = [];
        if (existingRaw) {
          collection = JSON.parse(existingRaw);
        }
        collection.push(data);

        await AsyncStorage.setItem(
          "testDataCollection",
          JSON.stringify(collection),
        );
        await AsyncStorage.setItem("latestTestData", JSON.stringify(data));

        // 4. Upload Immediately
        const success = await uploadData(data);
        if (!success) {
          Alert.alert(
            "Offline",
            "Survey saved locally. It will sync when connection is restored.",
          );
        }

        // 5. Complete
        setLoading(false);
        router.push("/submitted");
      }

      // ---------------------------------------------------------
      // iOS / DEFAULT FLOW
      // ---------------------------------------------------------
      else {
        // iOS Logic: Save partial data and move to manual entry screens
        const existingRaw = await AsyncStorage.getItem("testDataCollection");
        let collection = [];

        if (existingRaw) {
          collection = JSON.parse(existingRaw);
        }

        collection.push(data);
        await AsyncStorage.setItem(
          "testDataCollection",
          JSON.stringify(collection),
        );
        await AsyncStorage.setItem("latestTestData", JSON.stringify(data));

        setLoading(false);
        router.push("/screen-time-intro");
      }
    } catch (err) {
      console.error("Failed to save daily survey:", err);
      Alert.alert("Error", "An error occurred saving your survey.");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <Text style={styles.header}>Daily Check-in</Text>

        {[
          { id: 1, label: "How is your mood today?", max: 10 },
          { id: 2, label: "How anxious are you today?", max: 10 },
          { id: 3, label: "How well did you sleep last night?", max: 10 },
        ].map((q) => (
          <View key={q.id} style={styles.block}>
            <Text style={styles.label}>{q.label}</Text>
            <Slider
              style={{ width: 300, height: 40 }}
              minimumValue={0}
              maximumValue={q.max}
              step={1}
              value={answers[q.id as keyof typeof answers]}
              onValueChange={(v) => setAnswers({ ...answers, [q.id]: v })}
            />
            <Text>{answers[q.id as keyof typeof answers]}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              {Platform.OS === "android"
                ? "Submit Survey"
                : "Next: Screen Time"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: { fontSize: 28, fontWeight: "bold", marginVertical: 20 },
  block: { marginBottom: 30, alignItems: "center" },
  label: { fontSize: 18, marginBottom: 10 },
  button: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 15,
    width: 250,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});

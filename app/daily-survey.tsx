import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function DailySurvey() {
  const router = useRouter();
  const [answers, setAnswers] = useState({ 1: 5, 2: 5, 3: 5 });

  // daily-survey.tsx

  const handleSubmit = async () => {
    const data = {
      type: "daily",
      mood: answers[1],
      anxiety: answers[2],
      sleep: answers[3],
      timestamp: new Date().toISOString(),
      manualScreenTime: {}, // Initialize this so it's ready to be updated
    };

    try {
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

      router.push("/screen-time-intro");
    } catch (err) {
      console.error("Failed to save daily survey:", err);
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

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Next: Screen Time</Text>
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
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});

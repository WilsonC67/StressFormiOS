import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uploadData } from "@/services/sync";
import { useRouter } from "expo-router";

const PSS_QUESTIONS = [
  "How often have you been upset because of something that happened unexpectedly?",
  "How often have you felt that you were unable to control the important things in your life?",
  "How often have you felt nervous and stressed?",
  "How often have you felt confident about your ability to handle your personal problems?",
  "How often have you felt that things were going your way?",
  "How often have you found that you could not cope with all the things that you had to do?",
  "How often have you been able to control irritations in your life?",
  "How often have you felt that you were on top of things?",
  "How often have you been angered because of things that happened that were outside of your control?",
  "How often have you felt difficulties were piling up so high that you could not overcome them?",
];

export default function WeeklySurvey() {
  const router = useRouter();
  const [answers, setAnswers] = useState(Array(10).fill(0));

  const handleSubmit = async () => {
    // Logic: Reverse scores for index 3, 4, 6, and 7 (Questions 4, 5, 7, 8)
    // 0=4, 1=3, 2=2, 3=1, 4=0
    const calculatedScores = answers.map((val, index) => {
      const questionNumber = index + 1;
      if ([4, 5, 7, 8].includes(questionNumber)) {
        return 4 - val;
      }
      return val;
    });

    const totalScore = calculatedScores.reduce((a, b) => a + b, 0);

    const data = {
      type: "weekly",
      pssTotalScore: totalScore,
      rawResponses: answers,
      reversedScores: calculatedScores,
      timestamp: new Date().toISOString(),
    };

    await AsyncStorage.setItem("latestTestData", JSON.stringify(data));

    // 2. Upload to Linode
    const success = await uploadData(data);
    if (!success) {
      Alert.alert(
        "Offline",
        "Survey saved locally. It will sync when connection is restored.",
      );
    }
    router.push("/submitted");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.header}>In the past week...</Text>
        {PSS_QUESTIONS.map((q, i) => (
          <View key={i} style={styles.block}>
            <Text style={styles.questionText}>{q}</Text>
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={0}
              maximumValue={4}
              step={1}
              value={answers[i]}
              onValueChange={(v) => {
                const newAns = [...answers];
                newAns[i] = v;
                setAnswers(newAns);
              }}
            />
            <Text style={styles.valueDisplay}>{answers[i]}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Weekly Survey</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#1C1C1E",
  },
  block: {
    marginBottom: 30,
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 15,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
    color: "#3A3A3C",
  },
  valueDisplay: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  button: {
    backgroundColor: "#34C759",
    padding: 20,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 40,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});

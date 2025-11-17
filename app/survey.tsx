import Slider from '@react-native-community/slider';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";

export class Question {
  constructor(
    public id: number,
    public prompt: string,
    public min: number,
    public max: number,
    public defaultValue: number,
    public step: number = 1
  ) {}
}

export default function Survey({ navigation }: { navigation: any }) {

  const STORAGE_KEY = "testDataCollection";

  const questions = [
    new Question(1, "How would you rate your mood today?", 0, 10, 5),
    new Question(2, "How would you rate your anxiety level today?", 0, 10, 5),
    new Question(3, "How would you rate your overall quality of sleep today?", 0, 10, 5),

    // PSS Questions

    new Question(4, "In the last month, how often have you been upset because of something that happened unexpectedly?", 0, 4, 0),
    new Question(5, "In the last month, how often have you felt that you were unable to control the important things in your life?", 0, 4, 0),
    new Question(6, "In the last month, how often have you felt nervous and stressed?", 0, 4, 0),
    new Question(7, "In the last month, how often have you felt confident about your ability to handle your personal problems?", 0, 4, 0),
    new Question(8, "In the last month, how often have you felt that things were going your way??", 0, 4, 0),
    new Question(9, "In the last month, how often have you found that you could not cope with all the things that you had to do?", 0, 4, 0),
    new Question(10, "In the last month, how often have you been able to control irritations in your life?", 0, 4, 0),
    new Question(11, "In the last month, how often have you felt that you were on top of things?", 0, 4, 0),
    new Question(12, "In the last month, how often have you been angered because of things that happened that were outside of your control?", 0, 4, 0),
    new Question(13, "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?", 0, 4, 0),

  ];

 
  const [answers, setAnswers] = React.useState(
    Object.fromEntries(questions.map((q) => [q.id, q.defaultValue]))
  );

  const calculatePSSScore = () => {
    const pssIds = [4,5,6,7,8,9,10,11,12,13];
    return pssIds.reduce((sum, id) => sum + answers[id], 0);
  };

  const interpretPSSScore = (score: number): string => {
    if (score <= 13) return "Low Stress";
    if (score <= 26) return "Moderate Stress";
      return "High Stress";
  };

  const formatTimestamp = (isoString: string): string => {
    const date = new Date(isoString);

    const month = date.getMonth() + 1;      // 0–11 → 1–12
    const day = date.getDate();
    const year = date.getFullYear();

    // Format time as HH:MM AM/PM
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;

    return `${month}-${day}-${year} ${hour12}:${minutes} ${ampm}`;
  };

  const handleSaveData = async (): Promise<void> => {
    try {
      const newEntry = {
        Mood: answers[1],
        Anxiety: answers[2],
        SleepQuality: answers[3],
        PSSScore: calculatePSSScore(),
        PSSInterpretation: interpretPSSScore(calculatePSSScore()),
        timestamp: formatTimestamp(new Date().toISOString())
      };

      const existing = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = existing ? JSON.parse(existing) : [];
      const updated = [...parsed, newEntry];

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      Alert.alert("Saved!", "Your data has been added to the collection.");
    } catch (err) {
      console.error("Error saving data:", err);
      Alert.alert("Error", "Failed to save data.");
    }
  };

  const handleData = async (): Promise<void> => {
    try {
      const data = {
        Mood: answers[1],
        Anxiety: answers[2],
        Sleep: answers[3],
        PSSScore: calculatePSSScore(),
        PSSInterpretation: interpretPSSScore(calculatePSSScore()),
        timestamp: formatTimestamp(new Date().toISOString())
      };

      const jsonString = JSON.stringify(data);
      await AsyncStorage.setItem("latestTestData", jsonString);

      console.log("JSON string:", jsonString);
      console.log("Parsed object:", JSON.parse(jsonString));
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  const handleSubmit = () => {
    handleSaveData();
    handleData();
    navigation.navigate("Submitted");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.bigText}>Daily Survey</Text>

      <ScrollView>

        {/* Render sliders from Question class */}
        {questions.map((q) => (
          <View key={q.id} style={styles.sliderBlock}>
            <Text style={styles.normalText}>{q.prompt}</Text>

            <Slider
              style={styles.slider}
              step={q.step}
              minimumValue={q.min}
              maximumValue={q.max}
              value={answers[q.id]}
              onValueChange={(val) =>
                setAnswers({ ...answers, [q.id]: val })
              }
              minimumTrackTintColor="#00aefeff"
              maximumTrackTintColor="#00aefeff"
              thumbTintColor="black"
            />

            <Text style={styles.label}>{answers[q.id]}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Survey</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center",  
    backgroundColor:"white"
  },
  normalText: {
    width: 385,
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 22,
  },
  bigText: {
    fontSize: 30,
    marginBottom: 20,
  },
  slider: {
    width: 250, 
    height: 40,
  },
  label: {
    marginBottom: 2,
    fontSize: 16,
  },
  button: {
    backgroundColor: "blue", 
    paddingVertical: 20,
    borderRadius: 4,
    elevation: 3,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  sliderBlock: {
    alignItems: "center", 
    marginVertical: 5,
  },
});

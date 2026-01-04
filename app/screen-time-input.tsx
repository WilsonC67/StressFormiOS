import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const CATEGORIES = [
  { label: "Creativity", key: "creativity" },
  { label: "Education", key: "education" },
  { label: "Entertainment", key: "entertainment" },
  { label: "Games", key: "games" },
  { label: "Information & Reading", key: "informationReading" },
  { label: "Other", key: "other" },
  { label: "Productivity & Finance", key: "productivityFinance" },
  { label: "Shopping & Food", key: "shoppingFood" },
  { label: "Social", key: "social" },
  { label: "System", key: "system" },
  { label: "Travel", key: "travel" },
  { label: "Utilities", key: "utilities" },
];

export default function ScreenTimeInput() {
  const router = useRouter();
  const STORAGE_KEY = "testDataCollection";
  
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const handleInputChange = (key: string, value: string) => {
    if (/^\d*$/.test(value)) {
      setInputs(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const processedData = CATEGORIES.reduce((acc, cat) => {
        acc[cat.key] = parseInt(inputs[cat.key] || "0", 10);
        return acc;
      }, {} as Record<string, number>);

      const existingRaw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!existingRaw) {
        Alert.alert("Error", "No survey data found to attach this to.");
        return;
      }

      const existingData = JSON.parse(existingRaw);

      if (Array.isArray(existingData) && existingData.length > 0) {
        const lastIndex = existingData.length - 1;
        existingData[lastIndex] = {
          ...existingData[lastIndex],
          manualScreenTime: processedData
        };
        
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
        
        const latestCache = await AsyncStorage.getItem("latestTestData");
        if (latestCache) {
            const parsedCache = JSON.parse(latestCache);
            const updatedCache = { ...parsedCache, manualScreenTime: processedData };
            await AsyncStorage.setItem("latestTestData", JSON.stringify(updatedCache));
        }

        router.push("/submitted");
      } else {
        Alert.alert("Error", "Data format issue.");
      }

    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save screen time data.");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.header}>Enter Category Minutes</Text>
        <Text style={styles.subHeader}>Please enter the integer value (minutes) for each category.</Text>

        {CATEGORIES.map((cat) => (
          <View key={cat.key} style={styles.inputRow}>
            <Text style={styles.label}>{cat.label}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="0"
              value={inputs[cat.key] || ""}
              onChangeText={(text) => handleInputChange(cat.key, text)}
              returnKeyType="done"
            />
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Finish</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1C1C1E",
    textAlign: "center",
  },
  subHeader: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
    flex: 1,
  },
  input: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
    textAlign: "right",
    minWidth: 60,
    padding: 4,
  },
  button: {
    backgroundColor: "#34C759",
    paddingVertical: 18,
    borderRadius: 14,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
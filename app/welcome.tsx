import { View , Text, TouchableOpacity,StyleSheet} from "react-native";

import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

export default function Welcome() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeText}>Stress Form</Text>
      <TouchableOpacity style={styles.button} onPress={() => alert("Survey started")}>
        <Text style={styles.buttonText}>Start Survey</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
    backgroundColor: "white",
  }, 
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 60,
  },
  button: {
    backgroundColor: "blue", 
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
})
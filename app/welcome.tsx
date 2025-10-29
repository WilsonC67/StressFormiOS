import AsyncStorage from "@react-native-async-storage/async-storage";
import { View , Text, TouchableOpacity, StyleSheet, Alert} from "react-native";
import * as Sharing from "expo-sharing";
import { File, Paths } from "expo-file-system";



export default function Welcome({navigation}: {navigation: any}) {
    const STORAGE_KEY = "testDataCollection";

    const handleExportData = async (): Promise<void> => {
      try {
        const jsonValue = await AsyncStorage.getItem("testDataCollection");
        if (!jsonValue) {
          Alert.alert("No data to export.");
          return;
        }

        const file = new File(Paths.document, `testData_${Date.now()}.json`);
        await file.write(jsonValue);

        await Sharing.shareAsync(file.uri);
        console.log("Exported to file:", file.uri);
      } catch (err) {
        console.error("Error exporting data:", err);
      }
    };

    const handleClearData = async (): Promise<void> => {
      try {
        await AsyncStorage.removeItem("testDataCollection");
        Alert.alert("Cleared", "All saved test data has been removed.");
      } catch (err) {
        console.error("Error clearing data:", err);
        Alert.alert("❌ Error", "Failed to clear data.");
      }
    };
    
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Stress Form</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Survey")}>
        <Text style={styles.buttonText}>Go to Survey</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleExportData}>
        <Text style={styles.buttonText}>Export Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleClearData}>
        <Text style={styles.buttonText}>Clear Data</Text>
      </TouchableOpacity>
    </View>
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
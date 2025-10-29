import Slider from '@react-native-community/slider';
import React from 'react';

import { View , Text, TouchableOpacity,StyleSheet, ScrollView, Alert} from "react-native";

import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

import AsyncStorage from "@react-native-async-storage/async-storage";

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

  interface TestData {
    Mood: number;
    Anxiety: number;
    SleepQuality: number;
    timestamp: string;
  }

export default function Survey({navigation}: {navigation: any}) {

    const STORAGE_KEY = "testDataCollection";

    const handleSubmit = () => {

      handleSaveData()
      handleData()

      navigation.navigate("Submitted");
    }

    const handleSaveData = async (): Promise<void> => {
      try {
        const newEntry: TestData = {
          Mood: moodValue,
          Anxiety: anxietyValue,
          SleepQuality: sleepQualityValue,
          timestamp: new Date().toISOString(),
        };

        const existing = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed: TestData[] = existing ? JSON.parse(existing) : [];
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
          Mood: moodValue,
          Anxiety: anxietyValue,
          Sleep: sleepQualityValue,
          timestamp: new Date().toISOString(),
        };

        const jsonString = JSON.stringify(data);
        console.log("JSON string:", jsonString);

        await AsyncStorage.setItem("latestTestData", jsonString);

        const parsedData = JSON.parse(jsonString);

        console.log("Parsed object:", parsedData);


      } catch(err) {
          console.error("Error saving data:", err);
      }
    }

    const[moodValue, setMoodValue] = React.useState<number>(5);

    const[anxietyValue, setAnxietyValue] = React.useState<number>(5);

    const[sleepQualityValue, setSleepQualityValue] = React.useState<number>(5);

    return (

      <SafeAreaView style = {styles.container}>

        <Text style = {styles.bigText}>Daily Survey</Text>

        <ScrollView>

          <View style = {styles.sliderBlock}>
            <Text style = {styles.normalText}>
              How would you rate your mood today?
            </Text>
              
              <Slider style = {styles.slider}
                step={1}
                minimumValue={0}
                maximumValue={10}
                value = {moodValue}
                onValueChange={(value) => setMoodValue(value)}
                minimumTrackTintColor="#00aefeff"
                maximumTrackTintColor="#00aefeff"
                thumbTintColor='black'
              />

            <Text style = {styles.label}>{moodValue}</Text>

          </View>


          <View style = {styles.sliderBlock}>
            <Text style = {styles.normalText}>
              How would you rate your anxiety level today?
            </Text>
              
            <Slider style = {styles.slider}
              step={1}
              minimumValue={0}
              maximumValue={10}
              value = {anxietyValue}
              onValueChange={(value) => setAnxietyValue(value)}
              minimumTrackTintColor="#00aefeff"
              maximumTrackTintColor="#00aefeff"
              thumbTintColor='black'
            />

            <Text style = {styles.label}>{anxietyValue}</Text>

          </View>


          <View style = {styles.sliderBlock}>
            <Text style = {styles.normalText}>
              How would you rate your overall quality of sleep today?
            </Text>
              
            <Slider style = {styles.slider}
              step={1}
              minimumValue={0}
              maximumValue={10}
              value = {sleepQualityValue}
              onValueChange={(value) => setSleepQualityValue(value)}
              minimumTrackTintColor="#00aefeff"
              maximumTrackTintColor="#00aefeff"
              thumbTintColor='black'
            />

            <Text style = {styles.label}>{sleepQualityValue}</Text>

          </View>
              
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
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    textAlign:"center",
    lineHeight: 22,
  },

  bigText: {
    alignItems: "center",
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
    paddingHorizontal: 0,
    borderRadius: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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

})
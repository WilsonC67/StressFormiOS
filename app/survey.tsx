import Slider from '@react-native-community/slider';
import React from 'react';

import { View , Text, TouchableOpacity,StyleSheet, ScrollView} from "react-native";

import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

export default function Survey() {

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
              
          <TouchableOpacity style={styles.button} onPress={() => alert("Your results have been submitted.")}>
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
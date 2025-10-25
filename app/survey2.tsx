import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

export default function CenteredSliders() {
  const[moodValue, setMoodValue] = React.useState<number>(5);
  
      const[anxietyValue, setAnxietyValue] = React.useState<number>(5);
  
      const[sleepQualityValue, setSleepQualityValue] = React.useState<number>(5);

  return (

    

    <View style={styles.container}>
      <View style={styles.sliderBlock}>
        <Text style={styles.label}>How would you rate your mood today?{moodValue.toFixed(0)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          value={moodValue}
          onValueChange={setMoodValue}
          minimumTrackTintColor="#1fb28a"
          maximumTrackTintColor="#d3d3d3"
        />
      </View>

      <View style={styles.sliderBlock}>
        <Text style={styles.label}>Brightness: {anxietyValue.toFixed(0)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          value={anxietyValue}
          onValueChange={setAnxietyValue}
          minimumTrackTintColor="#fbc02d"
          maximumTrackTintColor="#d3d3d3"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Centers everything on the screen
  container: {
    flex: 1,
    justifyContent: "center", // centers vertically
    alignItems: "center",     // centers horizontally
  },

  // Wraps each slider and label together
  sliderBlock: {
    alignItems: "center", // centers each slider and text horizontally
    marginVertical: 20,   // adds space between sliders
  },

  // Centers the text label
  label: {
    marginBottom: 5,
    fontSize: 16,
  },

  // Sets consistent slider width
  slider: {
    width: 250,
    height: 40,
  },
});

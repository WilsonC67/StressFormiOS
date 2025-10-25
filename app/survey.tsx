import Slider from '@react-native-community/slider';
import React from 'react';

import { View , Text, TouchableOpacity,StyleSheet} from "react-native";

import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

export default function Survey() {

    const[moodValue, setMoodValue] = React.useState<number>(5);

    const[anxietyValue, setAnxietyValue] = React.useState<number>(5);

    const[sleepQualityValue, setSleepQualityValue] = React.useState<number>(5);

    return (

        <SafeAreaView style = {styles.container}>
        
        <View style = {styles.sliderBlock}>
            <Text style = {styles.normalText}>
                How would you rate your mood today?</Text>
            
            <Slider style = {styles.slider}
            minimumValue={0}
            maximumValue={10}
            value = {moodValue}
            onValueChange={(value) => setMoodValue(value)}
            step={1}
            minimumTrackTintColor="#00aefeff"
            maximumTrackTintColor="#00aefeff"
            thumbTintColor='black'
            />

        <Text style = {styles.label}>{moodValue}</Text>

        </View>



        <View style = {styles.sliderBlock}>
            <Text style = {styles.normalText}>
                How would you rate your anxiety level today?</Text>
            
            <Slider style = {styles.slider}
            minimumValue={0}
            maximumValue={10}
            value = {anxietyValue}
            onValueChange={(value) => setAnxietyValue(value)}
            step={1}
            minimumTrackTintColor="#00aefeff"
            maximumTrackTintColor="#00aefeff"
            thumbTintColor='black'
            />

        <Text style = {styles.label}>{anxietyValue}</Text>

        </View>



        <View style = {styles.sliderBlock}>
            <Text style = {styles.normalText}>
                How would you rate your overall quality of sleep today?</Text>
            
            <Slider style = {styles.slider}
            minimumValue={0}
            maximumValue={10}
            value = {sleepQualityValue}
            onValueChange={(value) => setSleepQualityValue(value)}
            step={1}
            minimumTrackTintColor="#00aefeff"
            maximumTrackTintColor="#00aefeff"
            thumbTintColor='black'
            />

        <Text style = {styles.label}>{sleepQualityValue}</Text>

        </View>
        
        </SafeAreaView>

        
        /* How would you rate your mood today? {"\n"}  */
            
        

        // {"\n"}

        // {moodValue}

        // {"\n"}
        // {"\n"}


    //     How would you rate your level of anxiety today?


    //     {"\n"}

    //     <Slider style = {styles.slider}
    //         minimumValue={0}
    //         maximumValue={10}
    //         value = {anxietyValue}
    //         onValueChange={(value) => setAnxietyValue(value)}
    //         step={1}
    //         minimumTrackTintColor="#00aefeff"
    //         maximumTrackTintColor="#00aefeff"
    //         thumbTintColor='white'
    //     />
        
    //     {"\n"}

    //     {anxietyValue}

    //     {"\n"}
    //     {"\n"}

    //     How would you rate your overall quality of sleep?

    //     {"\n"}

    //     <Slider style = {styles.slider}
    //         minimumValue={0}
    //         maximumValue={10}
    //         value = {sleepQualityValue}
    //         onValueChange={(value) => setSleepQualityValue(value)}
    //         step={1}
    //         minimumTrackTintColor="#00aefeff"
    //         maximumTrackTintColor="#00aefeff"
    //         thumbTintColor='white'
    //     />
        
    //     {"\n"}

    //     {sleepQualityValue}

    //     </Text>

    //     </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center",     
  },
  normalText: {
    fontSize: 32,
    marginBottom: 60,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  slider: {
    width: 250, 
    height: 40,
  },

  label: {
    marginBottom: 5,
    fontSize: 16,
  },

  sliderBlock: {
    alignItems: "center", 
    marginVertical: 20,
  },
})
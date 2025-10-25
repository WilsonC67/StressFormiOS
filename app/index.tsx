import React from "react";
import Welcome from './welcome';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Survey from "./survey";

const Stack = createStackNavigator();

export default function Index() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={Welcome} options={{title: "Welcome"}}/>
        <Stack.Screen name="Survey" component={Survey} options={{title: "Survey"}}/>
      </Stack.Navigator>
  )
}

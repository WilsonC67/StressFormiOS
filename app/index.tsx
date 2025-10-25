import React from "react";
import Welcome from './welcome';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Survey from "./survey";
import Submitted from "./submitted";

const Stack = createStackNavigator();

export default function Index() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={Welcome} options={{title: "Welcome", headerLeft: () => null,}}/>
        <Stack.Screen name="Survey" component={Survey} options={{title: "Survey"}}/>
        <Stack.Screen name="Submitted" component={Submitted} options={{title: "Submitted", headerLeft: () => null}}/>
      </Stack.Navigator>
  )
}

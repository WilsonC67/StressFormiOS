import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#F2F2F7" },
        headerTintColor: "#007AFF",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="welcome"
        options={{
          title: "Welcome",
          headerLeft: () => null,
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="survey" options={{ title: "Survey" }} />
      <Stack.Screen
        name="screen-time-intro"
        options={{ title: "Usage Report" }}
      />
      <Stack.Screen
        name="screen-time-input"
        options={{ title: "Enter Data" }}
      />
      <Stack.Screen name="submitted" options={{ title: "Thank You!" }} />
    </Stack>
  );
}

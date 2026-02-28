import { useEffect } from "react";
import { Stack } from "expo-router";
import { configureNotifications, scheduleSurveyReminders } from "@/services/notifications";

export default function RootLayout() {
  useEffect(() => {
    async function init() {
      const allowed = await configureNotifications();
      if (allowed) {
        await scheduleSurveyReminders();
      }
    }
    init();
  }, []);
  
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
          title: "SmartFocus",
          headerLeft: () => null,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen name="daily-survey" options={{ title: "Daily Survey" }} />
      <Stack.Screen name="weekly-survey" options={{ title: "Weekly Survey" }} />

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

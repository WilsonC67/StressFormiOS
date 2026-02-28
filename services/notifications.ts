import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function configureNotifications() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return true;
}

export async function scheduleSurveyReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Sunday (1) through Friday (6): daily survey reminder
  const dailyDays = [1, 2, 3, 4, 5, 6];
  for (const day of dailyDays) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Survey",
        body: "Time for your daily check-in.",
        data: { url: "/daily-survey" },
      },
      trigger: {
        type: SchedulableTriggerInputTypes.WEEKLY,
        weekday: day,
        hour: 18,
        minute: 0,
      },
    });
  }

  // Saturday (7): reminder for botj daily and weekly
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You have 2 surveys.",
      body: "It's Saturday! Please complete both your daily and weekly surveys.",
      data: { url: "/welcome" },
    },
    trigger: {
      type: SchedulableTriggerInputTypes.WEEKLY,
      weekday: 7,
      hour: 18,
      minute: 0,
    },
  });
}

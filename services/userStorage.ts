import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_ID_KEY = "user_id_timestamp";

export const getOrCreateUserId = async () => {
  try {
    let userId = await AsyncStorage.getItem(USER_ID_KEY);

    if (!userId) {
      // use current timestamp as ID
      userId = Date.now().toString();
      await AsyncStorage.setItem(USER_ID_KEY, userId);
      console.log("First launch! Created User ID:", userId);
    }

    return userId;
  } catch (e) {
    console.error("Error managing User ID", e);
    return "fallback_user";
  }
};

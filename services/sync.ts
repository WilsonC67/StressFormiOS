import { Platform } from "react-native";
import { getOrCreateUserId } from "./userStorage";

const SERVER_URL = "https://qustressstudy.duckdns.org/upload";

export const uploadData = async (payload: any) => {
  try {
    const USER_ID = await getOrCreateUserId();
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: USER_ID,
        platform: Platform.OS, // "ios" or "android"
        data: payload,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Upload failed:", error);
    return false;
  }
};

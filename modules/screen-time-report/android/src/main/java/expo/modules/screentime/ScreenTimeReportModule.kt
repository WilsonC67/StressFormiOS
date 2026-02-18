package expo.modules.screentime

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.os.Build
import android.os.Process
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlin.math.roundToInt

class ScreenTimeReportModule : Module() {
  override fun definition() = ModuleDefinition {
    // The name used in requireNativeModule("ScreenTimeReport")
    Name("ScreenTimeReport")

    // 1. Check Permission
    AsyncFunction("hasAndroidPermission") {
      val context = appContext.reactContext ?: return@AsyncFunction false
      val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
      val mode = appOps.checkOpNoThrow(
        AppOpsManager.OPSTR_GET_USAGE_STATS,
        Process.myUid(),
        context.packageName
      )
      return@AsyncFunction mode == AppOpsManager.MODE_ALLOWED
    }

    // 2. Request Permission
    AsyncFunction("requestAndroidPermission") {
      val context = appContext.reactContext ?: return@AsyncFunction null
      val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      context.startActivity(intent)
      return@AsyncFunction null
    }

    // 3. Get Data
    AsyncFunction("getAndroidDailyUsage") {
      val context = appContext.reactContext ?: return@AsyncFunction mapOf<String, Int>()
      val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
      val packageManager = context.packageManager

      val endTime = System.currentTimeMillis()
      val startTime = endTime - (24 * 60 * 60 * 1000) // Last 24 hours

      val usageStatsList = usageStatsManager.queryUsageStats(
        UsageStatsManager.INTERVAL_DAILY,
        startTime,
        endTime
      )

      val categoryMap = mutableMapOf(
        "creativity" to 0L, "education" to 0L, "entertainment" to 0L,
        "games" to 0L, "informationReading" to 0L, "other" to 0L,
        "productivityFinance" to 0L, "shoppingFood" to 0L, "social" to 0L,
        "system" to 0L, "travel" to 0L, "utilities" to 0L
      )

      for (usageStats in usageStatsList) {
        if (usageStats.totalTimeInForeground > 0) {
          try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
              val appInfo = packageManager.getApplicationInfo(usageStats.packageName, 0)
              val categoryKey = mapAndroidCategoryToKey(appInfo.category)
              categoryMap[categoryKey] = categoryMap[categoryKey]!! + usageStats.totalTimeInForeground
            } else {
              categoryMap["other"] = categoryMap["other"]!! + usageStats.totalTimeInForeground
            }
          } catch (e: Exception) {
            categoryMap["other"] = categoryMap["other"]!! + usageStats.totalTimeInForeground
          }
        }
      }

      // Convert to hours (rounded)
      val finalResult = mutableMapOf<String, Int>()
      for ((key, millis) in categoryMap) {
        finalResult[key] = (millis / (1000.0 * 60 * 60)).roundToInt()
      }

      return@AsyncFunction finalResult
    }
  }

  private fun mapAndroidCategoryToKey(androidCategory: Int): String {
    return when (androidCategory) {
      ApplicationInfo.CATEGORY_GAME -> "games"
      ApplicationInfo.CATEGORY_AUDIO,
      ApplicationInfo.CATEGORY_VIDEO,
      ApplicationInfo.CATEGORY_IMAGE -> "entertainment"
      ApplicationInfo.CATEGORY_SOCIAL -> "social"
      ApplicationInfo.CATEGORY_NEWS -> "informationReading"
      ApplicationInfo.CATEGORY_MAPS -> "travel"
      ApplicationInfo.CATEGORY_PRODUCTIVITY -> "productivityFinance"
      ApplicationInfo.CATEGORY_ACCESSIBILITY -> "utilities"
      else -> "other"
    }
  }
}
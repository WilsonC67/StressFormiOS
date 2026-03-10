import DeviceActivity
import SwiftUI
import ExtensionKit
internal import ManagedSettings

struct WeeklyCategoryUsageReport: DeviceActivityReportScene {
    let context: DeviceActivityReport.Context = .weeklyCategoryUsage
    let content: (WeeklyCategoryUsageConfiguration) -> WeeklyCategoryUsageView

    func makeConfiguration(
        representing data: DeviceActivityResults<DeviceActivityData>
    ) async -> WeeklyCategoryUsageConfiguration {
        
        var categoryMap: [String: TimeInterval] = [:]

        // Aggregate usage by category name
        for await day in data {
            for await segment in day.activitySegments {
                for await category in segment.categories {
                    let name = category.category.localizedDisplayName ?? "Unknown"
                    let duration = category.totalActivityDuration
                    categoryMap[name, default: 0] += duration
                }
            }
        }

        // Convert TimeInterval (seconds) to Minutes (Int) rounded to nearest
        var finalData: [String: Int] = [:]
        for (name, seconds) in categoryMap {
            let minutes = Int((seconds / 60.0).rounded())
            finalData[name] = minutes
        }

        return WeeklyCategoryUsageConfiguration(categoryData: finalData)
    }
}

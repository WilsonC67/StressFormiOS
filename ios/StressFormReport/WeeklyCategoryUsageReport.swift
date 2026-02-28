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

        // Convert TimeInterval (seconds) to Hours (Int) rounded to nearest
        var finalData: [String: Int] = [:]
        for (name, seconds) in categoryMap {
            let hours = Int((seconds / 3600.0).rounded())
            finalData[name] = hours
        }

        return WeeklyCategoryUsageConfiguration(categoryData: finalData)
    }
}

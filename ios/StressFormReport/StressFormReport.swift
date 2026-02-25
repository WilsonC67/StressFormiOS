//
//  StressFormReport.swift
//  StressFormReport
//
//  Created by Hunter Pageau on 2/25/26.
//

import DeviceActivity
import ExtensionKit
import SwiftUI

@main
struct StressFormReport: DeviceActivityReportExtension {
    var body: some DeviceActivityReportScene {
        // Create a report for each DeviceActivityReport.Context that your app supports.
        TotalActivityReport { totalActivity in
            TotalActivityView(totalActivity: totalActivity)
        }
        // Add more reports here...
    }
}

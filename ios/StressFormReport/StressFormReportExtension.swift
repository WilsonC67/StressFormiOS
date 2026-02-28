//
//  StressFormReportExtension.swift
//  StressForm
//
//  Created by Hunter Pageau on 12/29/25.
//

import DeviceActivity
import SwiftUI
import ExtensionKit

@main
struct StressFormReportExtension: DeviceActivityReportExtension {
    var body: some DeviceActivityReportScene {
        WeeklyCategoryUsageReport { configuration in
            WeeklyCategoryUsageView(configuration: configuration)
        }
        
        TotalActivityReport { totalActivity in
            TotalActivityView(totalActivity: totalActivity)
        }
    }
}

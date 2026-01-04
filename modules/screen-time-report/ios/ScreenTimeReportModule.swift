import ExpoModulesCore
import SwiftUI
import UIKit
import DeviceActivity
import FamilyControls

public class ScreenTimeReportModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ScreenTimeReport")

    AsyncFunction("requestAuthorization") { () async throws -> String in
      let center = AuthorizationCenter.shared
      do {
        try await center.requestAuthorization(for: .individual)
        return "authorized"
      } catch {
        throw Exception(name: "AuthorizationFailed", description: "Authorization failed: \(error.localizedDescription)")
      }
    }

    AsyncFunction("presentWeeklyCategoryUsageReport") { () async throws in
      try await MainActor.run {
        guard let top = UIApplication.shared._topMostViewController() else {
          throw Exception(name: "NoViewController", description: "Unable to find a view controller to present from.")
        }

        let host = UIHostingController(rootView: WeeklyCategoryUsageReportHost())
        host.modalPresentationStyle = .formSheet
        top.present(host, animated: true)
      }
    }
  }
}

// Helper for UI presentation
private extension UIApplication {
  func _topMostViewController() -> UIViewController? {
    let scenes = connectedScenes.compactMap { $0 as? UIWindowScene }
    let windows = scenes.flatMap { $0.windows }
    let root = windows.first(where: { $0.isKeyWindow })?.rootViewController

    func top(from vc: UIViewController?) -> UIViewController? {
      if let nav = vc as? UINavigationController { return top(from: nav.visibleViewController) }
      if let tab = vc as? UITabBarController { return top(from: tab.selectedViewController) }
      if let presented = vc?.presentedViewController { return top(from: presented) }
      return vc
    }
    return top(from: root)
  }
}

// SwiftUI View for the Report
private struct WeeklyCategoryUsageReportHost: View {
  @Environment(\.dismiss) private var dismiss

  private var last7Days: DateInterval {
    let end = Date()
    let start = Calendar.current.date(byAdding: .day, value: -7, to: end) ?? end.addingTimeInterval(-7 * 24 * 3600)
    return DateInterval(start: start, end: end)
  }

  var body: some View {
    NavigationStack {
      VStack(spacing: 12) {
        Text("Note down or screenshot your weekly usage below.")
          .font(.headline)
          .frame(maxWidth: .infinity, alignment: .leading)
        
        Text("When you are done, close this sheet to enter the data.")
          .font(.footnote)
          .foregroundStyle(.secondary)
          .frame(maxWidth: .infinity, alignment: .leading)
          
          Text("If you can't see the table, close this sheet and open it again.")
            .font(.footnote)
            .foregroundStyle(.secondary)
            .frame(maxWidth: .infinity, alignment: .leading)

          DeviceActivityReport(
            DeviceActivityReport.Context(rawValue: "weeklyCategoryUsage"),
            filter: DeviceActivityFilter(
              segment: .daily(during: last7Days), 
              users: .all,
              devices: .init([.iPhone]),
              applications: [],
              categories: [],
              webDomains: []
            )
          )
      }
      .padding()
      .navigationTitle("Weekly Usage")
      .toolbar {
        ToolbarItem(placement: .cancellationAction) {
          Button("Close") { dismiss() }
        }
      }
    }
  }
}

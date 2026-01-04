import SwiftUI

struct WeeklyCategoryUsageView: View {
    let configuration: WeeklyCategoryUsageConfiguration

    // Sort categories alphabetically
    var sortedCategories: [(key: String, value: Int)] {
        configuration.categoryData.sorted { $0.key < $1.key }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Weekly Usage")
                .font(.system(size: 16, weight: .bold))
                .padding(.vertical, 8)
                .frame(maxWidth: .infinity, alignment: .center)

            Divider()

            VStack(spacing: 0) {
                ForEach(sortedCategories, id: \.key) { item in
                    HStack {
                        Text(item.key)
                            .font(.system(size: 13, weight: .medium))
                            .foregroundStyle(.primary)
                        
                        Spacer()
                        
                        Text("\(item.value) h")
                            .font(.system(size: 13, weight: .bold, design: .rounded))
                            .foregroundStyle(.blue)
                    }
                    .padding(.vertical, 6)
                    .padding(.horizontal, 4)
                    
                    Divider()
                }
            }
            
            Spacer(minLength: 0)
        }
        .padding(.horizontal, 16)
        .padding(.top, 4)
        .background(Color(UIColor.systemBackground))
    }
}

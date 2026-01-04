//
//  TotalActivityView.swift
//  StressFormReport
//
//  Created by Hunter Pageau on 12/29/25.
//

import SwiftUI

struct TotalActivityView: View {
    let totalActivity: String
    
    var body: some View {
        Text(totalActivity)
    }
}

#Preview {
    TotalActivityView(totalActivity: "1h 23m")
}

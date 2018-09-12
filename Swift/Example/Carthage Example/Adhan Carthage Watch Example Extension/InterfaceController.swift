//
//  InterfaceController.swift
//  Carthage Watch Example Extension
//
//  Created by Basem Emara on 6/17/17.
//  Copyright © 2017 Batoul Apps. All rights reserved.
//

import WatchKit
import Adhan

class InterfaceController: WKInterfaceController {

    @IBOutlet var tableView: WKInterfaceTable!
    
    let viewModel = PrayersViewModel()
    
    override func awake(withContext context: Any?) {
        super.awake(withContext: context)
        
        guard let viewModel = viewModel else { return }
        
        // Initialize table
        tableView.setNumberOfRows(viewModel.times.count, withRowType: "tableRowView")
        
        // Populate the table
        for (index, element) in viewModel.times.enumerated() {
            let row = tableView.rowController(at: index) as! TableRowView
            
            row.itemLabel.setText(viewModel.display(for: element.type))
            row.timeLabel.setText(viewModel.display(for: element.date))
            
            guard element.type == viewModel.prayers.currentPrayer() else { continue }
            row.timeLabel.setTextColor(.red)
        }
    }

}

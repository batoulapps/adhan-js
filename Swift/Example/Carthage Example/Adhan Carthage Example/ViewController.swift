//
//  ViewController.swift
//  Carthage Example
//
//  Created by Basem Emara on 6/17/17.
//  Copyright © 2017 Batoul Apps. All rights reserved.
//

import UIKit
import Adhan

class ViewController: UITableViewController {

    let viewModel = PrayersViewModel()
    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return viewModel?.times.count ?? 0
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
        
        guard let viewModel = viewModel else { return cell }
        let element = viewModel.times[indexPath.row]
        
        cell.textLabel?.text = viewModel.display(for: element.type)
        cell.detailTextLabel?.text = viewModel.display(for: element.date)
        cell.detailTextLabel?.textColor = element.type == viewModel.prayers.currentPrayer() ? .red : .darkGray

        return cell
    }
}


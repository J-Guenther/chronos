import { Component, OnInit } from '@angular/core';
import {TimeFilter, TimeTrackingService} from "../services/time-tracking.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isPresent = false;
  filterEnum = TimeFilter;
  currentFilter = TimeFilter.noFilter

  constructor(public timeTrackingService: TimeTrackingService) { }

  ngOnInit(): void {
    this.timeTrackingService.isPresent$.subscribe(isPresent => this.isPresent = isPresent);
    this.timeTrackingService.timeFilter.subscribe(timeFilter => this.currentFilter = timeFilter);
  }

  checkIn() {
   this.timeTrackingService.checkIn.next(true);
  }

  checkOut() {
    this.timeTrackingService.checkOut.next(true);
  }

  changeFilter(filter: TimeFilter) {
    this.timeTrackingService.timeFilter.next(filter);
  }

}

import { Component, OnInit } from '@angular/core';
import {TimeTrackingService} from "../services/time-tracking.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isPresent = false;

  constructor(public timeTrackingService: TimeTrackingService) { }

  ngOnInit(): void {
    this.timeTrackingService.isPresent$.subscribe(isPresent => this.isPresent = isPresent);
  }

  checkIn() {
   this.timeTrackingService.checkIn.next(true);
  }

  checkOut() {
    this.timeTrackingService.checkOut.next(true);
  }

}

import { Component, OnInit } from '@angular/core';
import {TimeTrackingService} from "../services/time-tracking.service";
import {Time} from "../timetable/timetable.component";
import * as moment from "moment";
import {distinctUntilChanged, interval, map, Observable} from "rxjs";

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {

  currentTime: Time | undefined = undefined;
  moment: any = moment;
  // @ts-ignore
  timeSinceCheckIn: Observable<string>;

  constructor(private timeTrackingService: TimeTrackingService) { }

  ngOnInit(): void {
    this.timeTrackingService.currentTimeEntry.subscribe(currentTime => {
      this.currentTime = currentTime;
      // @ts-ignore
      this.timeSinceCheckIn = interval(1000).pipe(
        map(() => {
          const diff = moment().diff(moment(this.currentTime?.checkInTime, 'LTS', 'de' ))
          if ((diff / 1000 / 60 / 60) >= 6) {
            return moment.utc(diff).subtract(30, 'minutes').format("HH:mm:ss")
          } else {
            return moment.utc(diff).format("HH:mm:ss")
          }
        }),
        distinctUntilChanged()
      );
    });
  }

}

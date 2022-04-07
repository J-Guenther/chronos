import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {NgxIndexedDBService} from "ngx-indexed-db";
import * as moment from "moment";
import {TimeTrackingService} from "../services/time-tracking.service";

export interface Time {
  id?: number
  date: string;
  checkInTime: string;
  checkOutTime: string;
}

const TIME_DATA: Time[] = [
];

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

  displayedColumns: string[] = ['date', 'checkInTime', 'checkOutTime'];
  dataSource: MatTableDataSource<Time>;

  constructor(private dbService: NgxIndexedDBService,
              private timeTrackingService: TimeTrackingService) {
    this.dataSource = new MatTableDataSource(TIME_DATA);
  }

  ngOnInit(): void {
    this.loadAll();
    this.timeTrackingService.checkIn.subscribe(checkedIn => {
      if (checkedIn) {
        this.checkIn();
      }
    });
    this.timeTrackingService.checkOut.subscribe(checkedOut => {
      if (checkedOut) {
        this.checkOut();
      }
    });
  }

  checkIn(): void {
    this.dbService
      .add('timetracking', {
        date: moment().format('L'),
        checkInTime: moment().format('LTS'),
        checkOutTime: null
      })
      .subscribe((key) => {
        // @ts-ignore
        this.timeTrackingService.currentTimeEntry.next(key);

        const newData = [ ...this.dataSource.data ];
        // @ts-ignore
        newData.push(key)

        // @ts-ignore
        this.dataSource.data = newData;

        this.timeTrackingService.isPresent$.next(true);
      })
  }

  checkOut(): void {
    // @ts-ignore
    this.timeTrackingService.currentTimeEntry.value.checkOutTime = moment().format('LTS');

    this.dbService
      .update('timetracking', this.timeTrackingService.currentTimeEntry.value)
      .subscribe((storeData) => {
        console.log('storeData: ', storeData);
        this.timeTrackingService.currentTimeEntry.next(undefined);
        this.timeTrackingService.isPresent$.next(false);
        // @ts-ignore
        this.dataSource.data = storeData;
      });
  }

  loadAll(): void {
    this.dbService.getAll('timetracking').subscribe((storeData) => {
      // @ts-ignore
      this.dataSource.data = storeData;
      const currentTime = this.dataSource.data.find(time => !time.checkOutTime && moment(time.date, 'L', 'de' ).isSame(new Date(), "day"))
      this.timeTrackingService.currentTimeEntry.next(currentTime);
      if (currentTime) {
        this.timeTrackingService.isPresent$.next(true);
      }
    });
  }


}

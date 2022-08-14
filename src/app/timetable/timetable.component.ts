import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {NgxIndexedDBService} from "ngx-indexed-db";
import * as moment from "moment";
import {TimeFilter, TimeTrackingService} from "../services/time-tracking.service";
import {MatDialog} from "@angular/material/dialog";
import {EditDialogComponent} from "../edit-dialog/edit-dialog.component";

export interface Time {
  id?: number
  date: string;
  checkInTime: string;
  checkOutTime: string;
  note: string;
}

const TIME_DATA: Time[] = [
];

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {

  noFilterColumns: string[] = ['date', 'checkInTime', 'checkOutTime', 'summe', 'note', 'actions'];
  byNoteFilterColumns: string[] = ['note', 'summe'];
  byDayFilterColumns: string[] = ['date', 'summe'];

  dataSource: MatTableDataSource<Time>;
  aggregatedByDay: MatTableDataSource<any> | null;
  aggregatedByNote: MatTableDataSource<any> | null;
  moment: any = moment;
  currentTime: Time | undefined = undefined;
  currentFilter: TimeFilter = TimeFilter.noFilter;
  filterEnum = TimeFilter;

  constructor(private dbService: NgxIndexedDBService,
              private timeTrackingService: TimeTrackingService,
              public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(TIME_DATA);
    this.aggregatedByDay = null;
    this.aggregatedByNote = null;
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
    this.timeTrackingService.currentTimeEntry.subscribe(currentTime => {
      this.currentTime = currentTime;
    });
    this.timeTrackingService.timeFilter.subscribe(currentFilter => {
      this.currentFilter = currentFilter;
      switch (currentFilter) {
        case TimeFilter.byDay:
          this.aggregatedByDay = new MatTableDataSource(this.aggregateByDay());
          console.log(this.aggregatedByDay);
          break;
        case TimeFilter.byNote:
          this.aggregatedByNote = new MatTableDataSource(this.aggregateByNote());
          break;
      }
    });
  }

  checkIn(): void {
    this.dbService
      .add('timetracking', {
        date: moment().format('L'),
        checkInTime: moment().format('LTS'),
        checkOutTime: null,
        note: null
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

  openDialog(time: Time): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: time,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dbService
          .update('timetracking', result)
          .subscribe((storeData) => {
            // @ts-ignore
            this.dataSource.data = storeData;
          });
      }
    });
  }

  aggregateByDay(): Array<any> {
    const times = this.dataSource.data;
    const days = new Map();
    times.forEach(time => {
      const timeSum = time.checkOutTime ? moment.utc(moment(time.checkOutTime, 'LTS', 'de' ).diff(moment(time.checkInTime, 'LTS', 'de' ))).format('HH:mm:ss') : '00:00:00'
      if (days.has(time.date)) {
        const addedTime = moment.duration(timeSum).add(moment.duration(days.get(time.date)))
        days.set(time.date, moment.utc(addedTime.as('milliseconds')).format('HH:mm:ss'));
      } else {
        days.set(time.date, timeSum);
      }
    });
    return Array.from(days, ([name, value]) => ({ name, value }))
  }

  aggregateByNote(): Array<any> {
    const times = this.dataSource.data;
    const notes = new Map();
    times.forEach(time => {
      const timeSum = time.checkOutTime ? moment.utc(moment(time.checkOutTime, 'LTS', 'de' ).diff(moment(time.checkInTime, 'LTS', 'de' ))).format('HH:mm:ss') : '00:00:00'
      if (notes.has(time.note)) {
        const addedTime = moment.duration(timeSum).add(moment.duration(notes.get(time.note)))
        notes.set(time.note, moment.utc(addedTime.as('milliseconds')).format('HH:mm:ss'));
      } else {
        notes.set(time.note, timeSum);
      }
    });
    return Array.from(notes, ([name, value]) => ({ name, value }))
  }


}

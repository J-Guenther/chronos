import { Injectable } from '@angular/core';
import {Time} from "../timetable/timetable.component";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TimeTrackingService {

  isPresent$ = new Subject<boolean>();
  checkIn = new Subject<boolean>();
  checkOut = new Subject<boolean>();
  currentTimeEntry = new BehaviorSubject<Time | undefined>(undefined);

  constructor() {

  }




}

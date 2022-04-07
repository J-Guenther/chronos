import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimetableComponent } from './timetable/timetable.component';
import {MatTableModule} from "@angular/material/table";
import { HeaderComponent } from './header/header.component';
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {DBConfig, NgxIndexedDBModule} from "ngx-indexed-db";

const dbConfig: DBConfig  = {
  name: 'ChronosTimeTrackingDB',
  version: 1,
  objectStoresMeta: [{
    store: 'timetracking',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'date', keypath: 'date', options: { unique: false } },
      { name: 'checkInTime', keypath: 'checkInTime', options: { unique: false } },
      { name: 'checkOutTime', keypath: 'checkOutTime', options: { unique: false } }
    ]
  }]
};

@NgModule({
  declarations: [
    AppComponent,
    TimetableComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    NgxIndexedDBModule.forRoot(dbConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

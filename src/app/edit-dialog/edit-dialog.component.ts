import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Time} from "../timetable/timetable.component";

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Time,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

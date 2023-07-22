import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-day-table',
  templateUrl: './admin-day-table.component.html',
  styleUrls: ['./admin-day-table.component.css']
})
export class AdminDayTableComponent implements OnInit {
  @Input() dayFormGroup: FormGroup;

  constructor(){ }

  ngOnInit(): void {
  }
}
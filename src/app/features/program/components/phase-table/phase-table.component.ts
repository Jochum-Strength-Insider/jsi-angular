import { Component, Input, OnInit } from '@angular/core';
import { Phase } from '@app/@core/models/program/phase.model';

@Component({
  selector: 'app-phase-table',
  templateUrl: './phase-table.component.html',
  styleUrls: ['./phase-table.component.css']
})
export class PhaseTableComponent implements OnInit {
  @Input() phase: Phase;
  @Input() programKey: string;
  @Input() uid: string;

  constructor(){ }

  ngOnInit(){
  }
}

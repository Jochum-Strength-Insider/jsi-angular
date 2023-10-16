import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.css']
})
export class CheckBoxComponent implements OnChanges {
  @Input() checked?: boolean = false;
  @Output() setChecked = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    ifPropChanged(changes['checked'], (change) => this.checked = change);
  }

  changed(){
    this.setChecked.emit();
  }
}

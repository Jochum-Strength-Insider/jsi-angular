
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Tasks } from '@app/@core/models/program/task.model';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css'],
  })
export class AutoCompleteComponent implements OnInit {
  @ViewChild('template', { static: true }) template: any;
  @Input() tasks: Tasks[] = [];
  @Input() value: string = '';
  @Input() inputClass: string = '';
  @Output() selectionChange = new EventEmitter<Tasks>();
  @Output() clicked = new EventEmitter();
  @Output() changed = new EventEmitter<string>();
  filteredOptions$: Observable<Tasks[]>;
  inputCtrl = new FormControl();

  constructor(private viewContainerRef: ViewContainerRef){}

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    
    this.filteredOptions$ = this.inputCtrl.valueChanges.pipe(
      map((value: string | Tasks) => {
        if (typeof value === 'string') {
          this.onValueChanged(value);
          return this.filterTasksByExercise(this.tasks, value);
        }
        return this.tasks;
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    ifPropChanged(changes['value'], () => {
       this.inputCtrl.setValue({ e: changes['value'].currentValue }, { emitEvent: false }) 
      });
  }

  onSelectionChange(event: any) {
    this.selectionChange.emit(event.option.value);
  }

  onValueChanged(value: string) {
    this.changed.emit(value);
  }

  displayLabelFn(option: Tasks | null) {
    return option ? option.e : '';
  }

  filterTasksByExercise(options: Tasks[], label: string): Tasks[] {
    const value = label.trim().toLocaleLowerCase();
    return options.filter((option: Tasks) => {
      return option.e.toLocaleLowerCase().includes(value);
    });
  }

  onClicked(){
    this.clicked.emit();
  }
}
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Day, IMAGE_OPTIONS } from '@app/@core/models/program/day.model';
import { ExerciseKeys } from '@app/@core/models/program/exercise.model';
import { Phase } from '@app/@core/models/program/phase.model';
import { ProgramCell } from '@app/@core/models/program/program-cell';
import { INITIAL_DATA_PHASE, INITIAL_DATA_RECOVERY, RECOVERY_KEY } from '@app/@core/models/program/program.model';
import { Tasks } from '@app/@core/models/program/task.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

// To Do

// Need To

// Bind value changes to values
// All editor search boxes are being updated when values changes

// Add Day
// Edit/Remove Day
// Save
// Cache tasks
// Quick save

// Should do
// Clean Up
// Run initial filter on search bar so the entire list isn't shown on first click
// Clear everything when opening a day modal
// Fix table overflow

@Component({
  selector: 'app-admin-phase-table',
  templateUrl: './admin-phase-table.component.html',
  styleUrls: ['./admin-phase-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPhaseTableComponent implements OnInit, OnDestroy {
  @Input() phase: Phase;
  @Input() programKey?: string;
  @Input() uid: string;
  @Input() tasks: Tasks[] = [];

  @ViewChild('deleteDayModal') deleteDayModal: any;
  @ViewChild('addEditDayModal') addEditDayModal: any;

  imageOptions: Array<{value: string, title: string }> = IMAGE_OPTIONS;

  selectedDay: Day | null = null;
  selectedCell: ProgramCell | null = null;
  
  addAtIndex: string = "";
  error: Error;

  inputCtrl = new FormControl();
  inputCtrlSub: Subscription;
  phaseFormSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}

  dayForm = this.fb.group({
    title: ["", Validators.required],
    image: ["", Validators.required]
  });

  get df() {
    return this.dayForm.controls;
  }

  phaseForm = this.fb.group({
    title: ["", Validators.required],
    days: this.fb.array([])
  })
 
  get daysArray() {
    return this.phaseForm.get('days') as FormArray;
  }

  getDay(dayIndex: number): FormGroup {
    return this.daysArray.at(dayIndex) as FormGroup;
  }

  dayTitle(dayIndex: number) : string {
    return this.daysArray.at(dayIndex).get('title')?.value || "";
  }

  daysExercises(dayIndex: number) : FormArray {
    return this.daysArray.at(dayIndex).get("exercises") as FormArray
  }

  getExerciseAtIndex(dayIndex: number, rowIndex: number) : FormGroup {
    return this.daysExercises(dayIndex).controls.at(rowIndex) as FormGroup;
  }

  getExerciseValue(dayIndex: number, rowIndex: number, name: ExerciseKeys) : string {
    return this.getExerciseAtIndex(dayIndex, rowIndex)?.get(name)?.value || ""
  }

  selectedDaysCellValue(selecteDayIndex: number): string {
    if(this.selectedCell === null){
      return "";
    }
    const { dayIndex, rowIndex, name } = this.selectedCell;
    const value = this.getExerciseValue(selecteDayIndex, rowIndex, name)
    return dayIndex === selecteDayIndex ? value : "";
  }

  ngOnInit(){
    this.mapPhaseToForm();

    this.inputCtrlSub = this.inputCtrl.valueChanges
    .subscribe( value => {
      if(this.selectedCell){
        this.handleValueChanged(value);
      }
    })

    this.phaseFormSub = this.phaseForm.valueChanges.subscribe(
      value => {
        if(this.selectedCell) {
          const formValue = value as Phase;
          if(this.selectedCell.name !== 'tracking') {
            const day = formValue.days[this.selectedCell.dayIndex];
            const exercise = day.exercises[this.selectedCell.rowIndex]
            const value = exercise[this.selectedCell.name];
            this.inputCtrl.patchValue(value, { emitEvent: false })
          }
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.inputCtrlSub?.unsubscribe();
    this.phaseFormSub?.unsubscribe();
  }

  mapPhaseToForm() {
    this.phaseForm.patchValue({ title: this.phase.title });
    this.phase.days.forEach((day: Day) =>  this.daysArray.push(this.createDayForm(day)))
    console.log(this.phaseForm.getRawValue());
  }

  patchDayForm(day: Day | null = null){
    this.dayForm.patchValue({
      title: day ? day.title : "",
      image: day ? day.image : 'max-upper'
    })
  }

  resetDayForm(){
    this.patchDayForm(this.selectedDay);
  }

  openDeleteDayModal(dayIndex: number | null){
    if(dayIndex !== null){
      const { id, title, image } = this.getDay(dayIndex).value;
      this.selectedDay = new Day(id, title, image);
    } else {
      this.selectedDay = null;
    }

    this.modalService.open(this.deleteDayModal, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  openAddEditDayModal(dayIndex: number | null) {
    if(dayIndex !== null){
      const { id, title, image } = this.getDay(dayIndex).value;
      this.selectedDay = new Day(id, title, image);
    } else {
      this.selectedDay = null;
    }
    this.patchDayForm(this.selectedDay);

    this.modalService.open(this.addEditDayModal, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  createDayForm(day: Day){
    const newDayForm = this.fb.group({
      id: day.id,
      title: day.title,
      image: day.image,
      exercises: this.fb.array([]),
    })
    day.exercises.forEach((day) => {
      (newDayForm.get('exercises') as FormArray).push(
        this.fb.group({
          Number: [day.Number, Validators.required],
          Description: [day.Description, Validators.required],
          Link: [day.Link, Validators.required],
          Sets: [day.Sets, Validators.required],
          Reps: [day.Reps, Validators.required],
          Rest: [day.Rest, Validators.required],
          Tempo: [day.Tempo, Validators.required],
          tracking: this.fb.group({
            'week 1': [""],
            'week 2': [""],
            'week 3': [""],
          })
        })
      )
    })

    return newDayForm;
  }
  
  handleAddDay(){
    const newDay = new Day();
    const dayIndex = this.daysArray.length;
    newDay.id = `day ${dayIndex}`;
    newDay.title = this.df['title'].value || "";
    newDay.image = this.df['image'].value || "";
    newDay.exercises = this.phase.title == RECOVERY_KEY ? INITIAL_DATA_RECOVERY : INITIAL_DATA_PHASE;
   
    const newDayForm = this.createDayForm(newDay);
    this.daysArray.push(newDayForm);

    this.modalService.dismissAll();
    console.log('handleAddDay', this.phaseForm.getRawValue());

    //   handleAddDay = (e) => {
    //     const daysUpdate = { ...days };
    //     const location = "day " + (Object.keys(daysUpdate).length + 1);
    //     daysUpdate[location] = {
    //        exercises: JSON.parse(INITIALJSON),
    //        title: dayTitle,
    //        image: selectImage
    //     };
    //  }
  }

  handleRemoveSpecificRow(dayIndex: number, index: number){
    console.log('handleRemoveSpecificRow', dayIndex, index);
  //   handleRemoveSpecificRow = (idx, key) => () => {
  //     const days = { ...this.state.days };
  //     // const dayArray = [...days[key]];
  //     const { exercises } = days[key];

  //     this.resetCurrentCell(idx);

  //     if (exercises.length > 1) {
  //        exercises.splice(idx, 1);
  //        days[key].exercises = exercises;
  //        this.setState({ days });
  //     } else {
  //        console.log("Can't remove more rows");
  //     }
  //  }
}
removeSelectedDay(){
  console.log('removeSelectedDay');
  //  removeDay = (day) => () => {
  //     const { days } = this.state;
  //     const daysUpdate = { ...days };
  //     delete daysUpdate[day]
  //     this.setState({ days: daysUpdate, select: "end" }, this.hideModal("showRemove"));
  //  }
  }

  handleAddRow(dayIndex: number){
    console.log('handleAddRow', dayIndex)
    // const TASKSHELL = {
    //   instruction: {
    //       Number: "1", Description: "", Link: "", Sets: "3", Reps: "5", Tempo: "3-3-0", Rest: ":0",
    //       tracking: { "week 1": "", "week 2": "", "week 3": "" }
    //   }, title: "Default"
    // }

  //   handleAddRow = (key) => e => {
  //     e.preventDefault();
  //     const index = this.state.select;
  //     const days = { ...this.state.days };

  //     const { instruction } = TASKSHELL;

  //     const headers = Object.keys(instruction);
  //     const items = headers.reduce(((accumulator, header) => { return { ...accumulator, [header]: instruction[header] } }), {});

  //     if (index === "end") {
  //        days[key].exercises.push(items);
  //     } else {
  //        days[key].exercises.splice(index, 0, items);
  //     }

  //     // days[key] = newDaysTable;
  //     this.setState({ days: days, select: "end" })
  //  };
  }

  handleEditDay() {
    console.log('handleEditDay');
  // handleChangeDayTitle = (e) => {
  //   e.preventDefault();
  //   const { days, modalNumber, dayTitle, selectImage } = this.state;
  //   const daysUpdate = { ...days };
  //   const dayUpdate = { ...daysUpdate[modalNumber] };
  //   dayUpdate["title"] = dayTitle;
  //   dayUpdate["image"] = selectImage;
  //   daysUpdate[modalNumber] = dayUpdate;
  //   this.setState({ days: daysUpdate }, this.hideModal("showEdit"));
  // }
  }

  handleSave(){
    console.log('handleSave');
  //  handleSave = () => {
    // const { days, completed } = this.state;
    // const { phase } = this.props;

    // const daysListJSON = Object.keys(days).reduce((accumulator, key) => {
    //     const { title, exercises, image } = days[key];
    //     const day = {
    //       image,
    //       title,
    //       exercises: JSON.stringify(exercises)
    //     };

    //     return (
    //       { ...accumulator, [key]: day }
    //     )
    // }, {});

    // const phaseUpdate = {
    //     completed: completed,
    //     ...daysListJSON
    // }

    // console.log("updating program");

    // this.props.onSave(phase, phaseUpdate)
    //     .then(this.onAlert)
    //     .catch(error => this.setState({ error }));
    // }
  }

  setCurrentCell(dayIndex: number, rowIndex: number, name: ExerciseKeys) {
    this.selectedCell = null;
    const number =  this.getExerciseValue(dayIndex, rowIndex, 'Number');
    const value =  this.getExerciseValue(dayIndex, rowIndex, name);
    this.selectedCell = new ProgramCell(dayIndex, rowIndex, name, number, value)
    this.inputCtrl.patchValue(value, { emitEvent: false });
  }

  // the selected day === dayIndex stuff might be more complicated that just splitting up the components.
  handleValueChanged(event: string, selectedDayIndex: number | null = null) {
    if(this.selectedCell === null) { return; }
    const { dayIndex, rowIndex, name } = this.selectedCell;
    // if(selectedDayIndex === dayIndex) {
      const exerciseForm = this.getExerciseAtIndex(dayIndex, rowIndex);
      exerciseForm.get(name)?.patchValue(event, { emitEvent: false });
    // }
  }

  handleSelectionChanged(event: Tasks) {
    if(this.selectedCell){
      const exerciseForm = this.getExerciseAtIndex(this.selectedCell.dayIndex, this.selectedCell.rowIndex);
      exerciseForm.get("Description")?.patchValue(event.e, { emitEvent: false });
      exerciseForm.get("Link")?.patchValue(event.l);
    }

  //   handleSearchChange = (idx, day, name) => (value, link = false) => {
  //     const days = { ...this.state.days };
  //     days[day].exercises[idx][name] = value;
  //     if (link) {
  //        days[day].exercises[idx].Link = link;
  //     }
  //     this.setState({ days });
  //  };
  }
}

// <ListGroup className="pb-5">
//     <Accordion defaultActiveKey={0}>
//       <>
//           {daysList.map((key, idx) => {

//             const dayRows = days[key].exercises;
//             const title = days[key].title;
//             const dayCapitalized = key.charAt(0).toUpperCase() + key.substring(1) + ": " + title;

//             return (
//                 <React.Fragment key={idx}>

//                   <ListGroup.Item className="overrideBorder no-top-border" key={idx}>
//                       <CustomToggle eventKey={idx + 1} variant={"link"} size={"lg"} scroll={false}><Button onClick={() => this.resetCurrentCell(idx)} style={{ fontSize: "1.25rem" }} variant="link">{dayCapitalized}</Button></CustomToggle>
//                       <Accordion.Collapse eventKey={idx + 1}>
//                         <>
//                             {/* Give an edit button that has edit title and delete? */}
//                             <span className="d-flex justify-content-between align-items-center pb-3">
//                               <Button variant="outline-warning mx-3" onClick={this.showEditModal(key, idx)}>Edit Title</Button>
//                               <Button variant="outline-danger" onClick={this.showRemoveModal(key)}>Remove</Button>
//                             </span>

//                             <EditCellForm
//                               value={
//                                   days[currentCell.dayIndex] ? 
//                                   days[currentCell.dayIndex].exercises[currentCell.rowIndex][currentCell.name]
//                                   : ""
//                               }
//                               tasks={this.props.tasks}
//                               dayIndex={currentCell.dayIndex}
//                               rowIndex={currentCell.rowIndex}
//                               name={currentCell.name}
//                               number={currentCell.number}
//                               handleChange={this.handleChange(currentCell.rowIndex, currentCell.dayIndex)}
//                               handleSearchChange={this.handleSearchChange(currentCell.rowIndex, currentCell.dayIndex, "Description")}
//                             />

//                             <Table responsive bordered striped size="sm" >
//                               <thead>
//                                   <tr style={{ position: "relative" }}>
//                                     <th className="text-center  dth-number">#</th>
//                                     <th className="text-center  dth-description">Description</th>
//                                     <th className="text-center  dth-link">Link</th>
//                                     <th className="text-center  dth-sets">Sets</th>
//                                     <th className="text-center  dth-reps">Reps</th>
//                                     <th className="text-center  dth-tempo">Tempo</th>
//                                     <th className="text-center  dth-rest">Rest</th>
//                                     {showTracking && (
//                                         <>
//                                           <th className="text-center dth-w1">w1</th>
//                                           <th className="text-center dth-w2">w2</th>
//                                           <th className="text-center dth-w3">w3</th>
//                                         </>
//                                     )
//                                     }

//                                     <th className="text-center  dth-btn"><span role="img" aria-label='Delete'>&#10060;</span></th>
//                                   </tr>
//                               </thead>

//                               <tbody>
//                                   {dayRows.map((item, rowIndex) => (
//                                     <tr id="addr0" key={rowIndex}>
//                                         <td>
//                                           <input
//                                               type="text"
//                                               name="Number"
//                                               value={item["Number"]}
//                                               onChange={this.handleChange(rowIndex, key)}
//                                               onClick={this.setCurrentCell(key, rowIndex, "Number", item["Number"])}
//                                               className="data-grid-control"
//                                           />
//                                         </td>
//                                         <td className="data-grid-control" onClick={this.setCurrentCell(key, rowIndex, "Description", item["Number"])}>
//                                           <SearchBar suggestions={this.props.tasks} initialValue={item["Description"]} onChange={this.handleSearchChange(rowIndex, key, "Description")} />
//                                         </td>
//                                         <td>
//                                           <input
//                                               type="text"
//                                               name="Link"
//                                               value={item["Link"]}
//                                               onChange={this.handleChange(rowIndex, key)}
//                                               onClick={this.setCurrentCell(key, rowIndex, "Link", item["Number"])}
//                                               className="data-grid-control"
//                                           />
//                                         </td>
//                                         <td>
//                                           <input
//                                               type="text"
//                                               name="Sets"
//                                               value={item["Sets"]}
//                                               onChange={this.handleChange(rowIndex, key)}
//                                               onClick={this.setCurrentCell(key, rowIndex, "Sets", item["Number"])}
//                                               className="data-grid-control"
//                                           />
//                                         </td>
//                                         <td>
//                                           <input
//                                               type="text"
//                                               name="Reps"
//                                               value={item["Reps"]}
//                                               onChange={this.handleChange(rowIndex, key)}
//                                               onClick={this.setCurrentCell(key, rowIndex, "Reps", item["Number"])}

//                                               className="data-grid-control"
//                                           />
//                                         </td>
//                                         <td>
//                                           <input
//                                               type="text"
//                                               name="Tempo"
//                                               value={item["Tempo"]}
//                                               onChange={this.handleChange(rowIndex, key)}
//                                               onClick={this.setCurrentCell(key, rowIndex, "Tempo", item["Number"])}

//                                               className="data-grid-control"
//                                           />
//                                         </td>
//                                         <td>
//                                           <input
//                                               type="text"
//                                               name="Rest"
//                                               value={item["Rest"]}
//                                               onChange={this.handleChange(rowIndex, key)}
//                                               onClick={this.setCurrentCell(key, rowIndex, "Rest", item["Number"])}
//                                               className="data-grid-control"
//                                           />
//                                         </td>

//                                         {showTracking && (
//                                           <>
//                                               <td className="vertical-align-center">
//                                                 {item["tracking"]["week 1"]}
//                                               </td>
//                                               <td className="vertical-align-center">
//                                                 {item["tracking"]["week 2"]}
//                                               </td>
//                                               <td className="vertical-align-center">
//                                                 {item["tracking"]["week 3"]}
//                                               </td>
//                                           </>
//                                         )
//                                         }

//                                         <td className="vertical-align-center">
//                                           <Button
//                                               variant={"outline-danger"}
//                                               onClick={this.handleRemoveSpecificRow(rowIndex, key)}
//                                           >
//                                               &#215;
//                                   </Button>
//                                         </td>
//                                     </tr>
//                                   ))}
//                               </tbody>
//                             </Table>

//                             <Form onSubmit={this.handleAddRow(key)}>
//                               <Form.Group>
//                                   <Form.Label>Add Row at Index</Form.Label>
//                                   <InputGroup className="mb-3">
//                                     <InputGroup.Prepend>
//                                         <Button type="submit" className="px-5" variant="outline-secondary">Add</Button>
//                                     </InputGroup.Prepend>
//                                     <Form.Control as="select" value={this.state.select} onChange={this.handleSelect}>
//                                         {
//                                           dayRows.map((row, index) => <option key={index} value={index}>{index}</option>)
//                                         }
//                                         <option value={"end"}>End of Table</option>
//                                     </Form.Control>
//                                   </InputGroup>
//                               </Form.Group>
//                             </Form>
//                         </>
//                       </Accordion.Collapse>
//                   </ListGroup.Item>

//                 </React.Fragment>
//             )
//           }

//           )
//           }
//           <ListGroup.Item>
//             <Form className="d-flex justify-content align-items-center">
//                 <Button size="lg" variant="link" onClick={this.showAddModal}>Add Day</Button>
//             </Form>
//           </ListGroup.Item>
//           <ListGroup.Item>
//             <Form>
//                 <Form.Group controlId="exampleForm.ControlSelect2">
//                   <Form.Label>Save {this.props.phase}</Form.Label>
//                   {
//                       alert
//                         ? <Button className="mr-5" onClick={this.handleSave} variant="outline-success" block>Saved!</Button>
//                         : <Button className="mr-5" onClick={this.handleSave} variant="outline-primary" block>Save</Button>
//                   }
//                 </Form.Group>
//             </Form>
//           </ListGroup.Item>
//       </>
//     </Accordion>
// </ListGroup>
// </>


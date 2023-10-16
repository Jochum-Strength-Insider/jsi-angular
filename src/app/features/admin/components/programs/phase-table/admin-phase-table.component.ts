import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Day, IMAGE_OPTIONS } from '@app/@core/models/program/day.model';
import { Phase } from '@app/@core/models/program/phase.model';
import { INITIAL_DATA_PHASE, INITIAL_DATA_RECOVERY, RECOVERY_KEY } from '@app/@core/models/program/program.model';
import { Tasks } from '@app/@core/models/program/task.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-admin-phase-table',
  templateUrl: './admin-phase-table.component.html',
  styleUrls: ['./admin-phase-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPhaseTableComponent implements OnInit {
  @Input() phase: Phase;
  @Input() programKey?: string;
  @Input() uid: string;
  @Input() tasks: Tasks[] = [];
  @Output() savePhase = new EventEmitter<Phase>();

  @ViewChild('deleteDayModal') deleteDayModal: any;
  @ViewChild('addEditDayModal') addEditDayModal: any;

  imageOptions: Array<{value: string, title: string }> = IMAGE_OPTIONS;
  selectedDay: Day | null = null;
  selectedDayIndex: number | null;
  error: Error;

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

  ngOnInit(){
    this.mapPhaseToForm();
  }

  mapPhaseToForm() {
    this.phaseForm.patchValue({ title: this.phase.title });
    this.phase.days.forEach((day: Day) =>  this.daysArray.push(this.createDayForm(day)))
  }

  patchDayForm(day: Day | null = null){
    this.dayForm.patchValue({
      title: day ? day.title : "",
      image: day ? day.image : 'max-upper'
    })
  }

  resetDayForm() {
    this.patchDayForm(this.selectedDay);
  }

  openDeleteDayModal(dayIndex: number | null){
    if(dayIndex !== null){
      const { id, title, image } = this.getDay(dayIndex).value;
      this.selectedDay = new Day(id, title, image);
      this.selectedDayIndex = dayIndex;
    } else {
      this.selectedDay = null;
      this.selectedDayIndex = null;
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
      this.selectedDayIndex = dayIndex;
    } else {
      this.selectedDay = null;
      this.selectedDayIndex = null;
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
            'week 1': [{value: day.tracking['week 1'], disabled: true}],
            'week 2': [{value: day.tracking['week 2'], disabled: true}],
            'week 3': [{value: day.tracking['week 3'], disabled: true}]
          })
        })
      )
    })

    return newDayForm;
  }
  
  handleAddDay(){
    const newDay = new Day();
    const dayIndex = this.daysArray.length + 1;
    newDay.id = `day ${dayIndex}`;
    newDay.title = this.df['title'].value || "";
    newDay.image = this.df['image'].value || "";
    newDay.exercises = this.phase.title == RECOVERY_KEY ? INITIAL_DATA_RECOVERY : INITIAL_DATA_PHASE;
   
    const newDayForm = this.createDayForm(newDay);
    this.daysArray.push(newDayForm);

    this.modalService.dismissAll();
  }

  removeSelectedDay() {
    if(this.selectedDayIndex !== null){
      this.daysArray.removeAt(this.selectedDayIndex);
      this.selectedDay = null;
      this.selectedDayIndex = null;

      const days = this.daysArray.controls;
      days.forEach((day, i) => {
        day.patchValue({ id: `day ${i + 1}` })
      });
    }
    this.modalService.dismissAll();
  }

  handleEditDay() {
    if(this.selectedDayIndex !== null) {
      const day = this.getDay(this.selectedDayIndex);
      const title = this.df['title'].value || "";
      const image = this.df['image'].value || "";
      day.patchValue({ title, image })
    }
    this.modalService.dismissAll();
  }

  handleSave(){
    const phaseUpdate = this.phaseForm.getRawValue() as Phase;
    this.savePhase.emit(phaseUpdate);
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


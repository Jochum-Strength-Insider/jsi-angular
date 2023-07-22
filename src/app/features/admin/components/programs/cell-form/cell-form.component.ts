import { Component } from '@angular/core';

@Component({
  selector: 'app-cell-form',
  templateUrl: './cell-form.component.html',
  styleUrls: ['./cell-form.component.css']
})
export class CellFormComponent {

}

// <EditCellForm
// value={
//    days[currentCell.dayIndex] ? 
//    days[currentCell.dayIndex].exercises[currentCell.rowIndex][currentCell.name]
//    : ""
// }
// tasks={this.props.tasks}
// dayIndex={currentCell.dayIndex}
// rowIndex={currentCell.rowIndex}
// name={currentCell.name}
// number={currentCell.number}
// handleChange={this.handleChange(currentCell.rowIndex, currentCell.dayIndex)}
// handleSearchChange={this.handleSearchChange(currentCell.rowIndex, currentCell.dayIndex, "Description")}
// />

// const EditCellForm = ({ value, tasks, name, number, handleChange, handleSearchChange }) => {
//   return (
//      <div>
//         <Form onSubmit={(e) => e.preventDefault()}>
//            <Form.Group>
//               <div className="lineContainer">
//                  <div className="cell left input-group-text">
//                     <span>{number}</span>
//                     <span>{name}</span>
//                  </div>
//                  {name === "Description" ? (
//                     <SearchBar
//                        className="cell"
//                        suggestions={tasks}
//                        initialValue={value}
//                        onChange={handleSearchChange}
//                     />
//                  ) : (
//                        <Form.Control
//                           type="text"
//                           className="cell right"
//                           name={name}
//                           value={value}
//                           onChange={handleChange}
//                        />
//                     )}
//               </div>
//            </Form.Group>
//         </Form>
//      </div>
//   )
// }
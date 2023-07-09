import React, { Component } from "react";

import { withFirebase } from '../Firebase';

import Modal from '../Modal';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import * as ROUTES from '../../constants/routes';

import { withRouter } from 'react-router-dom';
import CreateProgramTable from './CreateProgramTable';

class ProgramItemBase extends Component {
   constructor(props) {
      super(props);

      this.titleRef = React.createRef();

      this.state = {
         loading: false,
         program: null,
         folders: [],
         selectedFolder: null,
         pid: this.props.match.params.pid || null,
         editable: false,
         tasks: [
            {
               instruction: {
                  Number: "1", Description: "Monster Walks", Link: "https://www.youtube.com", Sets: "3", Reps: "5", Rest: ":0",
                  tracking: { "week 1": "", "week 2": "", "week 3": "" }
               }, title: "Default"
            }
         ],
         showTitle: false,
         error: null,
         ...props.location.state,
      };
   }

   fetchPrograms = () => {
      this.props.firebase
         .program(this.state.pid)
         .on('value', snapshot => {
            const programObject = snapshot.val();
            if (programObject) {
          
               this.setState({
                  program: programObject,
                  loading: false,
                  editable: true,
                  selectedFolder: programObject.parentFolderId
               });
            } else {
               console.log("no program object");
            }
         });
   }

   fetchFolders = () => {
      this.props.firebase
         .folders()
         .on('value', snapshot => {
            const foldersObject = snapshot.val();
            if (foldersObject) {
               const idsList = Object.keys(foldersObject);
               const idsArray = idsList.map(key => ({
                 id: key,
                 ...foldersObject[key],
               })).sort((a, b) => {
                 return a.title?.toLowerCase() > b.title?.toLowerCase() ? 1 : -1
               });

               this.setState({
                  folders: idsArray,
                  loading: false,
               });
            } else {
               this.setState({
                  folders: [],
                  loading: false,
               });
               console.log("no folders object");
            }
         });
   }

   fetchTasks() {
      const tasks = JSON.parse(localStorage.getItem('tasks'));
      if (tasks) {
         this.setState({ tasks: tasks });
      } else {
         this.props.firebase.tasks().once("value").then(snap => {
            const tasksObject = snap.val();
            if (tasksObject) {
               const tasksList = Object.keys(tasksObject);
               const tasksArray = tasksList.map(key => ({
                  tid: key,
                  ...tasksObject[key],
               }));
               this.setState({ tasks: tasksArray })
            }
         })
      }
   }

   showTitleModal = () => {
      this.setState({ showTitle: true });
   }

   hideTitleModal = () => {
      this.setState({ showTitle: false });
   }

   editProgram = (e) => {
      e.preventDefault();
      const title = this.titleRef.current.value.trim();
      let folder = this.state.selectedFolder;
      if( folder === ROUTES.PROGRAM_FOLDERS_DETAILS_UNCATEGORIZED ){
         folder = null;
      }

      this.props.firebase
         .program(this.state.pid)
         .update({ "title": title, "parentFolderId": folder })
         .then(() => {
            this.props.firebase
               .programId(this.state.pid)
               .update({ "title": title, "parentFolderId": folder })
               .then(this.hideTitleModal);
         })
   }

   handleSelect = (e) => {
      const key = e.target.value;
      this.setState({ selectedFolder: key })
   }

   onSave = (phase, phaseUpdate) => {
      const { firebase } = this.props;
      const { pid } = this.state;

      return firebase
         .program(pid)
         .child("instruction")
         .child(phase)
         .set(phaseUpdate)
   }

   componentDidMount() {
      this.fetchPrograms();
      this.fetchTasks();
      this.fetchFolders();
   }

   componentWillUnmount() {
      this.props.firebase.program(this.state.pid).off();
      this.props.firebase.folders().off();
      this.props.firebase.workouts(this.state.uid).off();
      this.props.firebase.workouts(this.state.uid).child(this.state.pid).off()
   }

   render() {
      const { program, folders, loading, pid, uid, tasks, error, showTitle, selectedFolder } = this.state;
      const title = program ? program.title : "";

      return (
         <>
            <Modal handleClose={this.hideTitleModal} show={showTitle} heading={"Edit Program Details"} >
               <Form onSubmit={this.editProgram}>
                  <Form.Group>
                     <Form.Label>Program Title</Form.Label>
                     <Form.Control
                        type="text"
                        ref={this.titleRef}
                        defaultValue={title}
                     />
                  </Form.Group>
                  <Form.Group>
                     <Form.Label>Folders List</Form.Label>
                     <Form.Control as="select" name="folder" value={selectedFolder} onChange={this.handleSelect}>
                        <option
                           value={ROUTES.PROGRAM_FOLDERS_DETAILS_UNCATEGORIZED}
                        >
                           Uncategorized
                        </option>
                        { folders.map((folder, idx) => {
                           return (
                              <option
                                 key={idx}
                                 value={folder.id}
                              >
                                 {folder.title}
                              </option>
                           )
                        })}
                     </Form.Control>
                  </Form.Group>
                  <Button type="submit">Save Program Details</Button>
               </Form>
            </Modal>

            {loading && <div>Loading ...</div>}
            {error && <Alert>{error.message}</Alert>}

            {program && (
               <>
                  <span className="d-flex justify-content-between align-items-center">
                     <h3 className="program-title" onClick={this.showTitleModal}>{program.title}</h3>
                  </span>
                  <CreateProgramTable onSave={this.onSave} tasks={tasks} program={program} pid={pid} uid={uid} />
               </>
            )}
         </>
      );
   }
}

// const ProgramItem = withRouter(withFirebase(ProgramItemBase));
const ProgramItem = withRouter(withFirebase(ProgramItemBase));

export default ProgramItem;

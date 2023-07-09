import React, { Component } from "react";

import { withFirebase } from '../Firebase';
import Modal from '../Modal';

import * as ROUTES from '../../constants/routes';
import { PROGRAM } from '../../constants/defaultProgram';

import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


class UserItemBase extends Component {
  constructor(props) {
    super(props);

    this.titleRef = React.createRef();

    this.state = {
      loading: false,
      selectedProgram: "",
      programIds: [],
      programIdsFiltered: [],
      folderTitle: "New Folder",
      showProgramModal: false,
      programTitle: "New Program",
      showFolderModal: false,
      removeKey: 0,
      showRemove: false,
      error: null,
      disableTitleChange: false,
      fid: this.props.match.params.fid || null,
      ...props.location.state,
    };    
  }

  handleCreateProgram = (e) => {
    e.preventDefault();
    const timestamp = this.props.firebase.serverValue.TIMESTAMP;
    const { programTitle, fid } = this.state;
    const programData = PROGRAM(timestamp);

    programData["title"] = programTitle;
    programData["parentFolderId"] = fid;
    this.props.firebase.programs().push(programData)
      .then((snap) => {
        const key = snap.key;
        this.props.firebase.programIds().update({ [key]: { title: programTitle, createdAt: timestamp, parentFolderId: fid } });
        this.handleCloseModals();
      })
      .catch(error => this.setState({ error }));
  }

  handleAddExistingProgram = (e) => {
    e.preventDefault();
    this.props.firebase
       .program(this.state.selectedProgram)
       .update({ "parentFolderId": this.state.fid })
       .then(() => {
          this.props.firebase
             .programId(this.state.selectedProgram)
             .update({"parentFolderId": this.state.fid })
             .then(this.hideTitleModal);
       })
  }

  onRemoveProgram = () => {
    const pid = this.state.removeKey;
    this.props.firebase.programId(pid).remove();
    this.props.firebase.program(pid).remove();
    this.handleRemoveClose();
  };

  editFolderTitle = (e) => {
    e.preventDefault();
    const title = this.titleRef.current.value.trim();
    this.props.firebase
      .folder(this.state.fid)
      .update({ "title": title })
      .then(() => {
        this.handleCloseModals();
      })
  }

  handleChange = (e) => {
    const { value, name } = e.target;
    this.setState({ [name]: value })
  }

  handleShowProgramModal = () => {
    if(this.state.programIds.length < 1) {
      this.props.firebase.programIds()
      .orderByChild("parentFolderId")
      .equalTo(null)
      .on('value', snapshot => {
        const programIdsObject = snapshot.val();
        if (programIdsObject) {

          const idsList = Object.keys(programIdsObject);
          const idsArray = idsList.map(key => ({
            id: key,
            ...programIdsObject[key],
          })).sort((a, b) => {
            return a.title?.toLowerCase() > b.title?.toLowerCase() ? 1 : -1
          });

          this.setState({
            programIds: idsArray,
            showProgramModal: true,
            loading: false,
          });
        } else {
          this.setState({
            programIds: [],
            showProgramModal: true,
            loading: false,
          });
        }
      });
    } else {
      this.setState({ showProgramModal: true });
    }
  }

  handleShowFolderModal = () => {
    this.setState({ showFolderModal: true });
  }

  handleCloseModals = () => {
    this.setState({ showProgramModal: false, showFolderModal: false })
  }

  setRemoveKey = (key) => {
    this.setState({ showRemove: true, removeKey: key })
  }

  handleRemoveClose = () => {
    this.setState({ removeKey: null, showRemove: false })
  }

  handleSelectProgram = (e) => {
    const key = e.target.value;
    this.setState({ selectedProgram: key })
  }

  fetchProgramsList() {
    console.log('fetchProgramsList');

    this.setState({ loading: true });
    let folderQuery;
    if(this.state.fid === ROUTES.PROGRAM_FOLDERS_DETAILS_ALL) {
      folderQuery = this.props
        .firebase
        .programIds();
      this.setState({ folderTitle: 'All', loading: false, disableTitleChange: true })
    } else if (this.state.fid === ROUTES.PROGRAM_FOLDERS_DETAILS_UNCATEGORIZED) {
      folderQuery = this.props.firebase
        .programIds()
        .orderByChild("parentFolderId")
        .equalTo(null);
      this.setState({folderTitle: 'Uncategorized', loading: false, disableTitleChange: true })
    } else {
      folderQuery = this.props.firebase
        .programIds()
        .orderByChild("parentFolderId")
        .equalTo(this.state.fid);
      this.fetchFolderInfo();
    }
   
    folderQuery
      .on('value', snapshot => {
        const programIdsObject = snapshot.val();
        if (programIdsObject) {

          const idsList = Object.keys(programIdsObject);
          const idsArray = idsList.map(key => ({
            id: key,
            ...programIdsObject[key],
          })).sort((a, b) => {
            return a.title?.toLowerCase() > b.title?.toLowerCase() ? 1 : -1
          });

          this.setState({
            programIdsFiltered: idsArray,
            loading: false,
          });
        } else {
          this.setState({
            programIdsFiltered: [],
            loading: false,
          });
        }
      });
  }

  fetchFolderInfo(){
    this.setState({ loading: true });
    this.props.firebase
      .folder(this.state.fid)
      .on('value', snapshot => {
        const folderObject = snapshot.val();
        if (folderObject) {
          let { title } = folderObject;
          this.setState({
            folderTitle: title,
            loading: false
          });
        } else {
          this.setState({loading: false});
        }
      });
  }

  componentDidMount() {
    this.fetchProgramsList();
  }

  componentWillUnmount() {
    this.props.firebase.programs().off();
    this.props.firebase.programIds().off();
    this.props.firebase.folder(this.state.fid).off();
  }

  render() {
    const { loading, programIds, programIdsFiltered, folderTitle, disableTitleChange, selectedProgram, error } = this.state;

    return (
      <>
      <Modal handleClose={this.handleCloseModals} show={this.state.showProgramModal} heading={"Add Program"}>
        <Form onSubmit={this.handleCreateProgram}>
            <Form.Group>
              <Form.Label>Program Title</Form.Label>
              <Form.Control
                type="text"
                name="programTitle"
                value={this.state.programTitle}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Button type="submit" >Create New Program</Button>
          </Form>
          {
            !disableTitleChange && (
              <>
                <hr></hr>
                <Form onSubmit={this.handleAddExistingProgram}>
                  <Form.Group>
                    <Form.Label>Program List</Form.Label>
                    <Form.Control as="select" name="program" value={selectedProgram} onChange={this.handleSelectProgram}>
                      { programIds.map((program, idx) => {
                        return (
                          <option
                          key={idx}
                          value={program.id}
                          >
                                {program.title}
                            </option>
                          )
                        })}
                    </Form.Control>
                  </Form.Group>
                  <Button type="submit">Add Existing Program</Button>
                </Form>
              </>
             )
            }
        </Modal>

        <Modal handleClose={this.handleCloseModals} show={this.state.showFolderModal} heading={"Edit Folder Title"} >
          <Form onSubmit={this.editFolderTitle}>
            <Form.Group>
                <Form.Label>Folder Title</Form.Label>
                <Form.Control
                  type="text"
                  ref={this.titleRef}
                  disabled={disableTitleChange}
                  defaultValue={this.state.folderTitle}
                  />
            </Form.Group>
            <Button type="submit" disabled={disableTitleChange}>Save Folder Title</Button>
            {error && <Alert variant="warning">{error.message}</Alert>}
          </Form>
        </Modal>

        <Modal handleClose={this.handleRemoveClose} show={this.state.showRemove} heading={"Remove Program?"}>
          <Form className="d-flex justify-content-between align-items-center">
            <Button variant="outline-danger" onClick={this.onRemoveProgram}>Remove</Button>
            <Button variant="primary" onClick={this.handleRemoveClose}>Cancel</Button>
          </Form>
        </Modal>

        <div className="d-flex justify-content-center mb-5">
          <div className="contain-width">
            <h3 className="program-title" onClick={this.handleShowFolderModal}>{folderTitle}</h3>
            <ListGroup>
              <ListGroup.Item>
                <Button onClick={this.handleShowProgramModal} block>Add Program</Button>
              </ListGroup.Item>
              {
                programIdsFiltered.map(program => {
                  const date = new Date(program.createdAt);
                  const dateString = date.toLocaleDateString("en-US");

                  return (
                    <ListGroup.Item key={program.id}>
                      <>
                        <Row>
                          <Col xs={12} md={5} className="d-flex align-items-center">
                            <strong>Title: </strong>
                            <a href={`${ROUTES.CREATE_PROGRAM}/${program.id}`}>
                              {program.title}
                            </a>
                          </Col>
                          <Col xs={12} md={5} className="d-flex align-items-center">
                            <strong>Date: </strong> {dateString}
                          </Col>
                          <Col xs={12} className="d-block d-md-none"><hr /></Col>
                          <Col xs={12} md={2} className="d-flex justify-content-end" >
                            <Button variant="outline-danger"
                              type="button"
                              onClick={() => this.setRemoveKey(program.id)}
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      </>
                    </ListGroup.Item>
                  )
                }
                )
              }
              {loading && <ListGroup.Item>Loading ...</ListGroup.Item>}
              {programIdsFiltered.length === 0 && <ListGroup.Item>No Programs ...</ListGroup.Item>}
            </ListGroup>
          </div>
        </div>
      </>
    );
  }
}

const UserItem = withFirebase(UserItemBase);

export default UserItem;
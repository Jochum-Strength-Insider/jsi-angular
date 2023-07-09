import React, { Component } from "react";

import { withFirebase } from '../Firebase';
import Modal from '../Modal';

import * as ROUTES from '../../constants/routes';

import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


class folderFoldersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      folderTitle: "New folder",
      folders: [],
      show: false,
      showRemove: false,
      removeKey: 0,
      error: null,
      ...props.location.state,
    };
  }

  handleCreateFolder = (e) => {
    e.preventDefault();
    const timestamp = this.props.firebase.serverValue.TIMESTAMP;

    const folderData = {
      title: this.state.folderTitle, createdAt: timestamp, parentFolderId: null 
    }

    this.props.firebase.folders().push(folderData)
      .then((snap) => {
        this.handleClose();
      })
      .catch(error => this.setState({ error }));
  }

  onRemovefolder = () => {
    const fid = this.state.removeKey;

    this.props.firebase
      .folder(fid)
      .remove()
      .then(() => {
        this.props.firebase
          .programIds()
          .orderByChild("parentFolderId")
          .equalTo(fid)
          .once('value', snapshot => {
            const programIdsObject = snapshot.val();
            if (programIdsObject) {
              Object.keys(programIdsObject).forEach(
                (pid) => {
                  this.props.firebase
                    .programId(pid).update({ parentFolderId : null });
                  this.props.firebase
                    .program(pid).update({ parentFolderId : null });
                }
              )
            }
          });
        });
        
    this.handleRemoveClose();
  };

  handleTitleChange = (e) => {
    const { value } = e.target;
    this.setState({ folderTitle: value })
  }

  handleClose = () => {
    this.setState({ show: false })
  }

  handleOpen = () => {
    this.setState({ show: true })
  }

  handleRemoveClose = () => {
    this.setState({ removeKey: null, showRemove: false })
  }

  setRemoveKey = (key) => {
    this.setState({ showRemove: true, removeKey: key })
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase
      .folders()
      .orderByChild('title')
      .on('value', snapshot => {
        const foldersObject = snapshot.val();
        if (foldersObject) {
            const idsList = Object.keys(foldersObject);
            const idsArray = idsList.map(key => ({
              id: key,
              ...foldersObject[key],
            }));
          this.setState({
            folders: idsArray,
            loading: false,
          });
        } else {
          this.setState({
            folders: [],
            loading: false,
          });
        }
      });
  }

  componentWillUnmount() {
    this.props.firebase.folders().off();
  }

  render() {
    const { loading, folders, error } = this.state;

    return (
      <>
        <Modal handleClose={this.handleClose} show={this.state.show} heading={"Create New folder"}>

          <Form onSubmit={this.handleCreateFolder}>
            <Form.Group>
              <Form.Label>Folder Title</Form.Label>
              <Form.Control
                type="text"
                name="folderTitle"
                value={this.state.folderTitle}
                onChange={this.handleTitleChange}
              />
            </Form.Group>
            <Button type="submit" >Add Folder</Button>
            {error && <Alert variant="warning">{error.message}</Alert>}
          </Form>
        </Modal>

        <Modal handleClose={this.handleRemoveClose} show={this.state.showRemove} heading={"Remove folder?"}>
          <Form className="d-flex justify-content-between align-items-center">
            <Button variant="outline-danger" onClick={this.onRemovefolder}>Remove</Button>
            <Button variant="primary" onClick={this.handleRemoveClose}>Cancel</Button>
          </Form>
        </Modal>

        <div className="d-flex justify-content-center mb-5">
          <div className="contain-width">
            <h3>Programs</h3>
            <ListGroup>
              <ListGroup.Item>
                <Button onClick={this.handleOpen} block>Add Folder</Button>
              </ListGroup.Item>
              <ListGroup.Item>
                  <>
                    <Row>
                      <Col xs={12}>
                        <div>
                          <strong>Folder: </strong>
                          <a href={`${ROUTES.PROGRAM_FOLDERS}/${ROUTES.PROGRAM_FOLDERS_DETAILS_ALL}`}>
                            All
                          </a>
                        </div>
                      </Col>
                    </Row>
                  </>
                </ListGroup.Item>
                <ListGroup.Item>
                  <>
                    <Row>
                      <Col xs={12}>
                        <div>
                          <strong>Folder: </strong>
                          <a href={`${ROUTES.PROGRAM_FOLDERS}/${ROUTES.PROGRAM_FOLDERS_DETAILS_UNCATEGORIZED}`}>
                            Uncategorized
                          </a>
                        </div>
                      </Col>
                    </Row>
                  </>
                </ListGroup.Item>

              {
                folders.map(folder => {
                  return (
                    <ListGroup.Item key={folder.id}>
                      <>
                        <Row>
                          <Col xs={12} className="d-flex align-items-center justify-content-between">
                            <div>
                              <strong>Folder: </strong>
                              <a href={`${ROUTES.PROGRAM_FOLDERS}/${folder.id}`}>
                                {folder.title}
                              </a>
                            </div>
                            <Button variant="outline-danger"
                              type="button"
                              onClick={() => this.setRemoveKey(folder.id)}
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
              {folders.length === 0 && <ListGroup.Item>No folders ...</ListGroup.Item>}
            </ListGroup>
          </div>
        </div>
      </>
    );
  }
}

const FoldersList = withFirebase(folderFoldersList);

export default FoldersList;
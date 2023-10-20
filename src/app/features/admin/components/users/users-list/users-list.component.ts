import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User, UserKeys, UserWithSelection } from '@app/@core/models/auth/user.model';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, OnChanges {
  @Output() userClicked = new EventEmitter<User>();
  @Output() addUserClicked = new EventEmitter();
  @Output() sendGroupMessagesClicked = new EventEmitter<User[]>();
  @Output() setGroupProgramsClicked = new EventEmitter<User[]>();

  @Input() users: UserWithSelection[] = [];
  @Input() currentUser: User | null = null;

  searchSub: Subscription;

  sortedUsers: UserWithSelection[] = [];
  selectedUsers: User[] = [];

  usersForm: FormGroup;
  current: boolean = false;
  
  loading: boolean = false;
  
  searchCtrl = new FormControl();
  search: string = ""; 
  asc: boolean = false;
  filter: boolean | null = true;
  currentSortProperty: UserKeys = 'programDate';

  show: boolean =  false;
  showMessage: boolean = false;

  ngOnInit(){
    this.filterUsers();
    this.searchSub = this.searchCtrl.valueChanges
      .subscribe((value) => {
        this.search = value.toLocaleLowerCase();
        this.filterUsers();
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    ifPropChanged(changes['users'], () => {
      this.filterUsers();
    });
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
  }

  addUser(){
    this.addUserClicked.emit();
    this.show = false;
  }

  setCurrentUser(user: User){
    this.userClicked.emit(user);
  }

  sendUserMessages() {
    this.sendGroupMessagesClicked.emit(this.selectedUsers);
    this.show = false;
  }

  setUserPrograms() {
    this.setGroupProgramsClicked.emit(this.selectedUsers);
    this.show = false;
  }

  showAllUsers() {
    this.sortedUsers = this.users;
    this.filter = null;
    this.search = "";
    this.searchCtrl.patchValue("", { emitEvent: false });
    this.show = false;
  }

  filterUsersByActive() {
    this.filter = !this.filter;
    this.filterUsers();
    this.show = false;
  }

  sortUsersBy(property: UserKeys) {
    this.currentSortProperty = property;
    this.asc = !this.asc;
    this.filterUsers();
    this.show = false;
  }

  selectionChanged(user: User) {
    const objWithIdIndex = this.selectedUsers.findIndex((u) => u.id === user.id);
    if (objWithIdIndex > -1) {
      this.selectedUsers.splice(objWithIdIndex, 1);
    } else {
      this.selectedUsers.push(user);
    }
  }

  clearSelection(){
    this.sortedUsers.forEach(each => each.checked = false);
    this.show = false;
  }

  private filterUsers() {
    let filteredUsers = this.users;

    if(this.filter !== null) {
      filteredUsers = this.getFilteredUsers(filteredUsers, this.filter);
    }
    filteredUsers = filteredUsers
      .filter(
        user => user.username.toLocaleLowerCase().includes(this.search) 
        || user.email.toLocaleLowerCase().includes(this.search)
      )

    this.sortedUsers = this.getSortedUsers(filteredUsers, this.asc, this.currentSortProperty);
  }

  private getFilteredUsers(array: UserWithSelection[], filter: boolean): UserWithSelection[] {
    return array.filter((user: UserWithSelection) => user.ACTIVE === filter);
  }

  private getSortedUsers(array: UserWithSelection[], asc: boolean, property: UserKeys) {
    let sortFunction = (a: UserWithSelection, b: UserWithSelection) => 0
    switch (property) {
      case 'username':
      case 'email':
        sortFunction = (a: UserWithSelection, b: UserWithSelection) => {
          const aValue = a[property].toLocaleLowerCase();
          const bValue = b[property].toLocaleLowerCase();
          return asc
            ? (aValue < bValue) ? 1 : (aValue > bValue) ? -1 : 0
            : (bValue < aValue) ? 1 : (bValue > aValue) ? -1 : 0
        }
        break;
      case 'createdAt':
      case 'createdAt':
      case 'programDate':
        sortFunction = (a: UserWithSelection, b: UserWithSelection) => {
          const aValue = a[property] || 0;
          const bValue = b[property] || 0;
          return asc ? (aValue - bValue) : (bValue - aValue)
        }       
        break;    
      default:
        sortFunction = (a: UserWithSelection, b: UserWithSelection) => 0
        break;
    }
    return array.sort(sortFunction);
  }
}
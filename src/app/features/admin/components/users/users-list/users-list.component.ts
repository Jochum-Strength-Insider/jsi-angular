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
  @Input() currentUserId: string | null;

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
        this.search = value;
        this.filterUsers();
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    ifPropChanged(changes['users'], () => {
      this.filterUsers();
    })
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
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

  private filterUsers() {
    let filteredUsers = this.users;
    if(this.filter !== null) {
      filteredUsers = this.getFilteredUsers(filteredUsers, this.filter);
    }
    filteredUsers = filteredUsers.filter(user => user.username.includes(this.search) || user.email.includes(this.search))
    let sortedUsers = this.getSortUsers(filteredUsers, this.asc, this.currentSortProperty);
    this.sortedUsers = sortedUsers;
  }

  private getFilteredUsers(array: UserWithSelection[], filter: boolean): UserWithSelection[] {
    return array.filter((user: UserWithSelection) => user.ACTIVE === filter);
  }

  private getSortUsers(array: UserWithSelection[], asc: boolean, property: UserKeys): UserWithSelection[] {
    const fx = (a: UserWithSelection, b: UserWithSelection) => asc ? (a[property] > b[property] ? 1 : -1) : (a[property] < b[property] ? 1 : -1);
    return array.sort(fx);
  }

  sendUserMessages() {
    this.sendGroupMessagesClicked.emit(this.selectedUsers);
    this.show = false;
  }

  setUserPrograms() {
    this.setGroupProgramsClicked.emit(this.selectedUsers);
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

  addUser(){
    this.addUserClicked.emit();
    this.show = false;
  }

  setCurrentUser(user: User){
    this.userClicked.emit(user);
  }

  clearSelection(){
    this.sortedUsers.forEach(each => each.checked = false);
    this.show = false;
  }
}
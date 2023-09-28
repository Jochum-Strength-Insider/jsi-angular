import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { User } from '@app/@core/models/auth/user.model';
import { Message } from '@app/@core/models/messages/message.model';
import { Folder } from '@app/@core/models/program/folder.model';
import { ProgramId } from '@app/@core/models/program/program-id.model';
import { ResizeService } from '@app/@core/services/resize.service';
import { ToastService } from '@app/@core/services/toast.service';
import { AuthService } from '@app/@shared/services/auth.service';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { UserAccountValidator } from '@app/@shared/validators/user-account.validator';
import { FOLDERS_STRING, PROGRAM_IDS_STRING, ProgramService } from '@app/features/admin/services/programs.service';
import { UserService } from '@app/features/admin/services/user.service';
import { MessageService } from '@app/features/messages/services/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, debounceTime, finalize, forkJoin, fromEvent, map, of, switchMap, take } from 'rxjs';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  @ViewChild('groupMessageModal') groupMessageModal: any;
  @ViewChild('groupProgramModal') groupProgramModal: any;
  @ViewChild('addUserModal') addUserModal: any;
  @ViewChild(MatDrawer) matDrawer: MatDrawer;

  users: User[] = [];
  folders: Folder[] = [];
  programIds: ProgramId[] = [];
  filteredProgramIds: ProgramId[] = [];
  selectedUsers: User[] = [];

  messageForm: FormGroup = this.fb.group({
    message: ["", Validators.required],
  });

  programForm = this.fb.group({
    programId: ["", Validators.required]
  });

  addUserForm: FormGroup;

  get f() { return this.addUserForm.controls; }

  mobile: boolean = false;

  paramsSub?: Subscription;
  usersListSub: Subscription;
  foldersSub: Subscription;
  programIdsSub: Subscription;
  windowSub: Subscription;
  authUserSub: Subscription;

  currentUser: User | null;
  authUser: User;
  userIdFromParams: string | null;

  error: Error;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private fb: FormBuilder,
    private lsService: LocalStorageService,
    private messagesService: MessageService,
    private modalService: NgbModal,
    private programsService: ProgramService,
    private userService: UserService,
    private authService: AuthService,
    private toastService: ToastService,
    private resizeService: ResizeService
  ) { }

  ngOnInit(){
    console.log('admin panel oninit')
    this.getUserFromRoute();
    this.fetchUsers(); 
    this.fetchFolders();
    this.fetchProgramsIds();

    this.windowSub = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => {
        this.mobile = window.innerWidth < 768;
      });

    this.authUserSub = this.auth.currentUser$
      .subscribe((user) => {
        if(user){
          this.authUser = user
        }
      });

    this.createAddUserForm();
  }
  
  ngOnDestroy(): void {
    this.paramsSub?.unsubscribe();
    this.foldersSub?.unsubscribe();
    this.usersListSub?.unsubscribe();
    this.programIdsSub?.unsubscribe();
    this.windowSub?.unsubscribe();
    this.authUserSub?.unsubscribe();
    this.userService.setSelectedUser(null);
  }

  createAddUserForm(){
    this.addUserForm = this.fb.group({
      email: ["", [Validators.required, Validators.email],[UserAccountValidator.createValidator(this.auth)]],
      username: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(7)]],
      message: ""
    });
  }

  resetCreateAddUserForm(){
    this.addUserForm.patchValue({
      email: "",
      username: "",
      password: "InsiderSignup!",
      message: ""
    });
  }

  getUserFromRoute() {
    this.paramsSub = this.route.firstChild?.paramMap
    .subscribe(params => {
      const id = params.get('uid');
      this.userIdFromParams = id;
    });
  }

  fetchUsers() {
    console.log('fetchUsers');
      this.usersListSub = this.userService.getUsers()
      .pipe(take(1))
      .subscribe({  
        next: (users: User[]) => {
          console.log('getUsers', users);
          this.users = users;
          const currentUser = this.users.find(x => x.id === this.userIdFromParams) || null;
          // this.setUser(currentUser);
        },
        error: (err) => {
          console.log(err)
          this.error = err;
          this.toastService.showError();
        }
      })
  }

  fetchFolders() {
    const cashedFolders: Folder[] = this.lsService.getParseData(FOLDERS_STRING);
    this.foldersSub = of(cashedFolders)
      .pipe(switchMap((folders) => {
        if(folders){
          return of(folders);
        } else {
          return this.programsService.getFolders();
        }
      }))
      .subscribe({
        next: (folders) => {
          this.folders = folders;
        },
        error: (err) => {
          console.log(err)
          this.error = err;
          this.toastService.showError();
        }
      })
  }

  fetchProgramsIds() {
    const cashedProgramIds: ProgramId[] = this.lsService.getParseData(PROGRAM_IDS_STRING);
    this.programIdsSub = of(cashedProgramIds)
      .pipe(switchMap((programs) => {
        if(programs){
          return of(programs);
        } else {
          return this.programsService.getProgramIds();
        }
      }))
      .subscribe({
        next: (programs) => {
          this.programIds = programs;
          this.filteredProgramIds = programs;
        },
        error: (err) => {
          console.log(err)
          this.error = err;
          this.toastService.showError();
        }
      })
  }

  handleUserClicked(user: User){
    this.setUser(user);
    if(this.mobile){
      this.matDrawer.close();
    }
  }

  setUser(user: User | null){
    console.log('admin-panel set user', user)
    this.currentUser = user;
    this.userService.setSelectedUser(user);
  }

  handleOpenModal(content: any){
    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: true,
    });
  }

  handleSendGroupMessagesClicked(users: User[]){
    this.selectedUsers = users;
    this.handleOpenModal(this.groupMessageModal);
  }

  sendGroupMessages() {
    if(!this.authUser) { return };

    const message = this.messageForm.controls['message'].value || "";
    const messagesObservables: Observable<string | null>[] = this.selectedUsers.map(
      (user: User) => {
        const newMessage = new Message(message, this.authUser.id, this.authUser.username)
        return this.messagesService.addUserMessage(user.id, newMessage);
      }
    );

    forkJoin(messagesObservables)
    .subscribe({
      next: () => this.toastService.showSuccess("Messages Sent"),
      error: (err) => {
        this.error = err;
        console.log(err)
      }
    })
  }

  handleSetGroupProgramsClicked(users: User[]) {
    this.selectedUsers = users;
    this.handleOpenModal(this.groupProgramModal);
  }

  setGroupPrograms() {
    if(!this.authUser) { return };

    const programId = this.programForm.controls['programId'].value || "";
    const groupsObservables: Observable<string | null>[] = this.selectedUsers.map(
      (user: User) => {
        return this.programsService.copyProgramToUserWorkouts(user.id, programId);
      }
    );

    forkJoin(groupsObservables) 
    .subscribe({
      next: () => this.toastService.showSuccess("Groups Programs Set"),
      error: (err) => {
        this.error = err;
        console.log(err)
      }
    })
  }

  handleAddUserClicked(){
    this.resetCreateAddUserForm();
    this.handleOpenModal(this.addUserModal);
  }

  addUser(){
    const { username, email, password, message } = this.addUserForm.value;
    this.authService.adminRegisterNewUser({ email, password })
    .pipe(
      switchMap((credential) => {
        const { user } = credential;
        return forkJoin([
          this.authService.sendEmailVerification(user),
          this.userService.addNewUser(user.uid, email, username)
        ]).pipe(map(() => user.uid))
      }),
      switchMap((uid) => {
        const WELCOME_MESSAGE = new Message("Welcome Message", "welcome_message_id", message.length > 0 ? message : "Welcome");
        return this.messagesService.addUserMessage(uid, WELCOME_MESSAGE)
          .pipe(switchMap((key) => {
            if(key){
              return this.messagesService.addUserUnreadMessage(uid, key, WELCOME_MESSAGE)
            } else {
              return of("")
            }
          }))
      }),
      finalize(() => {
        this.modalService.dismissAll();
        this.fetchUsers();
      })
    )
    .subscribe({
      next: (result) => {
        console.log('user created', result);
        this.toastService.showSuccess("New User Added");
      },
      error: (err) => {
        console.log(err)
        this.toastService.showError("Add Error Occured Adding New User")
      }
    })
  }

  folderSelected(target: EventTarget | null){
    const value = (target as HTMLSelectElement)?.value;
    if(value === 'all'){
      this.filteredProgramIds = this.programIds;
      const id = this.filteredProgramIds.length > 0 ? this.filteredProgramIds[0].id : '';
      this.programForm.controls['programId'].patchValue(id);
      return;
    }
    if(value === 'uncategorized'){
      this.filteredProgramIds = this.programIds.filter( x => x.parentFolderId === undefined);
      const id = this.filteredProgramIds.length > 0 ? this.filteredProgramIds[0].id : '';
      this.programForm.controls['programId'].patchValue(id);
      return;
    }
    this.filteredProgramIds = this.programIds.filter( x => x.parentFolderId === value);
    const id = this.filteredProgramIds.length > 0 ? this.filteredProgramIds[0].id : '';
    this.programForm.controls['programId'].patchValue(id);
  }


  // sideNavSub: Subscription;

  // ngAfterViewInit() {
  //   this.sideNavSub = this.sidenavContainer.scrollable.elementScrolled().subscribe(() => /* react to scrolling */);
  // }

  drawerOpenChanged(opened: boolean){
    this.resizeService.setAdminPanelOpen(opened);
  }
}

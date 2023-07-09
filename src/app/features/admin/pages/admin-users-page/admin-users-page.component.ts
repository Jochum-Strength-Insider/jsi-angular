import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/@core/models/auth/user.model';
import { AuthService } from '@app/@shared/services/auth.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-admin-users-page',
  templateUrl: './admin-users-page.component.html',
  styleUrls: ['./admin-users-page.component.css']
})
export class AdminUsersPageComponent {
  authUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
    ){
    this.authUser$ = this.authService.currentUser$.pipe(
      tap((user) => { if(user && !user.ADMIN){ this.router.navigateByUrl('/signin') } })
    );
  }
}


// import React, { useEffect, useState } from 'react';
// import { compose } from 'recompose';
// import { Switch, Route } from 'react-router-dom';

// // import ChatToasts from '../ChatToasts';

// import * as ROUTES from '../../constants/routes';

// import AdminPanel from '../AdminPanel'

// import { withAuthorization, withEmailVerification } from '../Session';
// import { withFirebase } from '../Firebase';

// const AdminPage = ({ firebase }) => {
//   const usersInit = JSON.parse(localStorage.getItem('users')) || [];
//   const [usersList, setUsersList] = useState(usersInit);
//   // const [unread, setUnread] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     firebase.users().on('value', snapshot => {
//       const usersObject = snapshot.val();
//       if (usersObject) {
//         const usersList = Object.keys(usersObject).map(key => ({
//           ...usersObject[key],
//           uid: key,
//         }));

//         localStorage.setItem('users', JSON.stringify(usersList));
//         setUsersList(usersList);
//         setLoading(false);
//       } else {
//         localStorage.removeItem('users');
//         setLoading(false);
//       }
//     });

//     return () => {
//       firebase.users().off();
//     };
//   }, [firebase]);

//   return (
//     <>
//       <Switch>
//         <Route path={ROUTES.ADMIN_DETAILS} children={<AdminPanel usersList={usersList} loading={loading} />} />
//         <Route exact path={ROUTES.ADMIN} children={<AdminPanel usersList={usersList} loading={loading} />} />
//       </Switch>
//     </>
//   )
// };

// const condition = authUser => authUser && authUser.ADMIN;

// export default compose(
//   withEmailVerification,
//   withFirebase,
//   withAuthorization(condition),
// )(AdminPage);

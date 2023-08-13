import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { User as UserModel } from '@app/@core/models/auth/user.model';
import { mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';
import { LocalStorageService } from '@app/@shared/services/local-storage.service';
import { BehaviorSubject, Observable, defer, map, tap } from 'rxjs';

export const USERS_STRING = 'users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<UserModel | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private db: AngularFireDatabase,
    private lsService: LocalStorageService
  ) {}

  public setCurrentUser(user: UserModel | null){
    this.currentUserSubject.next(user);
  }

  private usersListRef(): AngularFireList<UserModel>{
    return this.db.list(USERS_STRING);
  }

  private usersObjectRef(uid: string): AngularFireObject<UserModel>{
    return this.db.object(`${USERS_STRING}/${uid}`);
  }

  getUserById(userId: string):Observable<UserModel> {
    return this.usersObjectRef(userId)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  getUsers(): Observable<UserModel[]> {
    return this.usersListRef()
      .valueChanges([], { idField: 'id'})
      .pipe(
        tap((users) => this.lsService.saveStringifyData(USERS_STRING, users)),
        map(users => users)
      );
  }

  getActiveUsers(): Observable<UserModel[]> {
      const usersListRef = this.db.list(USERS_STRING, ref => ref.orderByChild("ACTIVE").equalTo(true) );
      return <Observable<UserModel[]>>usersListRef
        .valueChanges([], { idField: 'id'});
  }

  isUserActive(userId: string): Observable<boolean> {
    return <Observable<boolean>>this.db.object(`${USERS_STRING}/${userId}/ACTIVE`)
      .valueChanges()
  }

  setUserIsActive(uid: string, active: boolean): Observable<void> {
    const userRef = this.usersObjectRef(uid)
    return defer( () => userRef.update({ "ACTIVE": active }))
      .pipe( tap(() => this.lsService.removeData(USERS_STRING)) );
  }

// const UploadBefore = ({ firebase, uid }) => {
//    const [file, setFile] = useState(null);
//    const [img, setImage] = useState(null);
//    const [error, setError] = useState(null);

//    const loadImage = useCallback(() => {
//       // console.log("loadImage");
//       firebase.userBefore(uid).getDownloadURL().then(function (url) {
//          if (url) {
//             setImage(url);
//             localStorage.setItem("beforeUrl", url);
//          } else {
//             setImage(null);
//             localStorage.removeItem("beforeUrl");
//          }
//       }).catch(error => {
//          if (error.code === "storage/object-not-found") {
//             console.log("not found");
//          } else {
//             setError(error)
//          }
//       });
//    }, [firebase, uid])

//    useEffect(() => {

//       const url = localStorage.getItem("beforeUrl") || null;

//       if (url) {
//          setImage(url);
//       } else {
//          loadImage();
//       }

//       // console.log("mount");
//       // return () => console.log("unmount");
//    }, [loadImage]);

//    const onSubmit = (e) => {
//       e.preventDefault();
//       if (file && file.size < 3000000) {
//          const metadata = {
//             contentType: file.type,
//          };
//          // console.log(e, file);
//          firebase.userBefore(uid).put(file, metadata)
//             .then((snapshot) => {
//                // console.log("upload", snapshot);

//                const toBase64 = async file => new Promise((resolve, reject) => {
//                   const reader = new FileReader();
//                   reader.readAsDataURL(file);
//                   reader.onload = () => resolve(reader.result);
//                   reader.onerror = error => reject(error);
//                });
//                const Main = async () => {
//                   const base64 = await toBase64(file);
//                   setFile(null);
//                   setImage(base64);
//                   localStorage.setItem("beforeUrl", base64);
//                };
//                Main();
//             })
//             .catch(error => setError(error));
//       }
//    }

//    const removeImage = () => {
//       firebase.userBefore(uid).delete().then(function () {
//          // File deleted successfully
//          setFile(null);
//          setImage(null);
//          localStorage.removeItem("beforeUrl");
//       })
//          .catch(error => setError(error));
//    }

//    const onFileChange = (e) => {
//       const file = e.target.files[0];
//       if (file) {
//          setFile(file);
//       }
//    }

//    return (
//       <>
//          <ImageUpload
//             onSubmit={onSubmit}
//             onFileChange={onFileChange}
//             onRemove={removeImage}
//             img={img}
//             error={error}
//             file={file}
//             title={"Before"}
//          />
//       </>
//    )
}

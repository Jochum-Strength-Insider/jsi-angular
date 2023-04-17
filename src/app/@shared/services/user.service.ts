import { Injectable } from '@angular/core';

import { BehaviorSubject, from, map, Observable, of, tap } from 'rxjs';
import { User as UserModel } from '@app/@core/models/auth/user.model';
import { AngularFireDatabase, AngularFireList, AngularFireObject, snapshotChanges } from '@angular/fire/compat/database';
import { mapKeysToObjectArrayOperator, mapKeyToObjectOperator } from '@app/@core/utilities/mappings.utilities';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // dbPath = '/user';
  // userRef: AngularFireObject<UserModel> | null = null;
  // usersRef: AngularFireList<UserModel> | null = null;
  
  userSub = new BehaviorSubject<UserModel | null>(null);
  user$ = this.userSub.asObservable();

  constructor(
    private db: AngularFireDatabase,
  ) {
    // this.userRef = db.object(this.dbPath);
    // this.usersRef = db.list(this.dbPath);
    // db.list('/items', ref => ref.orderByChild('size').equalTo('large'))
  }

  usersRef(): AngularFireList<UserModel>{
    return this.db.list('users');
  }

  userRef(userId: string): AngularFireObject<UserModel>{
    return this.db.object(`users/${userId}`);
  }

  getUserById(userId: string):Observable<UserModel> {
    return <Observable<UserModel>>this.userRef(userId)
      .snapshotChanges()
      .pipe( mapKeyToObjectOperator() );
  }

  getUsers(): Observable<UserModel[]> {
    return <Observable<UserModel[]>>this.usersRef()
      .snapshotChanges()
      .pipe( mapKeysToObjectArrayOperator() )
  }

  getActiveUsers(): Observable<UserModel[]> {
      const usersListRef = this.db.list('users', ref => ref.orderByChild("ACTIVE").equalTo(true) );
      return <Observable<UserModel[]>>usersListRef
        .snapshotChanges()
        .pipe( mapKeysToObjectArrayOperator() )
  }

  // active = (uid) => this.db.ref(`users/${uid}`).child("ACTIVE");
  isUserActive(userId: string): Observable<boolean> {
    return <Observable<boolean>>this.db.object(`users/${userId}/ACTIVE`).valueChanges()
  }

  // activate = (uid) => this.db.ref(`users/${uid}`).update({ ACTIVE: true });
  activateUser(userId: string): Observable<void> {
    const userRef = this.db.object(`users/${userId}`)
    return from(userRef.update({ "ACTIVE": true }));
  }

  // deactivate = (uid) => this.db.ref(`users/${uid}`).update({ ACTIVE: false });
  deActivateUser(userId: string): Observable<void> {
    const userRef = this.db.object(`users/${userId}`)
    return from(userRef.update({ "ACTIVE": false }));
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

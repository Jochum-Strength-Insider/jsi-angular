import { Component, Input } from '@angular/core';
import { Message } from '@app/@core/models/messages/message.model';

@Component({
  selector: 'app-message-icon',
  templateUrl: './message-icon.component.html',
  styleUrls: ['./message-icon.component.css']
})
export class MessageIconComponent {
  unread: Message[] = [];
  @Input() uid: string;

  // const MessageIconBase = ({ firebase, uid }) => {
  //   const [unread, setUnread] = useState([]);
  //   useEffect(() => {
  //     const unreadQuery = firebase.user(uid).child("unread");
  //     unreadQuery.on('value', snapshot => {
  //       const unreadObject = snapshot.val();
  //       if (unreadObject) {
  //         const unreadList = Object.keys(unreadObject).reverse().map(key => ({
  //           ...unreadObject[key],
  //           mid: key,
  //         }));
  
  //         // console.log("unreadList", unreadList);
  //         setUnread(unreadList);
  //       } else {
  //         setUnread([])
  //       }
  //     });
  //     return () => {
  //       unreadQuery.off();
  //     };
  //   }, [firebase, uid]);

}

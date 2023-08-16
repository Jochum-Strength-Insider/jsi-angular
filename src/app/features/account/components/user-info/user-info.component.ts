import { Component, Input } from '@angular/core';
import { User } from '@app/@core/models/auth/user.model';
import { WorkoutId } from '@app/@core/models/program/workout-id.model';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent {
  @Input() user: User;
  @Input() workoutIds: WorkoutId[] | null = [];
}

import {
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
} from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, first, map, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export class UserAccountValidator {
    static createValidator(service: AuthService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return control.valueChanges
                .pipe(
                    debounceTime(400),
                    distinctUntilChanged(),
                    switchMap(value => service.getSignInMethodsFormEmail(value)),
                    map((result: string[]) => result.length > 0 ? { userAccountAlreadyExists: true } : null),
                    first()
                );
        }
    }
}
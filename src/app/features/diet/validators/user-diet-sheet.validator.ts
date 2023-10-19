import {
    AbstractControl,
    AsyncValidatorFn,
    ValidationErrors,
} from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, first, map, switchMap, tap } from 'rxjs';
import { DietService } from '../services/diet.service';
import { DietId } from '@app/@core/models/diet/diet-id.model';

export class UserDietSheetValidator {
    static createValidator(uid: string, service: DietService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return control.valueChanges
                .pipe(
                    debounceTime(400),
                    distinctUntilChanged(),
                    switchMap(value => service.getUserDietIdByDate(uid, value)),
                    map((result: DietId | null) => result !== null ? { userDietSheetAlreadyExists: true } : null),
                    first()
                );
        }
    }
}
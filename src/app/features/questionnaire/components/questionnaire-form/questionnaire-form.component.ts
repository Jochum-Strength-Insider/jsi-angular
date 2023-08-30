import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/@core/models/auth/user.model';
import { Questionnaire } from '@app/@core/models/questionnaire/questionnaire.model';
import { ifPropChanged } from '@app/@core/utilities/property-changed.utilities';

@Component({
  selector: 'app-questionnaire-form',
  templateUrl: './questionnaire-form.component.html',
  styleUrls: ['./questionnaire-form.component.css']
})
export class QuestionnaireFormComponent implements OnInit, OnChanges {
  @Input() adminUser: User | null = null;
  @Input() questionnaire: Questionnaire | null;
  @Output() formSubmitted = new EventEmitter<Questionnaire>();
  questionnaireForm: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder){ }

  get f() { return this.questionnaireForm.controls }

  ngOnInit(){
    const disabled = this.adminUser !== null;
    this.questionnaireForm = this.fb.group({
      experience: [{value: "", disabled }, Validators.required],
      injuries: [{value: "", disabled }, Validators.required],
      painfulMovement: [{value: "", disabled }, Validators.required],
      enjoyedMovement: [{value: "", disabled }, Validators.required],
      ultimateGoal: [{value: "", disabled }, Validators.required],
      daysPerWeek: [{value: "", disabled }, Validators.required],
      equipment: [{value: "", disabled }, Validators.required],
      comments: [{value: "", disabled }],
      referral: [{value: "", disabled }, Validators.required],
    });

    this.patchQuestionnaire(this.questionnaire);
  }

  ngOnChanges(changes: SimpleChanges): void {
    ifPropChanged(changes['questionnaire'], (questionnaire) => {
      this.patchQuestionnaire(questionnaire)
    })
  }

  patchQuestionnaire(questionnaire: Questionnaire | null){
    this.questionnaireForm.patchValue({
      experience: questionnaire ? questionnaire.experience : "",
      injuries: questionnaire ? questionnaire.injuries : "",
      painfulMovement: questionnaire ? questionnaire.painfulMovement : "",
      enjoyedMovement: questionnaire ? questionnaire.enjoyedMovement : "",
      ultimateGoal: questionnaire ? questionnaire.ultimateGoal : "",
      daysPerWeek: questionnaire ? questionnaire.daysPerWeek : "",
      equipment: questionnaire ? questionnaire.equipment : "",
      comments: questionnaire ? questionnaire.comments : "",
      referral: questionnaire ? questionnaire.referral : ""
    })
  }

  submit(){
    if(this.adminUser !== null){ return; }

    if(this.questionnaireForm.invalid){
      this.submitted = true;
    } else {
      this.formSubmitted.emit(this.questionnaireForm.getRawValue() as Questionnaire);
    }
  }
}

import { untilDestroyed } from 'ngx-take-until-destroy';
import { FlowFacade } from './../../../store/flow/facade/flow.facade';
import { DefaultFormComponent } from '../../shared/default-form/default-form.component';
import { IFlowState } from '../../../store/flow/reducers/flow.reducers';
import * as FlowActions from '../../../store/flow/actions/flow.actions';
import { Store } from '@ngrx/store';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FlowVM } from '../../../models/flow';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-flow',
  templateUrl: './add-flow.component.html',
  styleUrls: ['./add-flow.component.scss']
})
export class AddFlowComponent extends DefaultFormComponent implements OnInit, OnDestroy {

  flowSubscription: Subscription;
  flowState: IFlowState;

  constructor(private store: Store<IFlowState>, private flowFacade: FlowFacade, private dialogRef: MatDialogRef<AddFlowComponent>) {
    super();
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      // 'viewType': new FormControl(null)
    });

    this.flowSubscription = this.flowFacade.flowState$.pipe(untilDestroyed(this)).subscribe((flowState: IFlowState) => {
      this.flowState = flowState;
    });

  }

  onSubmit(form: NgForm) {
    const flowModel: FlowVM = {
      ...this.flowState.selectedFlow,
      title: form.value.title,
    };
    this.store.dispatch(new FlowActions.SaveFlow(flowModel));
    this.dialogRef.close();
  }

  setFormValues() {
    this.formGroup.setValue({
      'title': this.flowState.selectedFlow.title,
      // 'flow_viewType': this.flowState.selectedFlow.flowViewType
    });
  }

  onResetAndClose() {
    this.dialogRef.close();
    this.formGroup.setValue({
      'title': '',
    });
  }

  ngOnDestroy() {
    this.flowSubscription.unsubscribe();
  }

}

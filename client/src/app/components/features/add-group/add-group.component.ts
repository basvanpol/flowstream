import { IconTypes, defaultSvgClass } from './../../../models/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupVM } from '../../../models/group';
import { GroupState } from '../../../store/group/reducers/group.reducer';
import { Subscription } from 'rxjs';
import * as GroupActions from '../../../store/group/actions/group.actions';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { DefaultFormComponent } from '../../shared/default-form/default-form.component';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { getGroupState } from '../../../store/group/selectors/group-selectors';
import { IAppState } from '../../../store/flow/selectors/flow.selectors';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent extends DefaultFormComponent implements OnInit, OnDestroy {

  groupSubscription: Subscription;
  groupState: GroupState;
  saveGroupSuccess: boolean;
  isNewGroup: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<IAppState>,
    private matDialogRef: MatDialogRef<AddGroupComponent>) {
    super();
  }

  ngOnInit() {

    this.store.pipe(untilDestroyed(this), select(getGroupState)).subscribe((state: GroupState) => {
      this.groupState = state;
      this.saveGroupSuccess = this.groupState.saveGroupSuccess;
      if (this.saveGroupSuccess) {
        this.matDialogRef.close();
      }

      this.isNewGroup = this.data.isNewItem;
      if (!this.isNewGroup) {
        this.setFormValues();
      }
    });

    this.formGroup = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'icon': new FormControl(null),
    });
  }

  onSubmit(form: NgForm) {
    let groupModel: GroupVM;

    if (!this.isNewGroup) {
      groupModel = {
        ...this.groupState.selectedAdminGroup,
        title: form.value.title
      };
    } else {
      groupModel = {
        _id: null,
        _user: null,
        title: form.value.title,
        icon: {
          type: IconTypes.SVG_CLASS,
          value: (form.value.icon) ? form.value.icon : defaultSvgClass
        }
      };
    }

    this.store.dispatch(new GroupActions.SaveGroup(groupModel));
  }

  onResetAndClose() {
    this.formGroup.patchValue({
      'title': ''
    });
    this.closeModal();
  }

  closeModal() {
    this.matDialogRef.close();
  };

  setFormValues() {
    this.formGroup.patchValue({
      'title': this.groupState.selectedAdminGroup.title
    });
  }

  ngOnDestroy() { }

}

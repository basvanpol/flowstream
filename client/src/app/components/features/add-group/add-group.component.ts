import { IconTypes, defaultSvgClass } from './../../../models/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupVM } from '../../../models/group';
import { IGroupState } from '../../../store/group/reducers/group.reducer';
import { Subscription } from 'rxjs';
import * as GroupActions from '../../../store/group/actions/group.actions';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { DefaultFormComponent } from '../../shared/default-form/default-form.component';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent extends DefaultFormComponent implements OnInit, OnDestroy {

  groupSubscription: Subscription;
  groupState: IGroupState;
  saveGroupSuccess: boolean;
  isNewGroup: boolean;
  public selectedIconClass: string;
  public selectedPage = "form";
  public selectedIconId: number | string;
  public icons: string[] = [
    "icon-java",
    "icon-lollypop",
    "icon-mobile",
    "icon-game",
    "icon-shirt",
    "icon-camera2",
    "icon-ball",
    "icon-outdoors",
    "icon-house",
    "icon-plant",
    "icon-pencil",
    "icon-art",
    "icon-entertainment",
    "icon-news",
    "icon-frontpage",
    "icon-science",
    "icon-body",
    "icon-mobility",
    "icon-closet",
    "icon-film",
    "icon-bookmark",
    "icon-tech"
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      isNewItem: boolean,
      selectedGroup: GroupVM
    },
    private store: Store<IGroupState>,
    private matDialogRef: MatDialogRef<AddGroupComponent>) {
    super();
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'title': new FormControl(null, [Validators.required])
    });
    console.log('this.data', this.data);
    this.isNewGroup = this.data.isNewItem;
    if (!this.isNewGroup) {
      this.setFormValues();
      this.selectedIconId = this.data.selectedGroup.icon.value;
    }

    this.groupSubscription = this.store.select('group').subscribe((state: IGroupState) => {
      this.groupState = state;
      this.saveGroupSuccess = this.groupState.saveGroupSuccess;
      if (this.saveGroupSuccess) {
        this.matDialogRef.close();
      }
    });
  }

  public onSubmit(form: NgForm) {
    console.log('form', form);
    let groupModel: GroupVM;

    if (!this.isNewGroup) {
      groupModel = {
        ...this.data.selectedGroup,
        title: form.value.title,
        icon: {
          type: IconTypes.SVG_CLASS,
          value: (this.selectedIconId) ? this.selectedIconId : defaultSvgClass
        }
      };
    } else {
      groupModel = {
        _id: null,
        _user: null,
        title: form.value.title,
        icon: {
          type: IconTypes.SVG_CLASS,
          value: (this.selectedIconId) ? this.selectedIconId : defaultSvgClass
        }
      };
    }

    console.log('groupModel', groupModel);
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
  }

  setFormValues() {
    this.formGroup.patchValue({
      'title': this.data.selectedGroup.title
    });
  }

  public goTo(page: string) {
    this.selectedPage = page;
  }

  public onSelectItem(itemId: number | string) {
    this.selectedIconId = itemId;
  }

  ngOnDestroy() {
    this.groupSubscription.unsubscribe();
  }

}

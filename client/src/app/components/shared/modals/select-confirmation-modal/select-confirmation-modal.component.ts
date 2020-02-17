import { FeedSubscription } from '../../../../models/feed';
import * as FeedActions from '../../../../store/feed/actions/feed.actions';
import { Action, Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-select-confirmation-modal',
  templateUrl: './select-confirmation-modal.component.html',
  styleUrls: ['./select-confirmation-modal.component.scss']
})
export class SelectConfirmationModalComponent implements OnInit {

  listData: any;
  popupTitle = "Select Feeds";
  selectedItems: {
    _id: string,
    title: string
  }[];
  selectedIdsOnLoaded: number[];
  actionType: string;
  requestObject: any | FeedSubscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any | FeedSubscription,
    private store: Store<any>,
    private dialogRef: MatDialogRef<SelectConfirmationModalComponent>) {
      this.listData = data.selectionList;
      this.actionType = data.actionType;
      this.requestObject = {
        ...data.requestObject
      };
      this.selectedIdsOnLoaded = data.selectedIdsOnLoaded;
  }

  ngOnInit() {
  }

  onSelectedList(items: any) {
    this.selectedItems = items;
    console.log('this slectd items', this.selectedItems);
  }

  onConfirm() {
    if (this.data.callback) {
      console.log('this.selectedItems', this.selectedItems);
      if (this.selectedItems) {
        this.data.callback(this.selectedItems);
      }
      this.closeModal();
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

}

import { GroupVM } from '../../../models/group';
import { AddGroupComponent } from '../../features/add-group/add-group.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss']
})
export class GroupsListComponent {

  @Input() listItems: any[];
  @Input() selectedId: number;
  @Output() selectItem = new EventEmitter();
  @Output() deleteItem = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  openAddGroupDialog() {
    const dialogRef = this.dialog.open(AddGroupComponent, {
      width: '400px',
      maxHeight: '400px',
      data: {
        isNewItem: true
      }
    });
  }

  onSelect(item: any) {
    this.selectItem.emit({
      item
    });
  }

  deleteTag(groupId){
    this.deleteItem.emit({
      groupId
    })
  }

}

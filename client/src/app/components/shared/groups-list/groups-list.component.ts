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

  @Input() set listItems(values: GroupVM[]) {
    this.groups = values;
    this.canUserEditSome = this.groups.some((group, index, array) => group.canUserEdit === true);
  }
  @Input() selectedId: string;
  @Output() selectItem = new EventEmitter();
  @Output() deleteItem = new EventEmitter();
  public groups: GroupVM[];
  public canUserEditSome = false;

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

  deleteCategory(groupId){
    this.deleteItem.emit({
      groupId
    })
  }

}

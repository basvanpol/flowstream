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
    console.log('new groups', values);
    this.groups = values;
  }
  @Input() selectedId: string;
  @Output() selectItem = new EventEmitter();
  @Output() deleteItem = new EventEmitter();
  public groups: GroupVM[];

  constructor(public dialog: MatDialog) { }

  openGroupDialog(selectedGroup: GroupVM = null, isNewItem: boolean = true) {
    const dialogRef = this.dialog.open(AddGroupComponent, {
      width: '400px',
      height: '400px',
      data: {
        isNewItem,
        selectedGroup
      }
    });
  }

  public createNewCategory() {
    this.openGroupDialog();
  }

  public editCategory(group: GroupVM) {
    if (!!group) {
      this.openGroupDialog(group, false);
    }
  }

  onSelect(item: any) {
    this.selectItem.emit({
      item
    });
  }

  deleteCategory(item: GroupVM) {
    this.deleteItem.emit({
      item
    });
  }

}

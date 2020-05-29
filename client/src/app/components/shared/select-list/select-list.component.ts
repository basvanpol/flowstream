import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'app-select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss']
})
export class SelectListComponent implements OnInit {

  @Input() listData: any;
  @Input() selectedIdsOnLoaded: any[];
  @Input() disabledIdsOnLoaded: any[];
  @Output() selectedItemsEmitter: EventEmitter<any[]> = new EventEmitter();
  selectedItems: {
    _id: string,
    title: string
  }[] = [];

  constructor() { }

  ngOnInit() {
    if (this.listData && this.selectedIdsOnLoaded) {
      // ('list Data', this.listData);
      this.selectedItems = this.listData.filter((listItem) => {
        return this.selectedIdsOnLoaded.includes(listItem._id);
      });
    }
  }

  onChange(event: MatCheckboxChange) {
    if (event.checked) {
      let item;
      if (this.selectedItems.length > 0) {
        item = this.selectedItems.find((selectedItem) => selectedItem._id === event.source.value);
      }
      if (!item) {
        this.selectedItems.push({
          _id: event.source.value,
          title: event.source.id
        });
      }
    } else {
      const index = this.selectedItems.findIndex((selectedItem) => selectedItem._id === event.source.value);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      }
    }


    this.selectedItemsEmitter.emit(this.selectedItems);
  }

}

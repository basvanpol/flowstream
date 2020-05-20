import { Directive, Input, ElementRef, OnChanges, SimpleChanges } from "@angular/core";

@Directive({
  selector: "[selectItem]"
})
export class SelectItemDirective implements OnChanges {
  @Input() selectedId: string | number;
  @Input() itemId: string | number;

  private isItemSelected: boolean;

  constructor(private el: ElementRef<HTMLElement>) { }

  ngOnChanges(changes: SimpleChanges) {
    this.isItemSelected = (changes.selectedId && changes.selectedId.currentValue === this.itemId);
    if (this.isItemSelected) {
      this.el.nativeElement.classList.add('selected');
    } else {
      this.el.nativeElement.classList.remove('selected');
    }
  }
}

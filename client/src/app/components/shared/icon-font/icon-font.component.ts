import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-icon-font',
  template: `<svg class="icon"><use attr.xlink:href="./assets/icons/icons.svg#{{iconLink}}"></use></svg>`,
  styleUrls: ['./icon-font.component.scss']
})
export class IconFontComponent implements OnInit {

  iconLink = '';

  @Input() set iconClass(value: string) {
    this.iconLink = value;
  }

  constructor() { }

  ngOnInit() {
  }

}

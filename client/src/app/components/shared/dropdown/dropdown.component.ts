import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {

  @ViewChild('dropdown',{ static: false}) dropdown: ElementRef;
  public showMenu = false;

  @HostListener('document:click', ['$event'])
  onClick(event?) {
    if (this.showMenu && !this.eref.nativeElement.contains(event.target)) {
      this.showMenu = false;
    }
  }

  constructor(private eref: ElementRef) {}

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

}

import { AuthService } from '../../../services/http/auth.service';
import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  @Input() headerTop: number;
  @Input() scrollTop: number;
  @Output() openRightSidebar = new EventEmitter();

  showEditor = true;

  constructor() { }

  ngOnInit() {
  }

  onOpenSidebar() {
    // console.log('on open');
    this.openRightSidebar.emit(true);
  }

}

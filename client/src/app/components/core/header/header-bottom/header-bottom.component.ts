import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-bottom',
  templateUrl: './header-bottom.component.html',
  styleUrls: ['./header-bottom.component.scss']
})
export class HeaderBottomComponent implements OnInit {

  showHeader = true;
  showOptions = true;
  constructor() { }

  ngOnInit() {
  }

}

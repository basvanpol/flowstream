import { AuthService } from '../../../services/http/auth.service';
import { Component, OnInit, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  @Input() headerTop: number;

  showEditor = true;

  constructor() { }

  ngOnInit() {
  }



}

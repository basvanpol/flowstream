import { IAuthState } from '../../../store/auth/reducers/auth.reducer';
import { Store } from '@ngrx/store';
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-user-component',
  templateUrl: './main-user.component.html',
  styleUrls: ['./main-user.component.scss']
})
export class MainUserComponent implements OnInit {

  headerTop = 0;

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (offset > 0 && offset < 60) {
      this.headerTop = -offset;
    } else if (offset === 0) {
      this.headerTop = 0;
    } else {
      this.headerTop = -60;
    }
  }

  constructor(private route: ActivatedRoute, private store: Store<IAuthState>) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams) => {
      const user: {
        userId: string
      } = {
        userId: queryParams['userId'],
      };
    });

  }

}

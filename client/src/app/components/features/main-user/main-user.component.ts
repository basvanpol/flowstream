import { IAuthState } from '../../../store/auth/reducers/auth.reducer';
import { Store } from '@ngrx/store';
import { Component, OnInit, HostListener, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-user-component',
  templateUrl: './main-user.component.html',
  styleUrls: ['./main-user.component.scss']
})
export class MainUserComponent implements OnInit {

  headerTop = 0;
  scrollTop = 0;
  scrollDownPos = 0;
  scrollUpPos = 0;
  isRightSidebarOpen = false;
  scrollDownHeaderPosition = 0;
  scrollUpHeaderPosition = 0;

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const direction = (offset > this.scrollTop) ? "down" : "up";

    if (direction === "down") {
      const scrollDownDif = offset - this.scrollUpPos;
      if (scrollDownDif > 0 && scrollDownDif <= 70) {
        this.headerTop = this.scrollUpHeaderPosition - scrollDownDif;
      } else if (offset === 0) {
        this.headerTop = 0;
      } else {
        this.headerTop = -70;
      }
      this.scrollDownPos = offset;
      this.scrollDownHeaderPosition = this.headerTop;
    } else {
      const scrollUpDif = this.scrollDownPos - offset;
      if (offset >= 0) {
        if (scrollUpDif > 0 && scrollUpDif <= 70) {
          this.headerTop = (this.headerTop < 0 ) ? this.scrollDownHeaderPosition + scrollUpDif : 0;
        } else {
          this.headerTop = 0;
        }
      }
      this.scrollUpPos = offset;
      this.scrollUpHeaderPosition = this.headerTop;
    }
    this.scrollTop = offset;
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

  public onOpenRightSideBar() {
    console.log('open right sidebar');
    this.isRightSidebarOpen = true;
  }

  public closeRightSidebar() {
    this.isRightSidebarOpen = false;
  }

}

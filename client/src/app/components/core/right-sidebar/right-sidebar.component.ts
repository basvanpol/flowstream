import { FlowVM } from './../../../models/flow';
import { Subscription } from 'rxjs';
import { FlowFacade } from './../../../store/flow/facade/flow.facade';
import { AddFlowComponent } from '../../features/add-flow/add-flow.component';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Router } from '@angular/router';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit, OnDestroy {

  @Input() set isOpen (value) {
    this.isSidebarOpen = value;
  }
  @Output() closeSidebar = new EventEmitter();
  isSidebarOpen = false;
  flows$: Subscription;
  flows: FlowVM[];

  constructor(public dialog: MatDialog, private flowFacade: FlowFacade, private router: Router) {
  }

  openAddFlowDialog() {
    const dialogRef = this.dialog.open(AddFlowComponent, {
      width: '400px',
      maxHeight: '400px',
    });
  }

  ngOnInit() {
    this.flows$ = this.flowFacade.flows$.pipe(untilDestroyed(this)).subscribe((flows: FlowVM[]) => {
      this.flows = flows;
    });
  }


  onSelectFlow(flowId: number) {

    // this.router.navigate([`/flow/?flowId=flowId`]);
    this.router.navigate(['flow'], {queryParams: {flowId: flowId}});
  }

  onDeleteFlow(flowId: number) {
    this.flowFacade.deleteFlow(flowId);
  }

  onCloseSidebar() {
    this.closeSidebar.emit();
  }

  ngOnDestroy() { }

}

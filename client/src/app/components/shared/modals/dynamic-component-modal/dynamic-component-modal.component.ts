import { IGeneralSelectionState } from './../../../../store/general/reducers/general-selection.reducer';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { DynamicComponentModalHostDirective } from './dynamic-component-modal-host.directive';
import { OnDestroy, DirectiveDecorator, ViewContainerRef, Renderer2, ElementRef, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { untilDestroyed } from '../../../../../../node_modules/ngx-take-until-destroy';

@Component({
  selector: 'app-dynamic-component-modal',
  template: `
  <div #drilldownWrapper class="drill-down__wrapper" (click)="onClose($event)" [ngClass]="{'show': showComponent}">
    <div (click)="$event.stopPropagation()">
      <ng-template dynamicComponentModalHost></ng-template>
    </div>
  </div>`,
  styleUrls: ['./dynamic-component-modal.component.scss']
})
export class DynamicComponentModalComponent implements OnDestroy, AfterViewInit {

  @ViewChild(DynamicComponentModalHostDirective, { static: false}) dynamicComponentModalHost: DynamicComponentModalHostDirective;
  @ViewChild('drilldownWrapper', {static: false}) drilldownWrapper: ElementRef<any>;
  componentRef: ComponentRef<any>;
  contentComponent: DirectiveDecorator;
  showComponent = false;
  generalSelectionSubscription$: Subscription;
  generalSelectionState: IGeneralSelectionState;
  loadedComponent: any;
  private drillDownWrapperElement: HTMLElement;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<any>,
    private renderer: Renderer2) {
    this.generalSelectionSubscription$ = this.store.pipe(untilDestroyed(this), select('general-selection')).subscribe((generalSelectionState: IGeneralSelectionState) => {
      this.generalSelectionState = generalSelectionState;
      if (this.generalSelectionState.showDynamicComponent && this.generalSelectionState.dynamicComponent) {
        if (this.loadedComponent !== this.generalSelectionState.dynamicComponent) {
          this.loadComponent(this.generalSelectionState.dynamicComponent);
        }
      }
    });
  }

  ngAfterViewInit() {
    this.drillDownWrapperElement = this.drilldownWrapper.nativeElement;
  }

  public loadComponent(component: any, data: any = null) {

    if (component) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      const viewContainerRef: ViewContainerRef = (this.dynamicComponentModalHost) ? this.dynamicComponentModalHost.viewContainerRef : null;
      viewContainerRef.clear();
      if (this.dynamicComponentModalHost) {
        this.componentRef = viewContainerRef.createComponent(componentFactory) as ComponentRef<any>;
        if (data && this.componentRef.instance) {
          this.componentRef.instance.data = {
            ...data
          };
        }
        this.componentRef.instance.drillDownRef = this;
        this.loadedComponent = component;
      }
      this.onOpen();
    }
  }

  onOpen() {
    // this.drillDownContainerElement = this.drilldownWrapper.nativeElement.querySelectorAll('.drill-down__container')[0];

    this.showComponent = true;
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
    setTimeout(() => {
      this.drillDownWrapperElement.scrollTop = 0;
    }, 0);
  }



  onClose($event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.showComponent = false;
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    this.loadedComponent = null;
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}

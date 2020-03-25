import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'fixed-element',
  template: `<div #fixedanchor style="display: inline-block;"></div><ng-content></ng-content>`
})
export class FixedElementComponent implements AfterViewInit, OnDestroy {

  @Input() options = { threshold: 0.0 };
  @Output() fixElement = new EventEmitter();
  @ViewChild('fixedanchor' ) anchor: ElementRef<HTMLElement>;

  private observer: IntersectionObserver;

  constructor(private host: ElementRef) { }

  get element() {
    return this.host.nativeElement;
  }

  ngAfterViewInit() {
    const options = {
      root: this.isHostScrollable() ? this.host.nativeElement : null,
      ...this.options
    };

    this.observer = new IntersectionObserver(([entry]) => {
      this.fixElement.emit(entry.isIntersecting);
    }, options);
    this.observer.observe(this.anchor.nativeElement);
  }

  private isHostScrollable() {
    const style = window.getComputedStyle(this.element);
    return style.getPropertyValue('overflow-y') === 'scroll';
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}

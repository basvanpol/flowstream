import { ViewContainerRef, Directive } from '@angular/core';

@Directive({
    selector: '[dynamicComponentModalHost]'
})
export class DynamicComponentModalHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}

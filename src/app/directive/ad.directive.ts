import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[adHost]',
})

export class AdDirective {

    constructor(public viewContainerRef: ViewContainerRef) { }


}



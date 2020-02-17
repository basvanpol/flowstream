import { SelectConfirmationModalComponent } from './select-confirmation-modal/select-confirmation-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentModalComponent } from '../modals/dynamic-component-modal/dynamic-component-modal.component';

@NgModule({
  imports: [
    CommonModule
  ],
  entryComponents: [
    SelectConfirmationModalComponent
  ]
})
export class ModalModule { }

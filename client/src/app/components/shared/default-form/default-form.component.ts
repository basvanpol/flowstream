import { NgForm, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-default-form',
  templateUrl: './default-form.component.html',
  styleUrls: ['./default-form.component.scss']
})
export class DefaultFormComponent {

  @ViewChild('f', {static: false}) form: NgForm;

  public formGroup: FormGroup;
  public failText: string;
  public loading = false;
  public showSpinner = false;

  constructor() { }

}

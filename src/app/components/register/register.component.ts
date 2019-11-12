import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;


  constructor() {
    this.registerForm = new FormGroup({
      userId: new FormControl('',
        [Validators.required, Validators.minLength(3)]),
    });
  }

  ngOnInit() {
  }

}

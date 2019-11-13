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
      email: new FormControl('', [Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      password1: new FormControl('', [Validators.required
        , Validators.minLength(6)]),
      password2: new FormControl('', Validators.required),
      birthDate: new FormControl('', Validators.required),
    });

    // Passwords
    this.registerForm.get('password2').setValidators([
      Validators.required,
      this.noSame.bind(this.registerForm)
    ]);

    // Detect userId changes
    this.registerForm.get('userId').valueChanges
      .subscribe(data => {
        console.log('valueChanges userId:', data);
      });
    this.registerForm.get('userId').statusChanges
      .subscribe(data => {
        console.log('statusChanges userId:', data);
      });

  }

  ngOnInit() {
  }

  // Custom validator for passwords
  noSame(control: FormControl): { [s: string]: boolean } {
    const registerForm: any = this;

    if (control.value !== registerForm.get('password1').value) {
      return {nosame: true};
    }
    return null;
  }


}

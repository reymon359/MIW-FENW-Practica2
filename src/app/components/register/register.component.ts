import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {
  private registerForm: FormGroup;
  private registering = false;
  private user: any = {
    userId: '',
    email: '',
    password: '',
    birthdate: null
  };

  constructor(private userService: UserService) {
    this.registerForm = new FormGroup({
      userId: new FormControl('',
        [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      password1: new FormControl('', [Validators.required
        , Validators.minLength(6)]),
      password2: new FormControl(),
      birthdate: new FormControl()
    });

    // Passwords
    this.registerForm.get('password2').setValidators([
      Validators.required,
      this.noSame.bind(this.registerForm)
    ]);

    // Birthdate
    this.registerForm.get('birthdate').setValidators([
      Validators.required,
      this.noValidBirthdate.bind(this.registerForm)

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

  // Custom validator for birthdate
  noValidBirthdate(control: FormControl): { [s: string]: boolean } {
    const minBirthDate = new Date('1900-01-01').getTime();
    const userBirthDate = new Date(control.value).getTime();
    const maxBirthDate = new Date().getTime();
    if (userBirthDate > maxBirthDate || userBirthDate < minBirthDate) {
      return {novalid: true};
    }
    return null;
  }

  submitRegisterForm() {
    this.registering = true;
    this.registerForm.value.birthdate = new Date(this.registerForm.value.birthdate).getTime();
    setTimeout(() => {
      this.userService.create(this.registerForm.value)
        .subscribe((data: any) => {
            this.registering = false;
            console.log(data);
            if (data.status === 201 && data.statusText === 'Created') {
              document.getElementById('alertRegisterCorrect').style.display = 'block';
              this.registerForm.reset();
            } else {
              document.getElementById('alertRegisterFailed').style.display = 'block';
            }
          }, (error) => {
            this.registering = false;
            if (error.error === 'duplicated username') {
              document.getElementById('alertRegisterInvalid').style.display = 'block';
              this.registerForm.get('userId').setValue('');
            }
            console.error(error);
          }
        );
    }, 1500);
  }

}

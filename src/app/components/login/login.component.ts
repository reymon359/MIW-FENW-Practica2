import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  private loginForm: FormGroup;
  private logging = false;

  constructor(private userService: UserService) {
    this.loginForm = new FormGroup({
      userId: new FormControl('',
        [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required
        , Validators.minLength(6)]),
    });
  }

  ngOnInit() {
  }

  submitRegisterForm() {
    this.displayAlert('submitAlerts');
    this.registering = true;
    this.registerForm.value.birthdate = new Date(this.registerForm.value.birthdate).getTime();
    setTimeout(() => {
      this.userService.create(this.registerForm.value)
        .subscribe((data: any) => {
            this.registering = false;
            console.log(data);
            if (data.status === 201) {
              this.displayAlert('Correct');
              this.registerForm.reset();
            } else {
              this.displayAlert('Failed');
            }
          }, (error) => {
            this.registering = false;
            if (error.error === 'duplicated username') {
              this.displayAlert('Invalid');
              this.registerForm.get('userId').setValue('');
            } else {
              this.displayAlert('Failed');
            }
            console.error(error);
          }
        );
    }, 1500);
  }

}

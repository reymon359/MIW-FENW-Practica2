import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent  {
  private loginForm: FormGroup;
  private logging = false;

  private alerts = ['Correct', 'Invalid', 'Failed'];

  constructor(private userService: UserService) {
    this.loginForm = new FormGroup({
      userId: new FormControl('',
        [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required
        , Validators.minLength(6)]),
    });
  }


  submitRegisterForm() {
    // this.displayAlert('submitAlerts');
    this.logging = true;
    setTimeout(() => {
      this.userService.create(this.loginForm.value)
        .subscribe((data: any) => {
            this.logging = false;
            console.log(data);
            if (data.status === 201) {
              this.displayAlert('Correct');
              this.loginForm.reset();
            } else {
              this.displayAlert('Failed');
            }
          }, (error) => {
            this.logging = false;
            if (error.error === 'duplicated username') {
              this.displayAlert('Invalid');
              this.loginForm.get('userId').setValue('');
            } else {
              this.displayAlert('Failed');
            }
            console.error(error);
          }
        );
    }, 1500);
  }

  displayAlert(alertType: string) {
    if (this.alerts.includes(alertType)) {
      document.getElementById(`alertRegister${alertType}`).style.display = 'block';
    } else if (alertType === 'submitAlerts') {
      Array.from(document.querySelectorAll(`.alert-dismissible`))
        .map(alert => alert.setAttribute('style', `display:none`));
    } else {
      return;
    }
  }
}

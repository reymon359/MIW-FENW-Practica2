import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {
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


  submitLoginForm() {
    this.displayAlert('submitAlerts');
    this.logging = true;
    setTimeout(() => {
      this.userService.login(this.loginForm.get('userId').value, this.loginForm.get('password').value)
        .subscribe((data: any) => {
            this.logging = false;
            if (data.status === 200) {
              this.displayAlert('Correct');
              this.userService.saveUserToken(data.body);
              this.loginForm.reset();
            } else {
              this.displayAlert('Failed');
            }
          }, (error) => {
            this.logging = false;
            if (error.error === 'invalid username/password supplied') {
              this.displayAlert('Invalid');
            } else if (error.error === 'no username or password') {
              this.displayAlert('Invalid');
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

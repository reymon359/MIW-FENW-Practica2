import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user/user.service';
import {log} from 'util';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent {
  private registerForm: FormGroup;
  private registering = false;
  private checkingUsername = false;
  private user: any = {
    userId: '',
    email: '',
    password: '',
    birthdate: null
  };
  private userNameChecked = '';
  private alerts = ['Correct', 'Invalid', 'Failed'];

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
        if (data.length >= 3) {
          this.checkUsername(data);
        }
      });

    this.registerForm.get('userId').statusChanges
      .subscribe(data => {
        console.log('statusChanges userId:', data);
      });

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


  checkUsername(usernameFromInput) {
    this.userNameChecked = '';
    this.checkingUsername = true;
    setTimeout(() => {
      this.userService.checkUsername(usernameFromInput).subscribe((data: any) => {
          console.log(data);
          this.checkingUsername = false;
          if (data.status === 200) {
            console.log('found');
            this.userNameChecked = 'found';
            console.log(this.checkingUsername, this.userNameChecked);
          } else {
            this.userNameChecked = 'error';
          }
        }, (error) => {
          this.checkingUsername = false;
          if (error.status === 404) {
            this.userNameChecked = 'notFound';
          } else {
            this.userNameChecked = 'error';
          }
          console.error(error);
        }
      );
    }, 1000);
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

import {Component, OnInit} from '@angular/core';
import {Reservation} from '../../shared/models/index.model';
import {ReservationService} from '../../shared/services/reservation/reservation.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styles: []
})
export class BookingComponent implements OnInit {
  private reservations: Reservation[] = [];
  private bookingForm: FormGroup;
  private booking = false;
  private bookingCompleted = false;
  private alerts = ['Correct', 'Invalid', 'Failed'];

  constructor(private reservationService: ReservationService) {

    this.bookingForm = new FormGroup({
      reservationDate: new FormControl(),
      // userId: new FormControl('',
      //   [Validators.required, Validators.minLength(3)]),
      // password: new FormControl('', [Validators.required
      //   , Validators.minLength(6)]),
    });

    // ReservationDate
    this.bookingForm.get('reservationDate').setValidators([
      Validators.required,
      this.noValidReservationDate.bind(this.bookingForm)
    ]);
  }

  ngOnInit() {
    this.getReservations();
  }

  getReservations() {
    this.reservationService.getUserReservations().subscribe((data: any) => {
      console.log(data);
    }, (error) => console.error(error));
    this.reservations = [
      {rsvId: 925, courtId: 4, rsvdateTime: 1544529600000, rsvday: '12/12/2018', rsvtime: '13:00'},
      {rsvId: 926, courtId: 2, rsvdateTime: 1544529600000, rsvday: '13/12/2018', rsvtime: '13:00'},
      {rsvId: 927, courtId: 1, rsvdateTime: 1544529600000, rsvday: '14/12/2018', rsvtime: '12:00'},
      {rsvId: 928, courtId: 4, rsvdateTime: 1544529600000, rsvday: '12/12/2018', rsvtime: '13:00'},
    ];
  }

  // Custom validator for reservationDate
  noValidReservationDate(control: FormControl): { [s: string]: boolean } {

    const minDate = new Date().getTime();
    const userDate = new Date(control.value).getTime();
    if (minDate > userDate) {
      return {novalid: true};
    }
    return null;
  }

  submitBookingForm() {
    this.displayAlert('submitAlerts');
    this.booking = true;
    setTimeout(() => {
      // this.reservationService.login(this.loginForm.get('userId').value, this.loginForm.get('password').value)
      //   .subscribe((data: any) => {
      //       this.logging = false;
      //       if (data.status === 200) {
      //         this.displayAlert('Correct');
      //         this.userService.saveUserToken(data.body);
      //         this.loginCompleted = true;
      //         this.loginForm.reset();
      //       } else {
      //         this.displayAlert('Failed');
      //       }
      //     }, (error) => {
      //       this.logging = false;
      //       if (error.error === 'invalid username/password supplied') {
      //         this.displayAlert('Invalid');
      //       } else if (error.error === 'no username or password') {
      //         this.displayAlert('Invalid');
      //       } else {
      //         this.displayAlert('Failed');
      //       }
      //       console.error(error);
      //     }
      //   );
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

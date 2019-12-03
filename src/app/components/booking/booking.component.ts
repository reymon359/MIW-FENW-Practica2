import {Component, OnInit} from '@angular/core';
import {Reservation} from '../../shared/models/index.model';
import {ReservationService} from '../../shared/services/reservation/reservation.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../shared/services/user/user.service';
// this.reservations = [
//   {rsvId: 925, courtId: 4, rsvdateTime: 1544529600000, rsvday: '12/12/2018', rsvtime: '13:00'},
//   {rsvId: 926, courtId: 2, rsvdateTime: 1544529600000, rsvday: '13/12/2018', rsvtime: '13:00'},
//   {rsvId: 927, courtId: 1, rsvdateTime: 1544529600000, rsvday: '14/12/2018', rsvtime: '12:00'},
//   {rsvId: 928, courtId: 4, rsvdateTime: 1544529600000, rsvday: '12/12/2018', rsvtime: '13:00'},
// ];
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styles: []
})
export class BookingComponent implements OnInit {
  private reservations: Reservation[] = [];
  private reservationsBooked: Reservation[] = [];
  private bookingForm: FormGroup;
  private booking = false;
  private bookingCompleted = false;

  private checkingbookingAvailability = false;
  private bookingAvailabilityChecked = '';
  private alerts = ['Correct', 'Invalid', 'Failed'];
  private hours = ['10:00', '11:00', '12:00'];

  constructor(private reservationService: ReservationService,
              private  userService: UserService) {

    this.bookingForm = new FormGroup({
      reservationDate: new FormControl(),
      reservationHour: new FormControl('',
        [Validators.required, Validators.min(10),
          Validators.max(21)]),
    });

    // ReservationDate
    this.bookingForm.get('reservationDate').setValidators([
      Validators.required,
      this.noValidReservationDate.bind(this.bookingForm)
    ]);

    // Detect reservationDate changes
    this.bookingForm.get('reservationDate').valueChanges
      .subscribe(data => {
        console.log(data);
        if (this.bookingForm.get('reservationDate').valid) {
          this.checkBookingAvailability(data);
        }
      });
  }

  ngOnInit() {
    this.getReservations();
  }

  getReservations() {
    this.reservationService.getUserReservations().subscribe((data: any) => {
      this.reservations = data.body;
    }, (error) => {
      if (error.status === 401) {
        this.userService.tokenInvalid();
      }
      console.error(error);
    });

  }

  // Custom validator for reservationDate
  noValidReservationDate(control: FormControl): { [s: string]: boolean } {
    const d = new Date();
    const minDate = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const userDate = new Date(control.value).getTime();
    if (userDate < minDate) {
      return {novalid: true};
    }
    return null;
  }

  submitBookingForm() {
    this.displayAlert('submitAlerts');
    this.booking = true;
    const date = new Date(this.bookingForm.get('reservationDate').value)
      .setHours(this.bookingForm.get('reservationHour').value);


    console.log(date);
    console.log(date.toString());
    setTimeout(() => {
      this.reservationService.reserve(1, date)
        .subscribe((data: any) => {
            console.log(data);
            // this.logging = false;
            // if (data.status === 200) {
            //   this.displayAlert('Correct');
            //   this.userService.saveUserToken(data.body);
            //   this.loginCompleted = true;
            //   this.loginForm.reset();
            // } else {
            //   this.displayAlert('Failed');
            // }
          }, (error) => {
            // this.logging = false;
            // if (error.error === 'invalid username/password supplied') {
            //   this.displayAlert('Invalid');
            // } else if (error.error === 'no username or password') {
            //   this.displayAlert('Invalid');
            // } else {
            //   this.displayAlert('Failed');
            // }
            console.error(error);
          }
        );
    }, 1500);
  }

  checkBookingAvailability(date) {
    this.bookingAvailabilityChecked = '';
    this.checkingbookingAvailability = true;
    setTimeout(() => {
      this.reservationService.getReservationAvailability(new Date(date).getTime())
        .subscribe((data: any) => {
            this.checkingbookingAvailability = false;
            if (data.status === 200) {
              this.bookingAvailabilityChecked = 'found';
              this.displayHoursAvailables(data.body);
            } else {
              this.bookingAvailabilityChecked = 'error';
            }
          }, (error: any) => {
            console.log('error', error);
            this.checkingbookingAvailability = false;
            if (error.status === 401 && error.error === 'no valid token') {
              this.userService.tokenInvalid();
            } else {
              this.bookingAvailabilityChecked = 'error';
            }
            // console.error(error);
          }
        );
    }, 1000);
  }

  displayHoursAvailables(reservations: Reservation[]) {
    this.reservationsBooked = reservations;
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

  deleteBookings() {
    this.reservationService.delete()
      .subscribe((data: any) => {
          console.log(data);

        }, (error) => {
          console.error(error);
        }
      );
  }
}

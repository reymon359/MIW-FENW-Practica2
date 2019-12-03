import {Component, OnInit} from '@angular/core';
import {Reservation} from '../../shared/models/index.model';
import {ReservationService} from '../../shared/services/reservation/reservation.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../shared/services/user/user.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styles: []
})
export class BookingComponent implements OnInit {
  reservations: Reservation[] = [];
  reservationsBooked = [];
  bookingForm: FormGroup;
  booking = false;
  bookingCompleted = false;

  checkingbookingAvailability = false;
  bookingAvailabilityChecked = '';
  private alerts = ['Correct', 'Invalid', 'Failed'];
  loadingBookings = false;

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
        if (this.bookingForm.get('reservationDate').valid) {
          this.checkBookingAvailability(data);
        }
      });
  }

  ngOnInit() {
    this.getReservations();
  }

  restartForm() {
    this.bookingCompleted = false;
    this.displayAlert('submitAlerts');
  }

  getReservations() {
    this.loadingBookings = true;
    this.reservationService.getUserReservations().subscribe((data: any) => {
      this.loadingBookings = false;
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

  submitBookingForm(hour, court) {
    this.displayAlert('submitAlerts');
    this.booking = true;
    const date = new Date(this.bookingForm.get('reservationDate').value)
      .setHours(hour);
    setTimeout(() => {
      this.reservationService.reserve(court, date)
        .subscribe((data: any) => {
            this.booking = false;
            this.bookingCompleted = true;
            if (data.status === 201) {
              this.displayAlert('Correct');
              this.bookingForm.reset();
              this.getReservations();
            } else {
              this.displayAlert('Failed');
            }
          }, (error) => {
            this.booking = false;
            if (error.status === 401) {
              this.displayAlert('Invalid');
              this.userService.tokenInvalid();
            } else {
              this.displayAlert('Failed');
            }
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
            console.error(error);
            this.checkingbookingAvailability = false;
            if (error.status === 401 && error.error === 'no valid token') {
              this.userService.tokenInvalid();
            } else {
              this.bookingAvailabilityChecked = 'error';
            }
          }
        );
    }, 1000);
  }

  displayHoursAvailables(reservations) {
    this.reservationsBooked = reservations.map((r: any) =>
      Number(r.rsvtime.split(':')[0]) * 10 + Number(r.courtId));
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
    this.loadingBookings = true;
    this.reservationService.delete()
      .subscribe((data: any) => {
        this.loadingBookings = false;
        if (data.status === 204) {
          this.getReservations();
        } else {
          console.error(data);
        }
      }, (error: any) => {
        console.error(error);
        this.loadingBookings = false;
        if (error.status === 401) {
          this.userService.tokenInvalid();
        }
      });
  }
}

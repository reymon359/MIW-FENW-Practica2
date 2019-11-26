import {Component, OnInit} from '@angular/core';
import {Reservation} from '../../shared/models/index.model';
import {ReservationService} from '../../shared/services/reservation/reservation.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styles: []
})
export class BookingComponent implements OnInit {
  private reservations: Reservation[] = [];


  constructor(private reservationService: ReservationService) {
    this.reservations = [
      {rsvId: 925, courtId: 4, rsvdateTime: 1544529600000, rsvday: '12/12/2018', rsvtime: '13:00'},
      {rsvId: 926, courtId: 2, rsvdateTime: 1544529600000, rsvday: '13/12/2018', rsvtime: '13:00'},
      {rsvId: 927, courtId: 1, rsvdateTime: 1544529600000, rsvday: '14/12/2018', rsvtime: '12:00'},
      {rsvId: 928, courtId: 4, rsvdateTime: 1544529600000, rsvday: '12/12/2018', rsvtime: '13:00'},
    ];
  }

  ngOnInit() {
    this.reservationService.getUserReservations().subscribe((data: any) => {
      console.log(data);
    }, (error) => console.error(error));
  }

}

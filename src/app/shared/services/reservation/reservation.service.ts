import {Injectable} from '@angular/core';
import {GLOBAL} from '../global.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from '../user/user.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private url = GLOBAL.url;

  constructor(private http: HttpClient, private userService: UserService) {
  }

  getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.userService.getUserToken(),
    });
  }

  reserve(courtid, rsvdatetime) {
    const url = `${this.url}reservations`;
    const headers = this.getHeaders();
    const body = {courtid, rsvdatetime};
    return this.http.post(url, body, {headers, observe: 'response'})
      .pipe(map(data => data));
  }




}

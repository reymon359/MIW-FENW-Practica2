import {EventEmitter, Injectable, Output} from '@angular/core';
import {GLOBAL} from '../global.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {log} from 'util';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = GLOBAL.url;
  @Output() fireIsLoggedIn: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient) {
  }


  create(user) {
    const url = `${this.url}users`;
    const body = {
      username: user.userId,
      email: user.email,
      password: user.password1,
      birthdate: user.birthdate
    };
    return this.http.post(url, body, {observe: 'response'});
  }

  checkUsername(username) {
    const url = `${this.url}users/${username}`;
    return this.http.get(url, {observe: 'response'});
  }

  login(username, password) {
    const url = `${this.url}users/login?username=${username}&password=${password}`;
    return this.http.get(url, {observe: 'response'});
    // .pipe(map(data => console.log(data)));
  }

  logout() {
    if (this.getUserToken() !== null) {
      sessionStorage.removeItem('userToken');
    }
  }

  saveUserToken(token) {
    sessionStorage.setItem('userToken', token);
  }

  getUserToken() {
    const token = sessionStorage.getItem('userToken');
    return token ? token : null;
  }

  isLoggedIn() {
    if (this.getUserToken() !== null) {
      this.fireIsLoggedIn.emit(true);
      return true;
    } else {
      this.fireIsLoggedIn.emit(false);
      return false;
    }
  }

  getEmitter() {
    return this.fireIsLoggedIn;
  }
}

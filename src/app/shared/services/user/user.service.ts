import {EventEmitter, Injectable, Output} from '@angular/core';
import {GLOBAL} from '../global.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {log} from 'util';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = GLOBAL.url;
  @Output() fireIsLoggedIn: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient, private router: Router
  ) {
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

  tokenInvalid() {
    document.body.innerHTML +=
      `<div style="top:0;position:absolute;width:100%;height:100%;z-index:100;background:rgba(0, 0, 0, 0.6);">
       <div style="display: block" class="modal border-0 shadow-lg" id="exampleModalCenter"
        tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered " role="document">
            <div class="modal-content ">
              <div class="modal-header border-bottom-0">
                <h5 class="modal-title" id="exampleModalCenterTitle">Modal title</h5>
              </div>
              <div class="modal-body ">
                <div class="alert alert-warning" role="alert">
                 Ha caducado la sesión, por favor inicia sesión de nuevo
                </div>
              </div>
              <div class="modal-footer border-0">
                  <p>Redirigiendo a Login ...</p>
              </div>
            </div>
          </div>
        </div>
      </div>`;


    this.logout();
    setTimeout(() => {
      this.router.navigate(['/login']);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }, 2000);

  }

  saveUserToken(token) {
    sessionStorage.setItem('userToken', token);
  }

  getUserToken() {
    const token = sessionStorage.getItem('userToken');
    return token ? token : '';
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

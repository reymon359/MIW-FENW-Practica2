import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../shared/services/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;

  constructor(public userService: UserService) {
    userService.getEmitter().subscribe((customObject) => {
      this.isLoggedIn = customObject;
    });
  }

  ngOnInit() {
  }

  logout() {
    this.userService.logout();
  }
}

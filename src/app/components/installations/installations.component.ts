import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-installations',
  templateUrl: './installations.component.html',
  styles: []
})
export class InstallationsComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {
    this.renderInstalacionesMap();
  }


  renderInstalacionesMap() {
    document.getElementById('googleMap').innerHTML = `
    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2910.046024298!2d-3.628133192935893!3d40.38924643530008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4225a69db56d45%3A0x354b7535164dbaf!2sPolideportivo%20Campus%20Sur%20%3A%20UPM!5e0!3m2!1sen!2ses!4v1573042808962!5m2!1sen!2ses"
    width="100%" height="100%" frameborder="0" style="border:0;height: 40vh" allowfullscreen=""></iframe>`;

  }
}

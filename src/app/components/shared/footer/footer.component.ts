import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: []
})
export class FooterComponent implements OnInit {

  constructor() {
    this.setFooterDate();
  }

  ngOnInit() {
  }

  setFooterDate() {
    if (new Date().getFullYear() !== 2019) {
      document.querySelector('#footer-date').innerHTML = ` - ${new Date().getFullYear()}`;
    }
  }

}

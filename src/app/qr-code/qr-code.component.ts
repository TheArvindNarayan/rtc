import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { GetDataService } from 'app/get-data.service';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.sass']
})
export class QrCodeComponent implements OnInit {
  qrURL: any = '';

  constructor(private cookie: CookieService,
    private get: GetDataService) { }

  ngOnInit() {
    this.get.getProfile().subscribe(
      data => {
        this.qrURL = data.json().data.qr_code_url;
        console.log(this.qrURL);
      }
    );

  }

}

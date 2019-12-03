import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { SendDataService } from '../send-data.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.sass']
})
export class PrivacyComponent implements OnInit {

  color = '#ee0f7b';
  checkedPush = true;
  checkedmail = true;
  checkedtext = true;

  constructor(private send: SendDataService,
              private auth: AuthService) { }

  ngOnInit() {
    let privacyTemp = this.auth.retrunPrivacySettings();
    this.checkedPush = privacyTemp['push'];
    this.checkedmail = privacyTemp['mail'];
    this.checkedtext = privacyTemp['text'];
  }

  pushChange() {
    this.send.sendPrivacySettings(this.checkedPush, this.checkedmail, this.checkedtext);
  }

}

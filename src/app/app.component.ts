import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  constructor(private notificaton: NotificationService) {}

  ngOnInit() {
    this.notificaton.firebaseInit();
  }
}

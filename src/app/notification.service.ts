import { SendDataService } from './send-data.service';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class NotificationService {
  config = {
    apiKey: 'AIzaSyAnMkXJr9qW8wPzCLp7QAHS4G1wKNtmh7U',
    authDomain: 'reeltime-742c2.firebaseapp.com',
    databaseURL: 'https://reeltime-742c2.firebaseio.com',
    projectId: 'reeltime-742c2',
    storageBucket: 'reeltime-742c2.appspot.com',
    messagingSenderId: '930957800364'
  };
  // currentMessage = new BehaviorSubject(null);

  constructor(private notify: ToastrService,
  private sendData: SendDataService) { }

  firebaseInit() {
    firebase.initializeApp(this.config);
  }

  msging() {
    let messaging = firebase.messaging();
    messaging.requestPermission()
    .then(
      () => {
        console.log('Notification Permissions Set');
        return messaging.getToken();
      }
    ).then(
      (token) => {
        this.sendData.sendDeviceToken(token);
      }
    )
    .catch(
      (err) => {
        console.log('No Push Notification Permissions');
      }
    );

    messaging.onMessage(
      (payload) => {
        this.notify.info(payload.data.title + '\n' + payload.data.body);
      }
    );
    }

}

import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent implements OnInit {

  public currentPass: any;
  public newPass: any;
  public confirmPass: any;
  hide1 = true;
  hide2 = true;
  hide3 = true;

  constructor(private notify: ToastrService, private auth: AuthService) { }

  ngOnInit() {
  }

  onFormSubmit() {
    if (!this.confirmPass || !this.newPass || !this.currentPass) {
      this.notify.warning('Fields are empty');
      return;
    }
    if (this.currentPass === this.newPass) {
      this.notify.warning('Current and new password is similar');
      return;
    }
   if (this.currentPass.length > 0 && this.newPass.length > 0 && this.confirmPass.length > 0) {
    if (this.currentPass.length > 0) {
      if (this.newPass.length > 5) {
        if (this.confirmPass.length > 5) {
          if (this.newPass === this.confirmPass) {
            this.auth.changePassword(this.currentPass, this.newPass, this.confirmPass);
          } else {
            this.notify.warning('New Password and Confirm Password do not match');
          }
        } else {
          this.notify.warning('Confirm Password should have atleast 6 characters');
          return;
        }
      } else {
        this.notify.warning('New Password should have atleast 6 characters');
        return;
      }
    } else {
      this.notify.warning('Current Password is Empty');
      return;
    }
   } else {
     this.notify.warning('All Fields are Empty');
   }
  }

}

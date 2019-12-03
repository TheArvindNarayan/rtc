import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent implements OnInit {

  public pass: string;
  public mail: string;
  hide = true;

  constructor(public auth: AuthService, private notify: ToastrService) { }

  ngOnInit() {
  }

  onFormSubmit(userForm: NgForm) {
    if (this.pass && this.pass.length > 5) {
      this.auth.signup(userForm.value);
    } else {
      this.notify.warning('Password should be minimum of 6 characters');
      return;
    }
  }

}

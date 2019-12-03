import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.sass']
})
export class ForgotPasswordComponent implements OnInit {

  public mail: string;

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  onFormSubmit(userForm: NgForm) {
    this.auth.forgot(userForm.value);
  }
}

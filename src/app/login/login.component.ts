import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './../auth.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  public pass: string;
  public mail: string;
  hide = true;
  token: any;

  constructor(public auth: AuthService, public router: Router,
  private route: ActivatedRoute, private notify: ToastrService) { }

  ngOnInit() {
    if (this.auth.returnToken()) {
      if (!this.auth.isProfile) {
        swal.fire({
          title: 'Profile Details Error!',
          text: `Please fill Profile Details before you can proceed further !`,
          type: 'warning',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
        this.router.navigate(['/auth/signupDetails'], { relativeTo: this.route });
      }
      if (this.auth.role.includes('player')) {
        this.router.navigate(['/app/videos'], { relativeTo: this.route });
      } else {
        return;
      }
    }
  }

  onFormSubmit(userForm: NgForm) {
    if (this.pass && this.pass.length > 5) {
      this.auth.login(userForm.value);
    } else {
      this.notify.warning('Password should be minimum of 6 characters');
    }
  }

}

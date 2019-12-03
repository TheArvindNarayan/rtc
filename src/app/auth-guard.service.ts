import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthGuardService {

  constructor(private auth: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute) { }

  canActivate() {
    this.auth.getCookie();
    let token = this.auth.returnToken();
    let isUserProfile = this.auth.isProfile();
    let route = this.router.url;
    let role = this.auth.role;

    if ((token.length > 0) && isUserProfile) {
      return true;
    } else if (!isUserProfile && (token.length > 0)) {
      this.router.navigate(['/app/userProfile'], { relativeTo: this.route });
    }
     else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}

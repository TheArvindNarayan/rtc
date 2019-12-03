import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthService {

  loginAPI = 'https://app.reeltimecoaching.com/login';
  signupAPI = 'https://app.reeltimecoaching.com/signup';
  forgotAPI = 'https://app.reeltimecoaching.com/forgot_password';
  logoutAPI = 'https://app.reeltimecoaching.com/logout';
  changePassAPI = 'https://app.reeltimecoaching.com/change_password';
  public token = '';
  role = '';
  id = '';
  stripeID = '';
  stripeCustomerID = '';
  cardInfo: any;
  isEmpty: any = true;
  userProfile: any = 'No';

  constructor(public http: Http,
    public router: Router,
    private cookieService: CookieService,
    public route: ActivatedRoute,
    public notify: ToastrService) { }

  login(cred: any) {
    this.cookieService.deleteAll();
    let headers;
    let options;
    let body = {
      'user':
        {
          'email': '',
          'password': '',
          'device_id': ''
        }
    };
    headers = new Headers({ 'Content-Type': 'application/json' });
    body.user.email = cred.mail;
    body.user.password = cred.password;
    options = new RequestOptions({ headers: headers, body: JSON.stringify(body), method: RequestMethod.Post, url: this.loginAPI });
    this.http.post(this.loginAPI, JSON.stringify(body), options).subscribe(
      data => {
        if (data.json().data.auth_token) {
          this.token = data.json().data.auth_token;
          this.role = data.json().data.role;
          this.id = data.json().data.user_id;
          this.userProfile = data.json().data.user_profile;
          this.cookieService.set( 'userProfile', data.json().data.user_profile );

          let privacyTemp = {};
          privacyTemp['push'] = data.json().data['push_notification'];
          privacyTemp['mail'] = data.json().data['email_notification'];
          privacyTemp['text'] = data.json().data['sms_notification'];
          this.cookieService.set( 'privacySettings', JSON.stringify(privacyTemp));

         if (this.role === 'coach') {
          this.stripeID = data.json().stripe_account_id;
          this.cookieService.set( 'stripeId', data.json().data.stripe_account_id );
          // this.cookieService.set( 'qrcodeURL', data.json().data.qr_code_url );
         } else if (this.role === 'player') {
           this.stripeCustomerID = data.json().data.stripe_customer_id;
          this.cookieService.set( 'stripeCustomerId', data.json().data.stripe_customer_id );
         }
          this.cookieService.set( 'token', data.json().data.auth_token );
          this.cookieService.set( 'role', data.json().data.role );
          this.cookieService.set( 'id', data.json().data.user_id );
          if (this.role === 'coach') {
            if (this.userProfile === 'Yes') {
              this.router.navigate(['/app/inbox'], { relativeTo: this.route });
            } else {
              this.router.navigate(['auth/signupDetails'], { relativeTo: this.route });
            }
          } else if (this.role === 'player') {
            if (this.userProfile === 'Yes') {
              this.router.navigate(['/app/videos'], { relativeTo: this.route });
            } else {
              this.router.navigate(['auth/signupDetails'], { relativeTo: this.route })
            }
          } else {
            this.notify.error('Login Failed', 'Check Mail and Password');
            return;
          }
        }
      },
      error => {
        console.log(error.json());
        error= error.json()
        this.notify.error('Your user ID and password combination is incorrect');
      }
    );
  }

  signup(cred: any) {
    let headers;
    let options;
    let body = {
      'user':
        {
          'email': '',
          'password': '',
          'password_confirmation': ''
        }
    };
    headers = new Headers({ 'Content-Type': 'application/json' });
    body.user.email = cred.mail;
    body.user.password = cred.password;
    body.user.password_confirmation = cred.password;
    options = new RequestOptions({ headers: headers, body: JSON.stringify(body), method: RequestMethod.Post, url: this.signupAPI });
    this.http.post(this.signupAPI, JSON.stringify(body), options).subscribe(
      data => {
        if (data.json().data.auth_token) {
          this.token = data.json().data.auth_token;
          this.role = data.json().data.role;
          this.id = data.json().data.user_id;
          this.router.navigate(['/auth/signupDetails'], { relativeTo: this.route });
        }
      },
      error => {
        this.notify.error(error.json().error);
      }
    );
  }

  forgot(cred: any) {
    let headers;
    let options;
    let body = {
      'user':
        {
          'email': '',
        }
    };
    headers = new Headers({ 'Content-Type': 'application/json' });
    body.user.email = cred.mail;
    options = new RequestOptions({ headers: headers, body: JSON.stringify(body), method: RequestMethod.Put, url: this.forgotAPI });
    this.http.put(this.forgotAPI, JSON.stringify(body), options).subscribe(
      data => {
        this.notify.success('Check Your Mail ID for more');
        this.router.navigate(['/login'], { relativeTo: this.route });
      },
      error => {
        this.notify.error(error.json().error);
        this.router.navigate(['/login'], { relativeTo: this.route });
      }
    );
  }

  updateStripe(id: any) {
    this.stripeID = id;
    this.cookieService.set('stripeId', id);
  }

  logout() {
    let headers;
    let options;
    let body =
        {
          'auth_token': this.token,
        };
    headers = new Headers({ 'Content-Type': 'application/json' });
    body.auth_token = this.token;
    options = new RequestOptions({ headers: headers, body: JSON.stringify(body), method: RequestMethod.Delete, url: this.logoutAPI });
    this.token = '';
    this.cookieService.deleteAll();
    this.router.navigate(['/login'], { relativeTo: this.route });
    this.http.delete(this.logoutAPI, options).subscribe(
      data => {
        this.router.navigate(['/login'], { relativeTo: this.route });
      },
      error => {
        console.log(error);
        this.router.navigate(['/login'], { relativeTo: this.route });
      }
    );
  }

  changePassword(currentPass: any, newPass: any, confirmPass: any) {
    let headers;
    let options;
    let body = {
      'auth_token': this.token,
      'user':
        {
           'current_password': currentPass,
          'password': newPass,
          'password_confirmation': confirmPass
        }
    };
    headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: headers, body: JSON.stringify(body), method: RequestMethod.Put, url: this.changePassAPI });
    this.http.put(this.changePassAPI, JSON.stringify(body), options).subscribe(
      data => {
        if (data.json().code === 200) {
          this.notify.success(data.json().message);
          this.router.navigate(['/app/videos'], { relativeTo: this.route });
        } else {
          this.notify.warning(data.json().error);
        }
      },
      error => {
        this.notify.error(error.json().error);
        console.log(error.json());
      }
    );

  }
  saveCard( stripe_token) {
    const headers = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    let apiResponse: any;
    let url = 'https://app.reeltimecoaching.com/api/v1/payment_customer_for_player?auth_token=' + this.token + '&stripe_token=' + stripe_token ;
    this.http.post(url, headers).map((res: Response) => res.arrayBuffer().byteLength > 2 ? res.json() : {}).subscribe(res => {
      this.stripeCustomerID  = res['stripe_customer_id'];
      this.cookieService.set('stripeCustomerId', this.stripeCustomerID);
      this.notify.success('Successfully Saved Card');
      this.getCardDetails();
    }, error => {});
  }

  getCardDetails() {
    let url = 'https://app.reeltimecoaching.com/api/v1/get_customer_details?auth_token=' + this.token;
    this.http.get(url).map((res: Response) => res.arrayBuffer().byteLength > 2 ? res.json() : {}).subscribe(data => {
      if (Object.keys(data).length) {
        if (data['message'] != 'Customer Details not present') {
          this.cardInfo = data;
          this.isEmpty = false;
        } else {
          this.isEmpty = true;
        }
      } else {
        this.isEmpty = true;
      }
    }, error => {});
  }

  deleteCard() {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions();
    let url = 'https://app.reeltimecoaching.com/api/v1/delete_customer?auth_token=' + this.token;
    this.http.delete(url, options).map((res: Response) => res.arrayBuffer().byteLength > 2 ? res.json() : {}).subscribe(data => {
      if (data['message'] == 'Customer successfully deleted') {
        this.isEmpty = true;
        this.notify.success(data['message']);
        this.stripeCustomerID = '';
        this.cookieService.delete('stripeCustomerId');
      }
    }, error => {});
  }

  flushToken() {
    this.token = '';
    this.cookieService.deleteAll();
  }

  flushBank() {
    this.stripeID = '';
    this.cookieService.delete('stripeId');
  }

  getCookie() {
    this.token = this.cookieService.get('token');
    this.role = this.cookieService.get('role');
    this.id = this.cookieService.get('id');
    this.stripeID = this.cookieService.get('stripeId');
    this.stripeCustomerID = this.cookieService.get('stripeCustomerId');
    this.userProfile = this.cookieService.get('userProfile');
  }

  returnToken() {
    this.token = this.cookieService.get('token');
    return this.token;
  }

  setToken() {
    this.cookieService.set( 'token', this.token );
    this.cookieService.set( 'role', this.role );
    this.cookieService.set( 'id', this.id);
  }

  isProfile() {
      return (this.cookieService.get('userProfile'))? true : false;
  }

  ifStripeId(id) {
    this.stripeID = id;
  }

  returnStripeID() {
    this.getCookie();
    return this.stripeID;
  }

  retrunPrivacySettings() {
    let tempprivSetings = this.cookieService.get('privacySettings');
    tempprivSetings = JSON.parse(tempprivSetings);
    return tempprivSetings;
  }

}

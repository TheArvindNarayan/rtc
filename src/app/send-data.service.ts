import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import {
  Http,
  Headers,
  RequestOptions,
  RequestMethod
} from '@angular/http';
import { AuthService } from './auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Injectable()
export class SendDataService {
  token = 'auth_token=';
  SetFavAPI = 'https://app.reeltimecoaching.com/favorite_user/';
  updateProfileAPI = 'https://app.reeltimecoaching.com/update_profile?';
  commentAPI = 'https://app.reeltimecoaching.com/api/v1/posts/';
  createPostAPI = 'https://app.reeltimecoaching.com/api/v1/posts/?';
  createAccountForCoach = 'https://app.reeltimecoaching.com/api/v1/create_account_for_coach?';
  deleteBankAccount = 'https://app.reeltimecoaching.com/api/v1/delete_account?';
  updateTokenAPI = 'https://app.reeltimecoaching.com/update_device?auth_token=';
  privacyChangeAPI = 'https://app.reeltimecoaching.com/api/v1/enable_notification?auth_token=';
  deleteAPI = 'https://app.reeltimecoaching.com/api/v1/posts/';
  deletehmtAPI = 'https://app.reeltimecoaching.com/api/v1/attachments/';
  couponIn: any = false;
  coupon: any = '';
  couponData: any = '';
  constructor(
    public http: Http,
    public auth: AuthService,
    public router: Router,
    public route: ActivatedRoute,
    private notify: ToastrService,
    private cookieService: CookieService
  ) {
    // this.token = this.token + this.auth.token;
  }

  deletehmt(id) {
    let api = this.deletehmtAPI + id + '?' + this.token + this.auth.token;
    let delhmtprom = new Promise(
      (res, rej) => {
        this.http.delete(api).subscribe(
          data => {
            swal.fire({
              title: 'Success',
              text: `You have Successfully Deleted this Video`,
              type: 'success',
              confirmButtonText: 'Ok',
              allowOutsideClick: false
            });
          },
          error => {
            swal.fire({
              title: 'Error',
              text: `Post Deletion Unsuccessful !`,
              type: 'error',
              confirmButtonText: 'Ok',
              allowOutsideClick: false
            });
            console.log(error);
          }
        );
      }
    );
    return delhmtprom;
  }

  setFav(id) {
    let API = this.SetFavAPI + id + '?' + this.token + this.auth.token;
    this.http.get(API).subscribe(data => {
      this.notify.success('Updated Favorites');
    });
  }

  selectCoach(coachid: any, postID: any) {
    if (this.coupon.trim().length) {
      if (this.couponData == 'Coupon code is not valid or expired ') {
          this.coupon = '';
      }
    }
    let api =
      'https://app.reeltimecoaching.com/posts/' +
      postID +
      '/select_coach/' +
      coachid +
      '?' +
      this.token + this.auth.token + '&couponCode='+ this.coupon;
    let selectCoachProm = new Promise (
      (resolve, reject) => {
        this.http.get(api).subscribe(
          data => {
            resolve(data.json().message);
          },
          error => {
            reject(error);
          }
        );
      }
    );

    return selectCoachProm;
  }

  createPost(title, comment, videoURL, duration): any {
    let api = this.createPostAPI + this.token + this.auth.token;
    let headers;
    let options;
    let body = {
      post: {
        title: '',
        description: '',
        duration: duration,
        images_attributes: [
          {
            attachment_url: 'https://source.unsplash.com/500x400/?sports',
            thumb_attachment_url: ''
          }
        ]
      }
    };
    const size = parseInt(localStorage.getItem('videoSize'), 10);
    headers = new Headers({ 'Content-Type': 'application/json' });
    body.post.title = title;
    body.post.description = comment;
    body.post.images_attributes[0].attachment_url = videoURL;
    if (size > 500) {
      body.post.images_attributes[0].thumb_attachment_url = 'https://forum.byjus.com/wp-content/themes/qaengine/img/default-thumbnail.jpg';
    }
    options = new RequestOptions({
      headers: headers,
      body: JSON.stringify(body),
      method: RequestMethod.Post,
      url: api
    });
    this.http.post(api, JSON.stringify(body), options).subscribe(
      data => {
        swal.fire({
          title: 'Success',
          text: `Post has been Successfully Created`,
          type: 'success',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
        this.router.navigate(['/app/videos'], { relativeTo: this.route });
      },
      error => {
        console.log(error);
        swal.fire({
          title: 'Error',
          text: `Your post creation was not successful`,
          type: 'error',
          confirmButtonText: 'Retry',
          allowOutsideClick: false
        });
        this.notify.error(error.json().error);
      }
    );
  }

  createPost2(Reqbody, id) {
    // let api = this.createPostAPI + this.token;
    if (this.coupon.trim().length) {
      if (this.couponData == 'Coupon code is not valid or expired ') {
          this.coupon = '';
      }
    }
    let api = 'https://app.reeltimecoaching.com/api/v1/posts?auth_token=' + this.auth.token + '&couponCode='+ this.coupon;
    let headers;
    let options;
    let body = {
      post: {
        title: Reqbody.title,
        description: Reqbody.desc,
        duration: Reqbody.time,
        user_posts_attributes:{
          user_attributes: {
                  user_id: id
          }
        },
        images_attributes: [
          {
            attachment_url: Reqbody.videoUrl,
            thumb_attachment_url: ''
          }
        ]
      }
    };
    headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({
      headers: headers,
      body: JSON.stringify(body),
      method: RequestMethod.Post,
      url: api
    });
    this.http.post(api, JSON.stringify(body), options).subscribe(
      data => {
        this.notify.success('Created Post Successfully');
        this.router.navigate(['/app/coaches'], { relativeTo: this.route });
      },
      error => {
        this.notify.error(error.json().error);
      }
    );
  }

  saveCoachBank(obj: any) {
    if (!obj.Fname || !obj.Lname || !obj.dob ||!obj.AcType) {
      this.notify.warning('Enter Details Correctly');
      return;
    }
    let bankCountry = obj.country;
    let Usercurrency = obj.currency;
    let fname = obj.Fname;
    let lname = obj.Lname;
    let yy = (obj.dob.getFullYear()).toString();
    let mm = (obj.dob.getMonth() + 1).toString();
    let dd = (obj.dob.getDate()).toString();
    let acType = obj.AcType;
    let body;
    if (bankCountry === 'US' || bankCountry === 'NZ') {
      if (!obj.accountNo || !obj.routing) {
        this.notify.warning('Enter Credentials Correctly');
        return;
      }
      body = {
        object: 'bank_account',
        country: bankCountry,
        currency: Usercurrency,
        account_number: obj.accountNo,
        routing_number: obj.routing
      };
    } else if (bankCountry ==='AU') {
      if (!obj.accountNo || !obj.routing) {
        this.notify.warning('Enter Credentials Correctly');
        return;
      }
      body = {
        object: 'bank_account',
        country: bankCountry,
        currency: Usercurrency,
        account_number: obj.accountNo,
        routing_number: obj.routing
      };
    } else if (bankCountry === 'SG') {
      if (!obj.accountNo || !obj.bankCode || !obj.branchCode) {
        this.notify.warning('Enter Credentials Correctly');
        return;
      }
      body = {
        object: 'bank_account',
        country: bankCountry,
        currency: Usercurrency,
        account_number: obj.accountNo,
        routing_number: obj.bankCode + obj.branchCode
      };
    } else if (bankCountry==='CA') {
      if (!obj.accountNo || !obj.transitNo || !obj.institueNo) {
        this.notify.warning('Enter Credentials Correctly');
        return;
      }
      body = {
        object: 'bank_account',
        country: bankCountry,
        currency: Usercurrency,
        account_number: obj.accountNo,
        routing_number: obj.transitNo + obj.institueNo
      };
    } else if (bankCountry ==='JP') {
      if (!obj.accountNo || !obj.acName || !obj.bankCode || !obj.branchCode) {
        this.notify.warning('Enter Credentials Correctly');
        return;
      }
      body = {
        object: 'bank_account',
        country: bankCountry,
        currency: Usercurrency,
        account_number: obj.accountNo,
        routing_number: obj.bankCode + obj.branchCode,
        account_holder_name: obj.acName
      };
    } else if (bankCountry==='HK') {
      if (!obj.accountNo || !obj.branchCode || !obj.clearCode) {
        this.notify.warning('Enter Credentials Correctly');
        return;
      }
      let acNo = obj.accountNo;
      acNo = acNo.slice(0,6) + '-' +  acNo.slice(6,9);
      body = {
        object: 'bank_account',
        country: bankCountry,
        currency: Usercurrency,
        account_number: acNo,
        routing_number: obj.branchCode + '-' + obj.clearCode,
      };
    }   else if (bankCountry==='AT' ||bankCountry==='BE' ||bankCountry==='DK' ||bankCountry==='FI'
    || bankCountry==='FR' || bankCountry==='DE' || bankCountry==='GI' || bankCountry==='IE' || bankCountry==='IT'
    || bankCountry==='LU' || bankCountry==='NL' || bankCountry==='NO' || bankCountry==='PT' || bankCountry==='ES'
    || bankCountry==='SE' || bankCountry==='CH'|| bankCountry==='GB') {
      if (!obj.accountNo) {
        this.notify.warning('Enter Credentials Correctly');
        return;
      }
      body = {
        object: 'bank_account',
        country: bankCountry,
        currency: Usercurrency,
        account_number: obj.accountNo
      };
    } else {
      this.notify.error('Error Selecting Country');
    }

    if (!obj.state || !obj.pin || !obj.city || !obj.addLine1) {
      this.notify.warning('Error with Address Fields');
      return;
    }

    let resBody = {
      'payment': {
        'external_account': body,
        'first_name': fname,
        'last_name': lname,
      'type': acType,
      'address': {
        'line1': obj.addLine1,
        'line2': obj.addLine2,
        'city': obj.city,
        'country': bankCountry,
        'state': obj.state,
        'postal_code' : obj.pin
      },
      'dob': {
        'day': dd,
        'month': mm,
        'year': yy
      }
      }
    };

   if (!obj.addline2 || obj.addline2 === '' || (obj.addline2 && obj.addline2.length < 0)) {
    resBody.payment.address['line2'] = 'nil';
  }

    if (bankCountry === 'US' && (obj.ssn || obj.ssn.length > 0)) {
      resBody.payment['ssn'] = obj.ssn;
    }

    let api = this.createAccountForCoach + this.token + this.auth.token;
    let headers;
    let options;
    headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({
      headers: headers,
      body: JSON.stringify(resBody),
      method: RequestMethod.Post,
      url: api
    });
    let saveBankProm = new Promise(
      (res, rej) => {
        this.http.post(api, JSON.stringify(body), options).subscribe(
          data => {
            if (data.json().success) {
              swal.fire({
                title: 'Success',
                text: `Bank Details have been Successfully Saved`,
                type: 'success',
                confirmButtonText: 'Ok',
                allowOutsideClick: false
              });
              this.auth.updateStripe(data.json().stripe_account_id);
              res(true);
            } else {
              swal.fire({
                title: 'Error',
                text: data.json().message + ` Please Re Enter`,
                type: 'error',
                confirmButtonText: 'Ok',
                allowOutsideClick: false
              });
              console.log(data.json().message);
              rej(false);
            }
          },
          error => {
           console.log(error.json());
          }
        );
      }
    );
    return saveBankProm;
  }

  deleteBank() {
    let api = this.deleteBankAccount + this.token + this.auth.token;
    let DelBankProm = new Promise(
      (res, rej) => {
        this.http.delete(api).subscribe(
          data => {
            this.auth.flushBank();
            this.notify.success(data.json().message);
            res();
          },
          error => {
            this.notify.error('Unable to Delete Bank');
            rej();
          }
        );
      }
    );
    return DelBankProm;
  }

  sendDeviceToken(token: any) {
    let api = this.updateTokenAPI + this.auth.token;
    let headers;
    let options;
    let body = {
      'user':
        {
          'device_token': token,
          'device_type': 'web'
        }
    };
    headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: headers, body: JSON.stringify(body), method: RequestMethod.Put, url: api });
    this.http.put(api, JSON.stringify(body), options).subscribe(
      data => {
        if (data.json().code === 200) {
          console.log(data.json().message);
        }
      },
      error => {
        this.notify.error(error.json().error);
        console.log(error.json());
      }
    );
  }

  sendPrivacySettings(push: any, mail: any, text: any) {
    let api = this.privacyChangeAPI + this.auth.token
    + '&push_notification=' + push + '&email_notification=' + mail
    + '&sms_notification=' + text ;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, method: RequestMethod.Put, url: api });
    this.http.put(api, options).subscribe(
      data => {
        if (data.json().code === 200) {
          let temp = {};
          temp['push'] = push;
          temp['text'] = text;
          temp['mail'] = mail;
          this.cookieService.set('privacySettings', JSON.stringify(temp));
          this.notify.success('Privacy setting have been updated from our end');
        }
      },
      error => {
        this.notify.error(error.json().error);
        console.log(error.json());
      }
    );
  }

  comment(id: any, rate: any, comment: any, videoUrl?: any, Cduration?: any) {
    let api = this.commentAPI + id + '/comments?' + this.token + this.auth.token;
    let headers;
    let options;
    let body = {
      rating: 0,
      comment: {
        description: '',
        images_attributes: [
          {
            attachment_url: '',
            thumb_attachment_url: ''
          }
        ]
      }
    };
    headers = new Headers({ 'Content-Type': 'application/json' });
    body.rating = rate;
    body.comment.description = comment;
    if (Cduration && videoUrl) {
      body.comment.images_attributes[0].attachment_url = videoUrl;
      body['duration'] = Cduration;
    }
    options = new RequestOptions({
      headers: headers,
      body: JSON.stringify(body),
      method: RequestMethod.Post,
      url: api
    });
    this.http.post(api, JSON.stringify(body), options).subscribe(
      data => {
        swal.fire({
          title: 'Success',
          text: `You have Successfully Reviewed this Post`,
          type: 'success',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
        this.router.navigate(['/app/inbox'], { relativeTo: this.route });
      },
      error => {
        swal.fire({
          title: 'Error',
          text: `You review was unsuccessful please try again !`,
          type: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
        console.log(error);
      }
    );
  }

  deletePost(id) {
    let api = this.deleteAPI + id + '?' + this.token + this.auth.token;
    let DeletePostProm = new Promise(
      (res, rej) => {
        this.http.delete(api).subscribe(
          data => {
            swal.fire({
              title: 'Success',
              text: `You have Successfully Deleted this Post`,
              type: 'success',
              confirmButtonText: 'Ok',
              allowOutsideClick: false
            });
            this.router.navigate(['/app/videos'], { relativeTo: this.route });
          },
          error => {
            swal.fire({
              title: 'Error',
              text: `Post Deletion Unsuccessful !`,
              type: 'error',
              confirmButtonText: 'Ok',
              allowOutsideClick: false
            });
            console.log(error);
          }
        );
      }
    );
  }

  getCouponDetails (coupon,id) {
    let coupPromise = new Promise(
      (resolve, reject) =>{
        let url = 'https://app.reeltimecoaching.com/api/v1/get_coupon_details?auth_token=' + this.auth.token + '&couponCode=' + coupon + '&user_id='+ id;
        this.http.get(url).subscribe(
          (data) => {
            if(data.json().code === 200) {
              this.couponData = '';
                resolve(data.json());
              } else {
                this.couponData = data.json().coupon_message;
                this.notify.warning('This Coupon Code does not Exist');
                return;
              }
          },
          (error) => {
            this.notify.error('Error Fetching Coupon Code');
            reject(false);
          }
        );
      }
    );
    return coupPromise;

  }
}
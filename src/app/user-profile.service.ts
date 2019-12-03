import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { CookieService } from 'ngx-cookie-service';
import 'rxjs/Rx';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { GetDataService } from './get-data.service';

@Injectable()
export class UserProfileService {
  public imageURL: Subject<any>;
  public baseUrl: any = 'https://app.reeltimecoaching.com/';

  constructor(
    public cookie: CookieService,
    private auth: AuthService,
    private get: GetDataService,
    public http: Http,
    public router: Router,
    public route: ActivatedRoute,
    private notify: ToastrService,
    private cookieService: CookieService
  ) {}

  sportsCategories(): Promise<any> {
    let head = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: head, method: 'get' });
    var url = this.baseUrl + 'api/v1/categories';
    return this.http
      .get(url, options)
      .toPromise()
      .then(data => data.json());
  }

  getProfileInfo(): Promise<any> {
    let head = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: head, method: 'get' });
    var url =
      this.baseUrl +
      'users/' +
      this.getUserId() +
      '?auth_token=' +
      this.getAutToken();
    return this.http
      .get(url, options)
      .toPromise()
      .then(data => data.json());
  }

  getAutToken() {
    return this.auth.token;
  }

  getUserId() {
    return this.cookie.get('id');
  }

  uploadProfile(reqobject): Promise<any> {
    let auth_token = this.getAutToken();
    let head = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE',
      'Access-Control-Allow-Origin': '*'
    });
    let formData = reqobject;
    let options = new RequestOptions({
      headers: head,
      method: 'put',
      body: JSON.stringify(formData)
    });
    var url = this.baseUrl + 'update_profile?auth_token=' + auth_token;
    return this.http
      .put(url, JSON.stringify(formData), options)
      .toPromise()
      .then(
        data => {
          this.notify.success('Profile Updated Successfully');
          if (this.router.url.includes('auth')) {
            this.cookieService.set('userProfile', 'Yes');
            this.cookieService.set('token', auth_token);
            this.cookieService.set('id', data.json().data.user_id);
          }
          this.router.navigate(['/app/videos'], { relativeTo: this.route });
        },
        error => {
          this.notify.error('Error updating Profile');
        }
      );
  }

  uploadfile(file) {
    return this.get
      .getPresignedUrl(file.name)
      .toPromise()
      .then(res => {
        res = JSON.parse(res['_body']);
        const frm = new FormData();
        Object.keys(res['url_fields']).forEach(fkey => {
          frm.append(fkey.toString(), res['url_fields'][fkey]);
        });
        frm.append('file', file, file.name);
        return this.http
          .post(res.url, frm)
          .toPromise()
          .then(
            pres => {
              this.notify.success('Image Upload Successful');
              const pUrl = res.url + '/' + res['url_fields']['key'];
              console.log(pUrl);
              return pUrl;
            },
            err => {
              return Promise.reject(err);
            }
          );
      })
      .catch(error => {
        console.log('File Upload Error', error);
        this.notify.error('Video Upload Not Successful');
        return false;
      });
  }

  getImageURL() {
    return this.imageURL;
  }
}

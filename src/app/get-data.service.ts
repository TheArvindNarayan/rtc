import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from './auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class GetDataService {
  token = '';
  id = '';
  userData: any;
  getUsersAPI = 'https://app.reeltimecoaching.com/users?auth_token=';
  getSpecificCoachAPI = 'https://app.reeltimecoaching.com/select_coach/';
  getPostsAPI = 'https://app.reeltimecoaching.com/api/v1/post_index?auth_token=';
  getInduvidualPostsAPI = 'https://app.reeltimecoaching.com/api/v1/posts/';
  getProfileAPI = 'https://app.reeltimecoaching.com/users/';
  defaultAPI = 'https://app.reeltimecoaching.com/api/v1/sample_video';
  getBankDetailsAPI = 'https://app.reeltimecoaching.com/api/v1/get_account_details?auth_token=';
  hmtvideoAPI = 'https://app.reeltimecoaching.com/api/v1/show_videos_from_hmt?auth_token=';
  presigned = 'https://app.reeltimecoaching.com/api/v1/request_for_presigned_url?auth_token=';
  presignedObj = 'https://app.reeltimecoaching.com/api/v1/request_for_obj_presigned_url?auth_token=';

  public postBody: any;

  constructor(public http: Http, public auth: AuthService,
  private router: Router, private route: ActivatedRoute) {
    // this.token = this.auth.token;
    this.id = this.auth.id;
  }

  getHmt() {
    let api = this.hmtvideoAPI + this.auth.returnToken();
    return this.http.get(api);
  }

  getUsers() {
    let api = this.getUsersAPI + this.auth.token;
    return this.http.get(api);
  }
  getSpecificUser(id: any) {
    let api = 'https://app.reeltimecoaching.com/users/' + id + '?auth_token=' + this.auth.token;
    return this.http.get(api);
  }
  getDefaultVideo() {
    return this.http.get(this.defaultAPI);
  }
  getPosts() {
    let api = this.getPostsAPI + this.auth.token;
    return this.http.get(api);
  }

  getPresignedUrl(filename: any) {
    const api = this.presigned + this.auth.token + '&filename=' + filename;
    return this.http.get(api);
  }

  getPresignedObj(url: any) {
    const api = this.presignedObj + this.auth.token + '&url=' + url;
    return this.http.get(api);
  }

  getInduvidualPost(id: any) {
    let TempAPI = this.getInduvidualPostsAPI + id + '?auth_token=' + this.auth.token;
    return this.http.get(TempAPI);
  }

  getProfile() {
    let tempAPI = this.getProfileAPI + this.id + '?auth_token=' + this.auth.token;
    return this.http.get(tempAPI);
  }

  getSpecificCoach(id: any) {
    let tempAPI = this.getSpecificCoachAPI + id + '?auth_token=' + this.auth.token;
    return this.http.get(tempAPI);
  }
  getBankDetails() {
    let api = this.getBankDetailsAPI + this.auth.token;
    return this.http.get(api);
  }

  storeBody(body: any, id) {
    this.postBody = body;
    if (!id) {
      console.log('No ID to select Coach');
      return;
    }
    this.router.navigate(['/app/checkout/', id], { relativeTo: this.route });
  }

  getCountry() {
    let prom = new Promise((resolve, reject) => {
      this.http.get('https://restcountries.eu/rest/v2/all').subscribe(
        data => {
          resolve(data.json());
        },
        error => {
          reject(error);
        }
      );
    });
    return prom;
  }
  getPlayerPaymentSummary() {
    let url = 'https://app.reeltimecoaching.com/api/v1/player_payment_summary?auth_token=' + this.auth.token;
    return this.http.get(url).map((res: Response) => res.json());
  }
  getCoachPaymentSummary() {
    let url = 'https://app.reeltimecoaching.com/api/v1/coach_payment_summary?auth_token=' + this.auth.token;
    return this.http.get(url).map((res: Response) => res.json());
  }
}

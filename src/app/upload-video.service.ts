import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { ToastrService } from 'ngx-toastr';
import { GetDataService } from './get-data.service';

@Injectable()
export class UploadVideoService {
  videoURL = new Subject();
  uploadPercent: any = '';
  showPercent: any = false;
  constructor(public http: Http,
    public router: Router,
    public route: ActivatedRoute,
    public get: GetDataService,
    private iHttp: HttpClient,
    private notify: ToastrService) {
  }

  uploadVideo(video, id?) {
    this.uploadV(video);
    const route = this.router.url;
    if (route.search('coachReview') > -1) {
      return true;
    }
    if (route.includes('coachProfile')) {
      this.router.navigate(['/app/createPost', id], { relativeTo: this.route });
    } else {
      this.router.navigate(['/app/createPost'], { relativeTo: this.route });
    }
  }

  getVideourl(): Observable<any> {
    return this.videoURL.asObservable();
  }

  uploadV(video) {
    const sze = video.size / 1000000;
    localStorage.setItem('videoSize', sze.toString());
    this.showPercent = true;
    this.get.getPresignedUrl(video.name).subscribe(
      (res) => {
        res = JSON.parse(res['_body']);
        const frm = new FormData();
        Object.keys(res['url_fields']).forEach(
          fkey => {
            frm.append(fkey.toString(), res['url_fields'][fkey]);
          }
        );
        frm.append('file', video, video.name);
        const freq = new HttpRequest('POST', res.url, frm, {
          reportProgress: true,
        });
        this.iHttp.request(freq).subscribe(
          event => {
            if (event.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round(100 * event.loaded / event.total);
              this.uploadPercent = percentDone;
              console.log(`File is ${percentDone}% uploaded.`);
            }
          },
          ferr => {
            if (ferr.status === 200 || ferr.status === 201) {
              const pUrl = res.url + '/' + res['url_fields']['key'];
              this.get.getPresignedObj(pUrl).toPromise().then(
                tRes => {
                  const buff = [];
                  buff.push(pUrl);
                  buff.push(JSON.parse(tRes['_body'])['url']);
                  this.notify.success('Video Upload Successful');
                  this.videoURL.next(buff);
                  this.showPercent = false;
                  this.uploadPercent = 0;
                }
              );
            } else {
            this.notify.error('Video Upload Not Successful');
            console.log('File Upload Error', ferr);
            return false;
            }
          }
        );
      },
      error => {
        console.log('File Upload Error', error);
        this.notify.error('Video Upload Not Successful');
        return false;
      }
    );
  }

}

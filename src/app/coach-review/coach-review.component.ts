import { AuthService } from './../auth.service';
import { UploadVideoService } from './../upload-video.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetDataService } from '../get-data.service';
import { SendDataService } from '../send-data.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';

@Component({
  selector: 'app-coach-review',
  templateUrl: './coach-review.component.html',
  styleUrls: ['./coach-review.component.sass']
})
export class CoachReviewComponent implements OnInit, OnDestroy {
  id: any;
  sub: any;
  post: any;
  rating: any;
  comment: any;
  uploadedVideo: any;
  uploadedURL: any;
  subscription: Subscription;
  sub2: Subscription;
  AttachvideoURL: any = '';
  disableSubmit: any = false;
  ratingScale = [
    { id: 1, value: '1' },
    { id: 2, value: '2' },
    { id: 3, value: '3' },
    { id: 4, value: '4' },
    { id: 5, value: '5' },
    { id: 6, value: '6' },
    { id: 7, value: '7' },
    { id: 8, value: '8' },
    { id: 9, value: '9' },
    { id: 10, value: '10' }
  ];
  @ViewChild('media') Rvideo: any;
  duration: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private send: SendDataService,
    public dataService: GetDataService,
    public videoService: UploadVideoService,
    private auth: AuthService,
    private notfify: ToastrService
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.sub2 = this.videoService.getVideourl().subscribe(data => {
      this.AttachvideoURL = data;
    });
    if (!this.post) {
      this.getPost();
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

  hmtUpdate(hmtvideoURL: any) {
    this.AttachvideoURL = this.uploadedURL = hmtvideoURL;
  }

  getPost() {
    this.dataService.getInduvidualPost(this.id).subscribe(data => {
      this.post = data.json().data;
    });
  }

  uploadVideo(event: any) {
    this.uploadedVideo = event.target.files[0];
    this.uploadedURL = event.target.files[0].name;
    this.videoService.uploadVideo(this.uploadedVideo);
  }

  select(item) {
    if (item === this.rating) {
      this.rating = item;
      this.notfify.warning('You Have Selected same value again');
    } else {
      this.rating = item;
    }
  }
  isActive(item) {
    return this.rating === item;
  }

  postReview() {
    let tempid = this.auth.returnStripeID();
    let time;
    if (tempid.length < 0 || !tempid || tempid === 'null') {
      swal.fire({
        title: 'Payment Error!',
        text: `We couldn't find payment details can you please fill it up ?`,
        type: 'warning',
        confirmButtonText: 'Ok',
        allowOutsideClick: false
      });
      this.router.navigate(['/app/payment'], { relativeTo: this.route });
      return;
    }
    if (!this.rating) {
      this.notfify.error('Please Rate the Video Properly');
      this.disableSubmit = false;
      return;
    }
    if (!this.comment && !this.AttachvideoURL) {
      this.notfify.error('Please Comment or attach video');
      this.disableSubmit = false;
      return;
    }
    if (this.AttachvideoURL) {
      let mm = Math.trunc(this.Rvideo.nativeElement.duration / 60).toString();
      let ss = Math.trunc(this.Rvideo.nativeElement.duration % 60).toString();
      if (mm.length === 1) {
        mm = '0' + mm;
      }
      if (ss.length === 1) {
        ss = '0' + ss;
      }
      if (ss === 'NaN' || mm === 'NaN') {
        setTimeout(() => {
          this.postReview();
        }, 500);
        return;
      } else {
        time = mm + ':' + ss;
      }
    }
    if (this.AttachvideoURL.includes('Amz-C')) {
      this.AttachvideoURL = this.AttachvideoURL.split('?')[0];
    }
    const buff = Array.isArray(this.AttachvideoURL) ? this.AttachvideoURL[0] : this.AttachvideoURL;
    this.send.comment
      (this.post.id, parseInt(this.rating.value), this.comment, buff, time);
    this.disableSubmit = true;
  }
  getCircleImgUrl(url) {
    if (!url) {
      return '/assets/img/default_profile_icon.svg';
    } else {
      url = url.replace('100x100', '500x300');
      return url;
    }
  }

}

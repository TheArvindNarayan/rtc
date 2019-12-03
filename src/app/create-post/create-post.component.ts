import { Router, ActivatedRoute } from '@angular/router';
import { SendDataService } from './../send-data.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UploadVideoService } from './../upload-video.service';
import { Subscription } from 'rxjs/Subscription';
import { GetDataService } from '../get-data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.sass']
})
export class CreatePostComponent implements OnInit, OnDestroy {
  videoURL: any;
  subscription: Subscription;
  title: any;
  desc: any;
  sub2: Subscription;
  id: any;
  coach: any;
  selectCoachAmount: any;
  couponcode: any = '';
  openModal: any = false;
  disableSubmit: any = false;
  @ViewChild('media') video: any;

  constructor(
    public videoData: UploadVideoService,
    public sendpost: SendDataService,
    private router: Router,
    private route: ActivatedRoute,
    private getData: GetDataService,
    private notify: ToastrService
  ) {}

  ngOnInit() {
    this.updateVideo();
    this.sub2 = this.route.params.subscribe(
      params => {
        if (params['id']) {
          this.id = +params['id'];
        this.getData.getSpecificCoach(this.id).subscribe(
          data => {
            this.coach = data.json().data;
          }
        );
        } else {
          return;
        }
      }
    );
  }

  updateVideo() {
    this.subscription = this.videoData.getVideourl().subscribe(data => {
      this.videoURL = data;
      console.log(this.videoURL);
      if (!this.videoURL) {
        this.router.navigate(['/app/videos'], { relativeTo: this.route });
      }
    });
  }

  createPost() {
    this.disableSubmit = true;
    let mm = Math.trunc(this.video.nativeElement.duration / 60).toString();
    let ss = Math.trunc(this.video.nativeElement.duration % 60).toString();
    if (mm.length === 1) {
      mm = '0' + mm;
    }
    if (ss.length === 1) {
      ss = '0' + ss;
    }
    if (ss === 'NaN' || mm === 'NaN') {
      setTimeout(() => {
        this.createPost();
      }, 500);
      return;
    } else {
      let time = mm + ':' + ss;
    if (!this.title || !this.desc) {
      this.notify.warning('Please Describe Post properly');
      this.disableSubmit = false;
      return;
    }
    if (!this.id) {
      this.sendpost.createPost(this.title, this.desc, this.videoURL[0], time);
    } else if (this.id) {
      let body = {
        title: this.title,
        desc: this.desc,
        videoUrl: this.videoURL[0],
        time: time
      };
      this.getData.storeBody(body, this.id);
    }
    }
  }

  cancelPay() {
    this.selectCoachAmount = undefined;
    this.openModal = false;
  }

  showPopup() {
    if (this.id) {
      if (!this.coach['amount']) {
        this.notify.warning('This coach doesnt have a amount');
        return;
      }
      this.openModal = true;
      this.selectCoachAmount = this.coach['amount'];
    } else {
      this.createPost();
    }
  }

  coupon() {
    this.sendpost.couponIn = !this.sendpost.couponIn;
  }
  couponApply(){
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

import { Component, OnInit, ChangeDetectorRef, AfterViewInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { GetDataService } from './../get-data.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadVideoService } from '../upload-video.service';
import { SendDataService } from '../send-data.service';

@Component({
  selector: 'app-hmt',
  templateUrl: './hmt.component.html',
  styleUrls: ['./hmt.component.sass']
})
export class HmtComponent implements OnInit {
  videos: any;
  selectedVideo: any = {};
  @ViewChild('playtrigger') playTrigger: any;
  @Output() videourl = new EventEmitter();

  constructor(public dataService: GetDataService,
    private sendata: SendDataService,
    private router: Router,
    private videoservice: UploadVideoService,
    private notify: ToastrService) { }

  ngOnInit() {
    this.getVideos();
  }

  getVideos() {
    this.dataService.getHmt().subscribe(
      data => {
        let res = data.json().data;
        this.videos = res.attachments;
      },
      error => {
        this.notify.error('Error Loading Posts');
        console.log(error);
      }
    );
  }

  selectVideo(element: any, event: any) {
    if (this.router.url.includes('reeltime-cloud')) {
      this.selectedVideo = element;
      const el: HTMLElement = this.playTrigger.nativeElement as HTMLElement;
      el.click();
    }
    if (event.target.localName != 'button' && event.target.localName != 'i' ) {
      this.videourl.emit(element.attachment_url);
    }
  }

  deletevideo(element: any) {
    let tempindex = this.videos.indexOf(element);
    this.videos.splice(tempindex, 1);
    this.sendata.deletehmt(element.id);
  }

}

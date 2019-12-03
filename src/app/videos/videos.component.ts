import { NotificationService } from './../notification.service';
import { SearchService } from './../search.service';
import { AuthService } from './../auth.service';
import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { GetDataService } from './../get-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/Subscription';
import { trigger,style,transition,animate,keyframes,state } from '@angular/animations';


@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.sass'],
  animations: [
    trigger('slide-in',[
      state('out', style({
        transform: 'translateY(20px)',
        opacity: '0'
      })),
      state('in', style({
        transform: 'translateY(0px)',
        opacity: '1'
      })),
      transition('out => in',
        animate('300ms ease-in', keyframes([
          style({ opacity: 0, offset: 0}),
          style({ opacity: 0.5, offset: 0.5}),
          style({ opacity: 1, offset: 1}),
        ]))),
    ])
  ]
})
export class VideosComponent implements OnInit, AfterViewInit {
  posts: any;
  reviewed: any;
  pending: any;
  showPending = true;
  pendingCount: any = '';
  reviewedCount: any = '';
  unassignedCount: any = '';
  defaultVideo: any;
  searchTerm: any = '';
  sub: Subscription;
  duration: number;
  allData: any;
  animState: any;
  constructor(public dataService: GetDataService,
    private auth: AuthService,
    public router: Router,
    private msging: NotificationService,
    public route: ActivatedRoute,
    private notify: ToastrService,
    private cdref: ChangeDetectorRef,
    private search: SearchService) {
      if (this.auth.userProfile == 'No')  {
        this.notify.warning("Update your profile");
        this.router.navigateByUrl('app/userProfile');
      }
   }

  ngOnInit() {
    this.getVideos();
    this.animState = 'out';
    if (this.auth.role === 'coach') {
      this.router.navigate(['/app/inbox'], { relativeTo: this.route });
    }
    setTimeout(
      () =>  this.msging.msging(),
      5000
    );
  }

  ngAfterViewInit() {
    this.animState = (this.animState === 'in' ? 'out' : 'in');
    this.cdref.detectChanges();
  }

  // onMetadata(e, video) {
  //   this.duration = video.duration;
  //   let x;
  //   if (e.composedPath()[0]) {
  //     x = '1' + e.composedPath()[0]['id'];
  //   } else {
  //     x = '1' + e.path[0]['id'];
  //   }
  //   document.getElementById(x).innerHTML = this.getTimeFormat(this.duration).replace(/m /g, ':').replace(/h/g, '').replace(/s/g, '');
  // }

  // getTimeFormat(t) {
  //   let z = t/86400 ;
  //   return (new Date(t%86400*1000)).toUTCString().replace(/.*(\d{2}):(\d{2}).*/, "$1m $2s");
  // }
  getVideos() {
    this.dataService.getPosts().subscribe(
      data => {
        this.allData = data.json();
        this.reviewed = data.json().data.reviewed_posts;
        this.pending = data.json().data.pending_posts;
        this.pendingCount = data.json().data['pending_count'];
        this.reviewedCount = data.json().data['reviewed_count'];
        this.unassignedCount = data.json().data['unassigned_count'];
        this.posts = this.pending;
        this.sub = this.search.returnSearchTerm().subscribe(
          data => {
            this.searchTerm = data;
          }
        );
      },
      error => {
        this.notify.error('Error Loading Posts');
        console.log(error);
      }
    );
    this.dataService.getDefaultVideo().subscribe(
      data => {
        this.defaultVideo = data.json().data;
      }
    );
  }

  togglePending() {
    this.showPending = true;
    this.posts = this.pending;
  }

  toggleReviewed() {
    this.showPending = false;
    this.posts = this.reviewed;
  }


  selectedVideo(elem: any) {
    this.router.navigate(['/app/selectedVideo', elem.id]);
  }
  getThumbImgUrl(url){
    if (!url){
      return '/assets/img/mdlandscape_default_icon.svg';
  }else{
     url = url.replace("100x100", "430x150");
      return url;
  }
  }

  getCircleImgUrl(url){
    if (!url || url === null){
      return '/assets/img/default_profile_icon.svg';
  }else{
     url = url.replace(/ /g,"%20").replace("100x100", "500x300");
      return url;
  }
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs/Subscription';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-coach-posts',
  templateUrl: './coach-posts.component.html',
  styleUrls: ['./coach-posts.component.sass']
})
export class CoachPostsComponent implements OnInit, OnDestroy {
  posts: any;
  reviewed: any;
  pending: any;
  showPending = true;
  searchTerm: any;
  sub: Subscription;
  allData: any = '';

  pendingCount: any = '';
  reviewedCount: any = '';
  duration: number;
  constructor(private postservice: GetDataService,
    private msging: NotificationService,
    private search: SearchService,
  private router: Router) { }

  ngOnInit() {
    this.getPosts();
    setTimeout(
      () =>  this.msging.msging(),
      5000
    );
  }

  getPosts() {
    this.postservice.getPosts().subscribe(
      data => {
        this.allData = data.json();
        this.reviewed = this.allData.data.reviewed_posts;
        this.pending = this.allData.data.pending_posts;
        this.reviewedCount = this.allData.data['reviewed_count'];
        this.pendingCount = this.allData.data.pending_count;
        this.posts = this.pending;
        console.log(this.reviewed);
        this.sub = this.search.returnSearchTerm().subscribe(
          data => {
            this.searchTerm = data;
          }
        );
      }
    );
  }

  // onMetadata(e, video) {
  //   this.duration = video.duration
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


  togglePending() {
    this.showPending = true;
    this.posts = this.pending;
  }

  toggleReviewed() {
    this.showPending = false;
    this.posts = this.reviewed;
  }

  selected(elem) {
    this.router.navigate(['/app/coachReview', elem.id]);
  }
  getCircleImgUrl(url){
    if (!url){
      return '/assets/img/default_profile_icon.svg';
  }else{
      return url;
  }
}
getThumbImgUrl(url){
  if (!url){
    return '/assets/img/mdlandscape_default_icon.svg';
}else{
  url = encodeURI(url);
    return url;
}
}
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

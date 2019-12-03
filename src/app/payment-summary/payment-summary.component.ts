import { Component, OnInit } from '@angular/core';
import { GetDataService} from '../get-data.service';
import {Router, ActivatedRoute} from '@angular/router';
import { SearchService } from './../search.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.sass']
})
export class PaymentSummaryComponent implements OnInit {

  constructor(private getDataService: GetDataService, private route: ActivatedRoute, private router: Router,
  private search: SearchService) { }
  total_amt = '$0';
  posts: any = [];
  route_param: any = '';
  sub: Subscription;
  searchTerm: any = '';
  ngOnInit() {
    // console.log(this.route.snapshot.paramMap.get('role'));
    this.route_param = this.route.snapshot.paramMap.get('role');
    if (this.route.snapshot.paramMap.get('role') != 'coach') {
      this.getDataService.getPlayerPaymentSummary().subscribe(data => {
        this.total_amt = data.data.total_amount;
        this.posts = data.data.posts;
        this.sub = this.search.returnSearchTerm().subscribe(
          data => {
            this.searchTerm = data;
          }
        );
      });
    } else {
      this.getDataService.getCoachPaymentSummary().subscribe(data => {
        this.total_amt = data.data.total_amount;
        this.posts = data.data.posts;
        this.sub = this.search.returnSearchTerm().subscribe(
          data => {
            this.searchTerm = data;
          }
        );
      });
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
  reDirectToPost(id){
    if (this.route_param == 'player') {
      this.router.navigateByUrl('/app/selectedVideo/' + id);
    } else {
      this.router.navigateByUrl('/app/coachReview/' + id);
    }
  }

}

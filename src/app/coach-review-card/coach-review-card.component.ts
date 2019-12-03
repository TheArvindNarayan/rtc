import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-coach-review-card',
  templateUrl: './coach-review-card.component.html',
  styleUrls: ['./coach-review-card.component.sass']
})
export class CoachReviewCardComponent implements OnInit {
  @Input() post?: any;
  constructor() { }

  ngOnInit() {
  }

  getCountryFlag(country) {
    if (country) {
      return 'https://www.geonames.org/flags/x/' + country.toLowerCase() + '.gif';
    } else {
      return 'assets/img/noFlag/svg';
    }
  }

  getCircleImgUrl(url){
    if (!url){
      return '/assets/img/default_profile_icon.svg';
  }else{
     url = url.replace("100x100", "500x300");
      return url;
  }
}

}

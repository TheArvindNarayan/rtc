import { Component, OnInit, Input } from '@angular/core';
import { SendDataService } from '../send-data.service';

@Component({
  selector: 'app-vod-card',
  templateUrl: './vod-card.component.html',
  styleUrls: ['./vod-card.component.sass']
})
export class VodCardComponent implements OnInit {
  @Input() post?: any;
  constructor(private sendData: SendDataService) { }

  ngOnInit() {
  }

  deletePost() {
    this.sendData.deletePost(this.post.id);
  }

  getCircleImgUrl(url) {
    if (!url) {
      return '/assets/img/default_profile_icon.svg';
    } else {
      url = url.replace(/ /g, '%20').replace('100x100', '500x300');
      return url;
    }
  }

}

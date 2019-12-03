import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetDataService } from './../get-data.service';

@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.sass']
})
export class PlayerProfileComponent implements OnInit {

  sub: any;
  id: any;
  playerProfile: any;
  age: any = '';
  gender: any = '';

  constructor(private route: ActivatedRoute, private router: Router,
  public dataService: GetDataService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(
      params => {
        this.id = +params['id'];
      }
    );

    this.getPlayerData(this.id);
  }

  getPlayerData(id: any) {
    this.dataService.getSpecificUser(id).subscribe(
      data => {
        this.playerProfile = data.json().data;
      },
      error => {
        console.log(error);
      }
    );
  }

  getCircleImgUrl(url){
    if (!url || url === null){
      return '/assets/img/default_profile_icon.svg';
  }else{
     url = url.replace(/ /g,"%20").replace("100x100", "500x300");
      return url;
  }
  }

  selected(elem) {
    this.router.navigate(['/app/coachReview', elem.post.id], { relativeTo: this.route });
  }

  getAge(x) {
    let date: any = new Date(x['dob']);
    this.gender =  x.gender? x.gender :'none';
    if(x['dob']){
      let timeDiff = Math.abs(Date.now() - date);
      this.age = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
     return this.age ;
  }
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.sass']
})
export class PlayersComponent implements OnInit, OnDestroy {

  player: any;
  searchTerm: any;
  sub: Subscription;
  age: any = '';
  gender: any = '';

  constructor(public dataService: GetDataService,
  private router: Router,
    private search: SearchService) { }

  ngOnInit() {
    if (!this.player) {
      this.getPlayerData();
    }
    this.sub = this.search.returnSearchTerm().subscribe(
      data => {
        this.searchTerm = data;
      }
    );
  }

  selectPlayer(elem: any) {
    this.router.navigate(['/app/playerProfile', elem.id]);
  }

  getAge(x) {
    let date: any = new Date(x['user_profile']['dob']);
    this.gender =  x.user_profile.gender? x.user_profile.gender :'none';
    if(x['user_profile']['dob']){
      let timeDiff = Math.abs(Date.now() - date);
      this.age = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
     return this.age + ' years old, ' + this.gender;
  }
  }

  getPlayerData() {
    this.dataService.getUsers().subscribe(
      data => {
        this.player = data.json().data.users;
      }
    );
  }
  getThumbImgUrl(url){
    if (!url){
      return '/assets/img/default_profile_icon.svg';
  }else{
     url = url.replace("100x100", "500x300");
      return url;
  }
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }


}

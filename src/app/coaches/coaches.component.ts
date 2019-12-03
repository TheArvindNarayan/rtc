import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy, Input,ChangeDetectorRef, AfterViewInit  } from '@angular/core';
import { GetDataService } from './../get-data.service';
import { SendDataService } from './../send-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { trigger,style,transition,animate,keyframes,state } from '@angular/animations';

@Component({
  selector: 'app-coaches',
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.sass'],
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
export class CoachesComponent implements OnInit, OnDestroy, AfterViewInit {
  coaches: any;
  favCoaches: any;
  allCoaches: any;
  showFav = false;
  searchTerm: any;
  sub: Subscription;
  selectedVideoId: any;
  animState: any = 'out';
  @Input() id: any;

  selectCoachAmount = 0;
  selectedCoachId: any;
  constructor(public dataService: GetDataService,
    public router: Router,
    public route: ActivatedRoute,
    private auth: AuthService,
    public sendData: SendDataService,
    private search: SearchService,
    private cdref: ChangeDetectorRef,
    private notify: ToastrService
  ) {
    if (this.auth.userProfile == 'No')  {
      this.notify.warning("Update your profile");
      this.router.navigateByUrl('app/userProfile');
    }
   }

  ngOnInit() {
    if (!this.coaches) {
      this.getCoachData();
    }

    if (this.auth.role === 'coach') {
      this.router.navigate(['/app/inbox'], { relativeTo: this.route });
    }
    this.sub = this.search.returnSearchTerm().subscribe(
      data => {
        this.searchTerm = data;
      }
    );

    this.sub = this.route.params.subscribe(
      params => {
        this.selectedVideoId = +params['id'];
      }
    );

  }

  ngAfterViewInit() {
    this.animState = 'in';
    this.cdref.detectChanges();
  }

  getCircleImgUrl(url){
    if (!url){
      return '/assets/img/default_profile_icon.svg';
  }else{
     url = url.replace(/ /g,"%20").replace("100x100", "500x300");
      return url;
  }
  }

  selectCoach(elem: any) {
    if (this.router.url.includes('coach')) {
      this.router.navigate(['/app/coachProfile', elem.id]);
    }
    window.scrollTo(0, -100);
    let url = this.router.url;
    if (url.includes('selectedVideo')) {
    //   if (!elem.amount) {
    //     console.log('This elem doesnt have a amount');
    //     return;
    //   }
    //   if (this.auth.stripeCustomerID.length < 1 || this.auth.stripeCustomerID === 'null'
    // || !this.auth.stripeCustomerID || this.auth.stripeCustomerID === null) {
    //     swal.fire({
    //       title: 'Payment Error!',
    //       text: `We couldn't find payment details can you please fill it up ?`,
    //       type: 'warning',
    //       confirmButtonText: 'Ok',
    //       allowOutsideClick: false
    //     });
    //     this.router.navigate(['/app/payment'], { relativeTo: this.route });
    //     return;
    //   }
      this.selectedCoachId = elem.id;
      this.router.navigate(['/app/checkout', elem.id, this.selectedVideoId], { relativeTo: this.route });
    }
  }

  setFav(elem: any, e) {
    this.sendData.setFav(elem.id);
    let i = this.coaches.indexOf(elem);
    if (this.coaches[i].favors === 1) {
      this.coaches[i].favors = 0;
    } else {
      this.coaches[i].favors = 1;
    }
    if (this.showFav) {
      this.toggleFav();
    }
    e.stopPropagation();
    document.getElementById('favorite').addEventListener('click',function (event){
      event.stopPropagation();
      return false;
   });
  }

  getCoachData() {
        this.dataService.getUsers().subscribe(
          data => {
            this.allCoaches = data.json().data.users;
            this.coaches = this.allCoaches;
          },
          error => {
            this.notify.error('Unable to load Coaches');
            console.log(error);
          }
        );
  }

  toggleAll() {
    this.showFav = false;
    this.coaches = this.allCoaches;
  }

  toggleFav() {
    this.showFav = true;
    let fav = this.coaches.filter(
      coach => {
        return coach.favors > 0;
      }
    );
    this.coaches = fav;
  }

  ngOnDestroy() {
  }

  getThumbImgUrl(url){
    if (!url){
      return '/assets/img/default_profile_icon.svg';
  }else{
      return url;
  }
  }

  getBadgeUrl(url){
    if (!url || url === null){
      return '/assets/img/noFlag.svg';
  }else{
    url = encodeURI(url);
      return url;
  }
  }

  getCountryFlag(country) {
    if (country) {
      // https://www.geonames.org/flags/x/us.gif
      return 'https://www.geonames.org/flags/x/' + country.toLowerCase() + '.gif';
    } else {
      return 'assets/img/noFlag/svg';
    }
  }

}

import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../auth.service';
import { SendDataService } from './../send-data.service';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { GetDataService } from './../get-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';

declare var $ : any;
@Component({
  selector: 'app-selected-video',
  templateUrl: './selected-video.component.html',
  styleUrls: ['./selected-video.component.sass']
})
export class SelectedVideoComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('videoPlayer') videoplayer: any;

  id: any;
  post: any;
  coaches: any;
  videoURL: '';
  sub: any;
  selectCoachAmount = 0;
  selectedCoachId: any;
  stripeID: any;

  constructor(private route: ActivatedRoute, private router: Router,
    public dataService: GetDataService, private auth: AuthService,
  private send: SendDataService, private notify: ToastrService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(
      params => {
        this.id = +params['id'];
      }
    );
    if (!this.coaches) {
      this.getCoachData();
    }
    this.stripeID = this.auth.stripeCustomerID;
  }

  selectCoach(coach: any) {
    // if (this.stripeID.length < 1 || this.stripeID === null || this.stripeID === 'null') {
    //   swal.fire({
    //     title: 'Payment Error!',
    //     text: `We couldn't find payment details can you please fill it up ?`,
    //     type: 'warning',
    //     confirmButtonText: 'Ok',
    //     allowOutsideClick: false
    //   });
    //   this.router.navigate(['/app/payment'], { relativeTo: this.route });
    //   return;
    // }
    this.router.navigate(['/app/checkout', coach.id, this.id], { relativeTo: this.route });
  }

  ngAfterViewInit() {
    if (!this.post) {
      this.getVideos();
    }
  }

  getVideos() {
    this.dataService.getInduvidualPost(this.id).subscribe(
      data => {
        this.post = data.json().data;
      }
    );
  }

  getCoachData() {
    this.dataService.getUsers().subscribe(
      data => {
        this.coaches = data.json().data.users;
      }
    );
  }

  getBadgeUrl(url){
    if (!url || url === null){
      return '/assets/img/noFlag.svg';
  }else{
      return url;
  }
  }

  getCountryFlag(country) {
    if (country) {
      return 'https://www.geonames.org/flags/x/' + country.toLowerCase() + '.gif';
    } else {
      return 'assets/img/noFlag/svg';
    }
  }

  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    // this.modal.hide();
    $('#allCoaches').modal('hide');
    $(document.body).removeClass("modal-open");
    $(".modal-backdrop").remove();
  }

  getCircleImgUrl(url) {
    if (!url) {
      return '/assets/img/default_profile_icon.svg';
    } else {
      url =url.replace(/ /g,"%20").replace("100x100", "500x300");
      return url;
      
    }
  }

}

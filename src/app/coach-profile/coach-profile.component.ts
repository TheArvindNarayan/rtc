import { ToastrService } from 'ngx-toastr';
import { UploadVideoService } from './../upload-video.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { AuthService } from '../auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-coach-profile',
  templateUrl: './coach-profile.component.html',
  styleUrls: ['./coach-profile.component.sass']
})
export class CoachProfileComponent implements OnInit {
  sub: Subscription;
  id: any;
  coachProfile: any;
  selectedVideo: any;
  stripeID: any;

  constructor(
    private route: ActivatedRoute,
    private uploadVideo: UploadVideoService,
    private auth: AuthService,
    private router: Router,
    private getData: GetDataService,
    private notify: ToastrService
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.getCoachDetail(this.id);
    });
    this.stripeID = this.auth.stripeCustomerID;
  }

  getCoachDetail(id: any) {
    if (id === NaN) {
      return;
    }
    this.getData.getSpecificCoach(id).subscribe(data => {
      this.coachProfile = data.json().data;
    });
  }

  getThumbImgUrl(url) {
    if (!url) {
      return '/assets/img/default_profile_icon.svg';
    } else {
      return url;
    }
  }

  videoUpload(event) {
    // if (
    //   !this.stripeID ||
    //   this.stripeID.length < 1 ||
    //   this.stripeID === null ||
    //   this.stripeID === 'null'
    // ) {
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
    this.selectedVideo = event.target.files[0];
    this.uploadVideo.uploadVideo(this.selectedVideo, this.id);
  }

  getBadgeUrl(url) {
    if (!url || url === null) {
      return '/assets/img/noFlag.svg';
    } else {
      return url;
    }
  }

  getCircleImgUrl(url) {
    if (!url || url === null) {
      return '/assets/img/default_profile_icon.svg';
    } else {
      url = url.replace(/ /g, '%20').replace('100x100', '500x300');
      return url;
    }
  }

  getCountryFlag(country) {
    if (country && country.length < 4) {
      return (
        'https://www.geonames.org/flags/x/' + country.toLowerCase() + '.gif'
      );
    } else {
      return 'assets/img/noFlag/svg';
    }
  }
}

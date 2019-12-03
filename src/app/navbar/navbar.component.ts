import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UploadVideoService } from './../upload-video.service';
import { AuthService } from './../auth.service';
import { UserProfileService } from '../user-profile.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {
  selectedVideo: any;
  role = '';
  public playerImagePath: any = '';
  userName: any = '';
  searchTerm: any = '';

  constructor(
    private uploadVideo: UploadVideoService,
    private auth: AuthService,
    public userProfile: UserProfileService,
    private searchService: SearchService,
    public router: Router
  ) {
    this.router.events.subscribe(
      data => {
        this.searchTerm = '';
      }
    );
  }

  ngOnInit() {
    this.role = this.auth.role;
    this.userProfile.getProfileInfo().then(data => {
      this.playerImagePath = data.data.attachment_url;
      this.userName = data['data']['name'];
    },
  error => {
    console.log('Failed to load profile image');
  });
  }

  videoUpload(event) {
    this.selectedVideo = event.target.files[0];
    this.uploadVideo.uploadVideo(this.selectedVideo);
    event.target.value = '';
  }

  search() {
    if (this.searchTerm.length >= 0) {
      this.searchService.search(this.searchTerm);
    }
  }

  logout() {
    this.auth.logout();
  }
}

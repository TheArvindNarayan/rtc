import { GetDataService } from './../get-data.service';
import { AuthService } from './../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { MatDatepickerInputEvent } from '@angular/material';

import 'rxjs/add/operator/map';
import { UserProfileService } from '../user-profile.service';
import { SendDataService } from '../send-data.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass']
})
export class UserProfileComponent implements OnInit {
  public data: any = [];
  public category: any;
  profile: any;
  date: any = new Date();
  showPlaceHolder: boolean = true;
  public isNoProfilePic: boolean = false;
  dd: any;
  mm: any;
  yyyy: any;
  dob: any;
  playerName: any;
  public playerGender: any = 'Select Your Gender';
  public playerImagePath: any;
  playerImagePathBuff: any;
  fileName: any;
  public s3URL: any;
  public categoryId: any;
  public imageURL: any;
  public userSelectedCategories: any = [];
  country: any;
  phoneNumber: any;
  countryList: any;
  phoneCode: any;
  city: any;
  state: any;
  about: any;
  fav_team: any;
  position: any;
  experience: number;
  role: any;

  photoUploadStatus: any;
  profileData: any;

  itemList = [];
  selectedItems = [];
  settings = {};
  categoryItemSelect = [];

  today = new Date();
  Fdob: any;

  minDate = new Date(1960, 0, 1);
  maxDate = new Date(this.today.getFullYear() - 13, this.today.getMonth() , this.today.getDate());

  constructor(private http: Http, private userProfile: UserProfileService,
    public auth_Service: AuthService, private sendData: SendDataService,
    private getData: GetDataService, private router: Router, private route: ActivatedRoute,
    private notify: ToastrService, private _zone: NgZone) {
  }

  ngOnInit() {
    this.categories();
    this.getData.getCountry().then(
      (resolve) => {
        this.countryList = resolve;
        this.getProfileInfo();
      },
      reject => {
        console.log(reject);
        return;
      }
    );
    this.role = this.auth_Service.role;
    this.itemList = [
      { 'id': 1, 'itemName': 'India' },
      { 'id': 2, 'itemName': 'Singapore' },
      { 'id': 3, 'itemName': 'Australia' },
      { 'id': 4, 'itemName': 'Canada' },
      { 'id': 5, 'itemName': 'South Korea' },
      { 'id': 6, 'itemName': 'Brazil' },
      { 'id': 7, 'itemName': 'China' }
    ];

    this.settings = {
      text: 'Select Your Sports',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      limitSelection: this.itemList.length,
    };
    this.categoryItemSelect = [];
  }

  selectCategory(m, id) {
    this.category = m;
    this.categoryId = id;
    this.showPlaceHolder = false;
  }

  dobEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    let d = event.value;
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    this.Fdob =  `${day}-${month}-${year}`;
  }

  updateFdob(d) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    this.Fdob =  `${day}-${month}-${year}`;
  }

  updatePhoneCode(code: any) {
    if (this.countryList.length > 0) {
      let tempCountry = this.countryList.filter(
        country => {
          return country.alpha2Code === code;
        }
      );
      this.phoneCode = '+' + tempCountry[0].callingCodes[0];
    }
  }


  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      let size = event.target.files[0].size;
      // if (size > 500000) {
      //   this.notify.warning('File Size should be less than 5 MB. You have uploaded size of ' + Math.round(size / 100000) + ' MB');
      //   return;
      // }
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.playerImagePath = reader.result;
        this.isNoProfilePic = true;
        this.fileName = file.name;
        this.photoUploadStatus = 'uploading';
        this.userProfile.uploadfile(file).then(
          ires => {
            this.photoUploadStatus = undefined;
            this.playerImagePathBuff = ires;
          }
        ).catch(
          err => {
            this.photoUploadStatus = undefined;
            this.playerImagePath = this.profileData.attachment_url;
            this.playerImagePathBuff = this.profileData.attachment_url;
            this.notify.error('Error Uploading Photo');
          }
        );
      };
    }
  }
  checkItem() {
    let count = 0;
    this.categoryItemSelect.forEach((element, i) => {
      if (element._destroy) {
        count++;
      }
    });
    return count == this.categoryItemSelect.length;
  }

  updateProfile() {
    if (!this.playerName) {
      this.notify.warning('Player Name is must');
      return;
    } else if (!this.categoryItemSelect.length || this.checkItem()) {
      this.notify.warning('Sport is must');
      return;
    } else if (!this.playerGender) {
      this.notify.warning('Gender is must');
      return;
    } else if (this.dob === "Invalid Date" || !this.Fdob ) {
      this.notify.warning('Date of Birth is mandatory');
      return;
    } else if (!this.playerImagePath) {
      this.notify.warning('Image is mandatory');
      return;
    } else if (!this.phoneNumber || (this.phoneNumber && this.phoneNumber.length < 8)) {
      this.notify.warning('Phone Number is invalid');
    } else if ((!this.country ) && this.role === 'player') {
      this.notify.warning('Country is Mandatory');
      return;
    } else if ((!this.city || !this.country || !this.state || !this.about ||
      !this.fav_team || !this.experience || !this.position) && this.role === 'coach') {
      this.notify.warning('Please Fill Details Properly');
      return;
    }
    else {
      let req = {};
      if (!this.playerImagePathBuff) {
        this.playerImagePathBuff = this.playerImagePath;
      }
      const buff = this.playerImagePathBuff.split('?');
      this.playerImagePathBuff = buff[0];
      if (this.role === 'coach') {
        req = {
          'user': {
            'user_profile_attributes': {
              'name': this.playerName,
              'dob': this.Fdob,
              'gender': this.playerGender,
              'image_attributes': {
                'attachment_url': this.playerImagePathBuff,
                'thumb_attachment_url': this.playerImagePathBuff
              }
            },
            'categories_user_attributes': this.categoryItemSelect,
            'coach_attributes': {
              'country': this.country,
              'city': this.city,
              'state': this.state,
              'about': this.about,
              'fav_team': this.fav_team,
              'position': this.position,
              'experience': this.experience,
              'phone': this.phoneNumber,
              'calling_id': this.phoneCode
            }
          }
        };
      } else {
        if (!this.country) {
          this.country = 'United States of America';
        }
        req = {
          'user': {
            'user_profile_attributes': {
              'name': this.playerName,
              'dob': this.Fdob,
              'gender': this.playerGender,
              'image_attributes': {
                'attachment_url': this.playerImagePathBuff,
                'thumb_attachment_url': this.playerImagePathBuff
              }
            },
            'categories_user_attributes': this.categoryItemSelect,
            'player_attributes': {
              'phone': this.phoneNumber,
              'country': this.country,
              'calling_id': this.phoneCode
            }
          }
        };
      }
      if (this.photoUploadStatus === 'uploading') {
        this.notify.warning('Profile Photo is still uploading');
        return;
      }
      this.userProfile.uploadProfile(req).then(data => {
      },
        error => {
          this.notify.error('Error Profile Update');
        });
    }
  }

  categories() {
    this.userProfile.sportsCategories()
      .then(
        data => {
          let cat = data.data.categories;
          this.itemList = [];
          cat.forEach(element => {
            this.itemList.push({ 'id': element.id, 'itemName': element.name });
          })
        }
      )
  }

  getProfileInfo() {
    if (this.router.url.toLowerCase().includes('auth')) {
      this.country = 'US';
      this.phoneCode = '+1';
      return;
    }  else {
      this.userProfile.getProfileInfo()
      .then(
        data => {
          this.profile = data.data;
          this.playerName = data.data.name;
          this.dob = new Date(data.data.dob);
          this.updateFdob(this.dob);
          this.playerGender = data.data.gender.toLowerCase();
          this.playerImagePath = data.data.attachment_url;
          this.userSelectedCategories = [];
          this.phoneNumber = data.data.phone;
          this.userSelectedCategories = data.data.categories;
          this.selectedItems = [];
          this.country = data.data.country;
          this.phoneCode = data.data.calling_id;
          this.userSelectedCategories.forEach(element => {
            this.selectedItems.push({ 'id': element.category_id, 'itemName': element.name });
            this.categoryItemSelect.push({ 'category_id': element.category_id, 'id': element.id, 'url': element.attachment_url });
          });
          if (this.role === 'coach') {
            this.state = data.data.state;
            this.city = data.data.city;
            this.about = data.data.about;
            this.fav_team = data.data.fav_team;
            this.position = data.data.position;
            this.experience = data.data.experience;
          }
          if (!data.data.gender) {
            this.playerGender = 'Select Your Gender';
          }
          if (!data.data.attachment_url) {
            this.isNoProfilePic = false;
          } else {
            this.isNoProfilePic = true;
          }
        },
        error => {
          this.notify.error('Error Fetching User Data');
          this.router.navigate(['/login'], { relativeTo: this.route });
          console.log(error);
        }
      );
    }
  }

  onItemSelect(item: any) {
    if (this.checkItemExistsTemp(item)) {
      //don't push
    } else {
      this.categoryItemSelect.push({
        'category_id': item.id
      });
    }
  }

  OnItemDeSelect(item: any) {
    this.categoryItemSelect.forEach((element, index) => {
      if (item.id === element.category_id) {
        if (this.checkItemExists(item)) {
          element._destroy = 1;
        } else {
          this.categoryItemSelect.splice(index, 1);
        }
      }
    });
  }

  checkItemExists(item) {
    let exists = false;
    this.userSelectedCategories.forEach(element => {
      if (element.category_id === item.id) {
        exists = true;
      }
    });
    return exists;
  }

  checkItemExistsTemp(item) {
    let exists = false;
    this.categoryItemSelect.forEach(element => {
      if (element.category_id === item.id) {
        if (element._destroy) {
          // element._destroy = 0;
          delete element._destroy
          exists = true;
        } else {
          exists = true;
        }
      }
    });
    return exists;
  }
  onSelectAll(items: any) {
    items.forEach(element => {
      if (this.checkItemExistsTemp(element)) {
      } else {
        this.categoryItemSelect.push({
          'category_id': element.id
        });
      }
    });
  }

  onDeSelectAll(items: any) {
    this.categoryItemSelect = [];
  }

  onlyNum(event) {
    const pattern = /^[0-9]$/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  getThumbImgUrl(url) {
    if (!url) {
      return '/assets/img/default_profile_icon.svg';
    } else {
      return url;
    }
  }

  onlyAlpha(event) {
    const pattern = /^[a-zA-Z ]*$/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }

  }
  checkClick() {
    $('.c-remove').click(function (element) {
      // console.log('hey', element);
      // here you could use "this" to get the DOM element that was clicked.
    });
  }
}

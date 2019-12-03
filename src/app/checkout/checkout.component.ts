import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../auth.service';
import { SendDataService } from './../send-data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GetDataService } from './../get-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.sass']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('successSwal') private successSwal: SwalComponent;
  @ViewChild('failSwal') private failSwal: SwalComponent;
  sub: any;
  coachid: any;
  postid: any;
  coach: any;
  postbody: any;
  grandTotal: any;
  coachAmount: any;
  discountAmount: any;
  discountedAmount: any;
  diablesubmit: any = false;
  couponcode: any = '';
  res: any = '';
  rej: any= '';
  stripeID: any;

  constructor(private route: ActivatedRoute, private router: Router,
    private location: Location, private auth: AuthService,
    public getData: GetDataService, private sendData: SendDataService, private notify: ToastrService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(
      params => {
        this.coachid = +params['cid'];
        if (+params['pid']) {
          this.postid = +params['pid'];
        }
        this.getData.getSpecificCoach(this.coachid).subscribe(
          data => {
            this.coach = data.json().data;
            this.coachAmount = '$' + this.coach.amount;
            this.grandTotal = '$' + this.coach.amount;
          }
        );
      }
    );
    this.stripeID = this.auth.stripeCustomerID;
    if (this.coachid && !this.postid) {
      this.postbody = this.getData.postBody;
    }
  }

  couponApply() {
    if (this.couponcode && this.couponcode.length > 0) {
      if (this.couponcode.trim().length) {
        this.sendData.coupon = this.couponcode;
        let temp = this.sendData.getCouponDetails(this.couponcode, this.coachid);
        temp.then(
          (resolve) => {
            if (resolve) {
              this.grandTotal = resolve['final_amount'];
              this.discountAmount = resolve['discount_amount'];
            }
          }
        );
      }
    } else if (!this.couponcode || this.couponcode.length < 1) {
      this.notify.warning('Please enter the Coupon Code');
      return;
    }
  }

  cancel() {
    if (this.coachid && !this.postid) {
      this.routeTo();
        } else {
      this.location.back();
    }
  }

  selectCoach() {
     if (!this.coach.amount) {
      console.log('This coach doesnt have a amount');
      return;
    }
    let dum = parseInt(this.grandTotal.slice(1), 10)
    if (dum > 0 && (this.stripeID.length < 1 || this.stripeID === null || this.stripeID === 'null')) {
      swal.fire({
            title: 'Ready to upload your next video ?',
            text: `Please enter your voucher or payment info to continue`,
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
          return;
    }
    if (this.postid && this.coachid) {
      this.diablesubmit = true;
      let prom = this.sendData.selectCoach(this.coachid, this.postid);
      prom.then(
        (res) => {
          this.res = res + 'Want to Proceed';
          swal.fire({
            title: 'Thank you for submitting your video!',
            text: `${this.coach.name} will review your submission and respond with feedback as soon as possible.`,
            type: 'success',
            confirmButtonText: 'OK',
            allowOutsideClick: false
          });
          this.routeTo();
        },
        (rej) => {
          swal.fire({
            title: 'Select Coach Failure',
            text: `Your Selection For ${this.coach.name} has failed`,
            type: 'error',
            confirmButtonText: 'OK',
            allowOutsideClick: false
          });
          this.diablesubmit = false;
          console.log(rej);
        }
      );
    }
    if (this.coachid && !this.postid) {
      this.diablesubmit = true;
      this.sendData.createPost2(this.postbody, this.coachid);
    }
  }

  routeTo() {
    this.router.navigate(['/app/coaches'], { relativeTo: this.route });
  }

  warnSwal() {
    this.routeTo();
  }

}

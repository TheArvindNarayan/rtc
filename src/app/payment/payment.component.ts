import { GetDataService } from './../get-data.service';
import { AuthService } from './../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit,  NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { MatDatepickerInputEvent } from '@angular/material';

import 'rxjs/add/operator/map';
import { UserProfileService } from '../user-profile.service';
import { SendDataService } from '../send-data.service';
import swal from 'sweetalert2';

declare var $: any;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.sass']
})
export class PaymentComponent implements OnInit {

  cardName: any = '';
  cardNumber: any;
  cardDateMonth: any;
  cardDateYear: any;
  cardCVV: any;
  message: any;
  stripeImg: any = 'card-placement fa fa-credit-card';

  dob: Date;

  cardPattern: any = [
    { 'AmexCard': '^3[47][0-9]{13}$' },
    { 'BCGlobal': '^(6541|6556)[0-9]{12}$' },
    { 'CarteBlanche Card': '^389[0-9]{11}$' },
    { 'DinersClub Card': '^3(?:0[0-5]|[68][0-9])[0-9]{11}$' },
    { 'DiscoverCard': '^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$' },
    { 'InstaPaymentCard': '^63[7-9][0-9]{13}$' },
    
    { 'JCBCard': '(^3[0-9]{15}$)|(^(2131|1800)[0-9]{11}$)' },
    { 'KoreanLocalCard': '^9[0-9]{15}$' },
    { 'LaserCard': '^(6304|6706|6709|6771)[0-9]{12,15}$' },
    { 'MaestroCard': '^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$' },
    
    { 'Mastercard': '(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}' },
    { 'SoloCard': '^(6334|6767)[0-9]{12}|(6334|6767)[0-9]{14}|(6334|6767)[0-9]{15}$' },
    { 'SwitchCard': '^(4903|4905|4911|4936|6333|6759)[0-9]{12}|(4903|4905|4911|4936|6333|6759)[0-9]{14}|(4903|4905|4911|4936|6333|6759)[0-9]{15}|564182[0-9]{10}|564182[0-9]{12}|564182[0-9]{13}|633110[0-9]{10}|633110[0-9]{12}|633110[0-9]{13}$' },
    { 'UnionPayCard': '^(62[0-9]{14,17})$' },
    { 'VisaCard': '^4[0-9]{12}(?:[0-9]{3})?$' },
    { 'VisaMasterCard': '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$' },
  ];

  monthPattern: any = /^1[0-2]$|^0[1-9]$/;
  yearPattern: any = /^\d{4}$/;
  cvvPattern: any = /^\d{3}$/;

  cardData: any;
  dd: any;
  mm: any;
  yyyy: any;

  today = new Date();
  minDate = new Date(1960, 0, 1);
  maxDate = new Date(this.today.getFullYear() - 13, this.today.getMonth() , this.today.getDate());
  
  accountType: any;
  bankCountry: any;
  accountNumber: any;
  routingNumber: any;
  bankCode: any;
  branchCode: any;
  transitNumber: any;
  institutionNumber: any;
  acName: any;
  sortCode: any;
  clearingCode: any;
  currency: any;
  accountFName: any;
  accountLName: any;
  playerData: any;
  lastNum: any;

  addLine1: any = '';
  addLine2: any = '';
  city: any = '';
  state: any = '';
  pin: any = '';
  ssn: any = '';

  showBank = false;

  stripeId: any;
  bankDetails: any;
  role: any;
  countryList: any;
  disable: any = false;

  constructor(private http: Http, private userProfile: UserProfileService,
    public auth_Service: AuthService, private sendData: SendDataService,
    private getData: GetDataService,
  private notify: ToastrService, private _zone: NgZone) { }

  ngOnInit() {
    this.role = this.auth_Service .role;
    this.stripeId = this.auth_Service.stripeID;
    this.getData.getCountry().then(
      (resolve) => {
        this.countryList = resolve;
      },
      reject => {
        console.log(reject);
        return;
      }
    );
    if (this.role !== 'coach' ) {
      this.auth_Service.getCardDetails();
    }

    if (this.stripeId !== 'null' && this.stripeId) {
      this.getData.getBankDetails().subscribe(
        data => {
          this.bankDetails = data.json().data;
          this.accountFName = this.bankDetails.first_name;
          this.accountLName = this.bankDetails.last_name;
          this.currency = this.bankDetails.currency;
          this.dob = new Date(this.bankDetails.dob.year,this.bankDetails.dob.month - 1,
            this.bankDetails.dob.day);
          this.bankCountry = this.bankDetails.country_code;
          this.addLine1 = this.bankDetails.address.line1;
          this.addLine2 = this.bankDetails.address.line2;
          this.city = this.bankDetails.address.city;
          this.state = this.bankDetails.address.state;
          this.pin = this.bankDetails.address.postal_code;
          this.showBank = true;
          this.disable = true;
          this.lastNum = this.bankDetails.last_4_digit_account_number;
        },
        error => {
          this.notify.warning('No Bank Details');
          console.log(error.json());
        }
      );
    } else if (!this.stripeId) {
      return;
    }
  }

  changeCountry(countryCode: any) {
    this.bankCountry = countryCode;
    let tempCountry = this.countryList.filter(
      country => {
        return country.alpha2Code === countryCode;
      }
    );
    this.currency = tempCountry[0].currencies[0].code;
  }

  changeAcType(value: any) {
    this.accountType = value;
  }

  saveBank() {
    if (this.role === 'coach' && this.currency && this.bankCountry) {
      let body = {
        'routing': this.routingNumber,
        'accountNo': this.accountNumber,
        'country': this.bankCountry,
        'bankCode': this.bankCode,
        'branchCode': this.branchCode,
        'transitNo': this.transitNumber,
        'institueNo': this.institutionNumber,
        'acName': this.acName,
        'sortCode': this.sortCode,
        'clearCode': this.clearingCode,
        'currency': this.currency.toLowerCase(),
        'Fname': this.accountFName,
        'Lname': this.accountLName,
        'dob': this.dob,
        'AcType': this.accountType,
        'addLine1': this.addLine1,
        'addLine2': this.addLine2,
        'city': this.city,
        'state': this.state,
        'pin': this.pin,
        'ssn': this.ssn
      };
      let prom = this.sendData.saveCoachBank(body);
      prom.then(
        (res) => {
          this.accountNumber = '*********'+this.accountNumber.slice(-4);
          this.routingNumber = '******';
          this.bankCode = '****';
          this.branchCode = '*****';
          this.transitNumber = '*****';
          this.institutionNumber = '***';
          this.clearingCode = '***';
          this.showBank = true;
          this.disable = true;
        },
        (rej) => {
          this.showBank = false;
          this.disable = false;
          this.notify.error('Error in Updating Bank Details');
        }
      );
    } else {
      this.notify.warning('Enter Details Correctly');
      return;
    }
  }

  deleteCard() {
    this.cardName = '';
    this.cardNumber = '';
    this.cardCVV = '';
    this.cardDateMonth = '';
    this.cardDateYear = '';
    this.auth_Service.deleteCard();
  }

  deleteBank() {
    let delProm = this.sendData.deleteBank();
    delProm.then(
      (res) => {
        this.stripeId = '';
        this.showBank = false;
        this.disable = false;
      },
      (rej) => {
        return;
      }
    );
  }

  onlyAlpha(event) {
    const pattern = /^[a-zA-Z ]*$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onlyNum(event) {
    const pattern = /^[0-9]$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  validateCard() {
    if (this.cardName && this.cardCVV && this.cardNumber && this.cardDateMonth && this.cardDateYear) {
      if (this.cardName.trim().length) {
        if (this.validateCardNumberPattern(this.cardNumber)) {
          if (this.validateCardMonth(this.cardDateMonth)) {
            if (this.validateCardYear(this.cardDateYear)) {
              if (this.validateCvv(this.cardCVV)) {
                this.getToken();
              } else {
                this.notify.warning('Enter valid cvv');
              }
            } else {
              this.notify.warning('Enter valid year');
            }
          } else {
            this.notify.warning('Enter valid month');
          }
        } else {
          this.notify.warning('Enter valid card number');
        }
      } else {
        this.notify.warning('Enter valid Name');
      }
    } else {
      this.notify.warning('Please fill in all fields');
    }
  }

  validateCardNumberPattern(num) {
    let result: any = false; let reg;
    let Num;
    let patternKey;
    for (let i = 0; i < this.cardPattern.length; i++) {
      patternKey = (Object.getOwnPropertyNames(this.cardPattern[i])).toString();
      Num = num.toString();
      reg = new RegExp(this.cardPattern[i][patternKey], 'ig');
      result = reg.test(Num);
      if (result) {
        
        return result;
      } else if (i == this.cardPattern.length - 1) {
        return result;
      }
    }
  }
  validateCardMonth(month) {
    const result = this.monthPattern.test(month);
    return result;
  }
  validateCardYear(year) {
    const result = this.yearPattern.test(year);
    return result;
  }
  validateCvv(cvv) {
    const result = this.cvvPattern.test(cvv);
    return result;
  }
  getCardData(carData) {
    this.stripeImg = (carData['data']['brand'] == 'Visa')? 'card-placement visa' :(carData['data']['brand'] == 'Discover')? 'card-placement discover' : (carData['data']['brand'] == 'Diners Club')? 'card-placement diners':(carData['data']['brand'] == 'MasterCard')? 'card-placement master':(carData['data']['brand'] == 'American Express')? 'card-placement amex':(carData['data']['brand'] == 'JCB')? 'card-placement jcb' : 'card-placement fa fa-credit-card';
    
  }

  dobEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    let date = event.value;
    this.dd = date.getDate();
    this.mm = date.getMonth();
    this.yyyy = date.getFullYear();
    if (this.dd < 10) {
      this.dd = '0' + this.dd;
    }
    if (this.mm < 10) {
      this.mm = '0' + this.mm;
    }
    this.dob = new Date(this.yyyy, this.mm,
      this.dd);
  }


  getToken() {
    (<any>window).Stripe.card.createToken({
      number: this.cardNumber,
      exp_month: this.cardDateMonth,
      exp_year: this.cardDateYear,
      cvc: this.cardCVV
    }, (status: number, response: any) => {
      this._zone.run(() => {
      if (status === 200) {
        this.message = `Success! Card token ${response.card.id}.`;
        this.auth_Service.saveCard(response.id);
      } else {
        this.message = response.error.message;
        this.notify.error(this.message);
        this.notify.warning(response.error.message);
      }
    });
  });
  }

}

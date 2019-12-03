import { NotificationService } from './notification.service';
import { UploadVideoService } from './upload-video.service';
import { AuthGuardService } from './auth-guard.service';
import { SendDataService } from './send-data.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MatNativeDateModule,
  MatSidenavModule,
  MatToolbarModule,
  MatSelectModule,
  MatRadioModule,
  MatFormFieldModule,
  MatListModule,
  MatIconModule,
  MatSnackBarModule,
  MatButtonModule,
  MatInputModule,
  MatGridListModule,
  MatSlideToggleModule
} from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { CoachesComponent } from './coaches/coaches.component';
import { VideosComponent } from './videos/videos.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthService } from './auth.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { GetDataService } from './get-data.service';
import { SelectedVideoComponent } from './selected-video/selected-video.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { CookieService } from 'ngx-cookie-service';
import { CoachPostsComponent } from './coach-posts/coach-posts.component';
import { CoachReviewComponent } from './coach-review/coach-review.component';
import { PlayersComponent } from './players/players.component';
import { ToastrModule } from 'ngx-toastr';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileService } from './user-profile.service';
import { PendingPipe } from './pending.pipe';
import { SearchService } from './search.service';
import { SearchPipe } from './search.pipe';
import { HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'angular2-moment';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { VodCardComponent } from './vod-card/vod-card.component';
import { CoachReviewCardComponent } from './coach-review-card/coach-review-card.component';
import { CoachProfileComponent } from './coach-profile/coach-profile.component';
import { PlayerProfileComponent } from './player-profile/player-profile.component';
import { AuthComponent } from './auth/auth.component';
import { PaymentComponent } from './payment/payment.component';
import { CarouselComponent } from './carousel/carousel.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentSummaryComponent } from './payment-summary/payment-summary.component';
import { DatePipe } from '@angular/common';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { PrivacyComponent } from './privacy/privacy.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { HmtComponent } from './hmt/hmt.component';
import { QrCodeComponent } from './qr-code/qr-code.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    CoachesComponent,
    VideosComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    SelectedVideoComponent,
    CreatePostComponent,
    CoachPostsComponent,
    CoachReviewComponent,
    PlayersComponent,
    UserProfileComponent,
    PendingPipe,
    SearchPipe,
    ProgressBarComponent,
    VodCardComponent,
    CoachReviewCardComponent,
    CoachProfileComponent,
    PlayerProfileComponent,
    AuthComponent,
    PaymentComponent,
    CarouselComponent,
    ChangePasswordComponent,
    CheckoutComponent,
    PaymentSummaryComponent,
    PrivacyComponent,
    HmtComponent,
    QrCodeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    HttpModule,
    MomentModule,
    HttpClientModule,
    AppRoutingModule,
    SweetAlert2Module.forRoot({
      customClass: 'ngx-swal',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    }),
    ToastrModule.forRoot({
      easeTime: '250',
      easing: 'ease-in',
      preventDuplicates: true
    }),
    MatSidenavModule,
    MatToolbarModule,
    MatDialogModule,
    MatSelectModule,
    MatRadioModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatDatepickerModule,
    NoopAnimationsModule,
    AngularMultiSelectModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#26ace2',
      innerStrokeColor: '#ee0f7b',
      animationDuration: 0
    })
  ],
  providers: [
    AuthService,
    GetDataService,
    SendDataService,
    AuthGuardService,
    UploadVideoService,
    CookieService,
    UserProfileService,
    SearchService,
    NotificationService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

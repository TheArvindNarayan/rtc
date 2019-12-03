import { QrCodeComponent } from './qr-code/qr-code.component';
import { HmtComponent } from './hmt/hmt.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PaymentComponent } from './payment/payment.component';
import { AuthComponent } from './auth/auth.component';
import { CoachProfileComponent } from './coach-profile/coach-profile.component';
import { PlayersComponent } from './players/players.component';
import { PlayerProfileComponent } from './player-profile/player-profile.component'
import { CoachReviewComponent } from './coach-review/coach-review.component';
import { CoachPostsComponent } from './coach-posts/coach-posts.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SelectedVideoComponent } from './selected-video/selected-video.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { CoachesComponent } from './coaches/coaches.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VideosComponent } from './videos/videos.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuardService } from './auth-guard.service';
import { CreatePostComponent } from './create-post/create-post.component';
import { PaymentSummaryComponent } from './payment-summary/payment-summary.component';


const routes: Routes = [
  {
    path: 'app',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'videos',
        pathMatch: 'full',
        canActivate: [AuthGuardService]
      },
      {
        path: 'inbox',
        component: CoachPostsComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'player',
        component: PlayersComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'coaches',
        component: CoachesComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'videos',
        component: VideosComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'selectedVideo/:id',
        component: SelectedVideoComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'coachProfile/:id',
        component: CoachProfileComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'playerProfile/:id',
        component: PlayerProfileComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'coachReview/:id',
        component: CoachReviewComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'checkout/:cid/:pid',
        component: CheckoutComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'checkout/:cid',
        component: CheckoutComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'userProfile',
        component: UserProfileComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'changePassword',
        component: ChangePasswordComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'createPost',
        component: CreatePostComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'createPost/:id',
        component: CreatePostComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'payment',
        component: PaymentComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'privacy',
        component: PrivacyComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'reeltime-cloud',
        component: HmtComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'paymentsummary/:role',
        component: PaymentSummaryComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'qrCode',
        component: QrCodeComponent,
        canActivate: [AuthGuardService]
      }
    ]
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'Login',
        pathMatch: 'full',
      },
      {
        path: 'Login',
        component: LoginComponent
      },
      {
        path: 'SignUp',
        component: SignupComponent
      },
      {
        path: 'forgotPassword',
        component: ForgotPasswordComponent
      },
      {
        path: 'signupDetails',
        component: UserProfileComponent
      },
    ]
  },
  {
    path: 'login',
    redirectTo: '/auth/Login',
    pathMatch: 'full'
  },
  {
    path: 'forgotPassword',
    redirectTo: '/auth/forgotPassword',
    pathMatch: 'full'
  },
  {
    path: 'signup',
    redirectTo: '/auth/SignUp',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/app/videos',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }

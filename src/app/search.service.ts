import { Subject } from 'rxjs/Subject';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class SearchService {
  searchTerm = new Subject();

  constructor(private router: Router,
    private route: ActivatedRoute,
  private auth: AuthService) { }

  search(term: any) {
    let currentRoute: any;
    let role = this.auth.role;
    currentRoute = this.router.url;
    if (currentRoute.includes('video') || currentRoute.includes('inbox')
        || currentRoute.includes('coaches') || currentRoute.includes('player') || currentRoute.includes('paymentsummary')) {
          this.searchTerm.next(term);
    } else if (role === 'player') {
      this.router.navigate(['/app/videos'], { relativeTo: this.route });
    } else if (role === 'coach') {
      this.router.navigate(['/app/inbox'], { relativeTo: this.route });
    }
  }

  returnSearchTerm() {
    return this.searchTerm.asObservable();
  }

}
